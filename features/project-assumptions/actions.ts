"use server";

import { redirect } from "next/navigation";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { canEditProject, getAuthorizedProject } from "@/features/projects/queries";
import { createClient } from "@/lib/supabase/server";
import { getSafeAssumptionError } from "./errors";
import {
  assumptionInputSchema,
  assumptionTransitionSchema,
  invalidateAssumptionSchema,
  retireAssumptionSchema,
  validateAssumptionSchema,
} from "./schemas";

const value = (data: FormData, key: string) => String(data.get(key) ?? "");

export type AssumptionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  values?: Record<string, string | undefined>;
};

async function managerContext(projectId: string) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const membership = await getActiveOrganizationMembership(supabase, data.user.id);
  if (membership.status !== "found") return null;
  const { data: project } = await getAuthorizedProject(supabase, projectId);
  if (!project || !(await canEditProject(supabase, data.user.id, project, membership.membership))) return null;
  return { supabase, project };
}

export async function saveProjectAssumption(
  _: AssumptionState,
  data: FormData,
): Promise<AssumptionState> {
  const operation = value(data, "operation");
  const common = {
    operation,
    projectId: value(data, "projectId"),
    title: value(data, "assumptionTitle"),
    description: value(data, "assumptionDescription"),
    category: value(data, "assumptionCategory"),
    planningRationale: value(data, "planningRationale"),
    validationMethod: value(data, "validationMethod"),
    impactIfFalse: value(data, "impactIfFalse"),
    confidence: value(data, "assumptionConfidence"),
    ownerMembershipId: value(data, "assumptionOwner"),
    validationDueDate: value(data, "assumptionDueDate"),
    validationEvidence: value(data, "assumptionEvidence"),
  };
  const raw =
    operation === "create"
      ? { ...common, recordedDate: value(data, "assumptionRecordedDate") }
      : { ...common, assumptionId: value(data, "assumptionId") };
  const parsed = assumptionInputSchema.safeParse(raw);
  if (!parsed.success)
    return {
      status: "error",
      message: "Review the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  const context = await managerContext(parsed.data.projectId);
  if (!context)
    return { status: "error", message: "You do not have permission to manage assumptions.", values: raw };
  const args = {
    p_title: parsed.data.title,
    p_description: parsed.data.description,
    p_category: parsed.data.category,
    p_planning_rationale: parsed.data.planningRationale,
    p_validation_method: parsed.data.validationMethod,
    p_impact_if_false: parsed.data.impactIfFalse,
    p_confidence: parsed.data.confidence,
    p_owner_membership_id: parsed.data.ownerMembershipId,
    p_validation_due_date: parsed.data.validationDueDate,
    p_validation_evidence: parsed.data.validationEvidence ?? "",
  };
  const result =
    parsed.data.operation === "create"
      ? await context.supabase.rpc("create_project_assumption", {
          p_project_id: context.project.id,
          p_recorded_date: parsed.data.recordedDate,
          ...args,
        })
      : await context.supabase.rpc("update_project_assumption", {
          p_assumption_id: parsed.data.assumptionId,
          ...args,
        });
  if (result.error)
    return { status: "error", message: getSafeAssumptionError(result.error), values: raw };
  redirect(
    `/projects/${context.project.id}/raid?assumptionUpdated=${parsed.data.operation === "create" ? "created" : "edited"}#assumptions`,
  );
}

export async function transitionProjectAssumption(data: FormData) {
  const raw = {
    projectId: value(data, "projectId"),
    assumptionId: value(data, "assumptionId"),
    targetStatus: value(data, "targetStatus"),
  };
  const parsed = assumptionTransitionSchema.safeParse(raw);
  if (!parsed.success) redirect(`/projects/${raw.projectId}/raid?assumptionError=validation#assumptions`);
  const context = await managerContext(parsed.data.projectId);
  if (!context) redirect(`/projects/${parsed.data.projectId}/raid?assumptionError=permission#assumptions`);
  const { error } = await context.supabase.rpc("transition_project_assumption_active", {
    p_assumption_id: parsed.data.assumptionId,
    p_target_status: parsed.data.targetStatus,
  });
  if (error) redirect(`/projects/${context.project.id}/raid?assumptionError=unavailable#assumptions`);
  redirect(`/projects/${context.project.id}/raid?assumptionUpdated=status#assumptions`);
}

export async function validateProjectAssumption(data: FormData) {
  return terminal(data, "validate");
}
export async function invalidateProjectAssumption(data: FormData) {
  return terminal(data, "invalidate");
}
export async function retireProjectAssumption(data: FormData) {
  return terminal(data, "retire");
}

async function terminal(data: FormData, kind: "validate" | "invalidate" | "retire") {
  const raw = {
    projectId: value(data, "projectId"),
    assumptionId: value(data, "assumptionId"),
    validationEvidence: value(data, "validationEvidence"),
    outcomeNotes: value(data, "outcomeNotes"),
    confirm: value(data, "confirm"),
  };
  const schema =
    kind === "validate"
      ? validateAssumptionSchema
      : kind === "invalidate"
        ? invalidateAssumptionSchema
        : retireAssumptionSchema;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) redirect(`/projects/${raw.projectId}/raid?assumptionError=validation#assumptions`);
  const context = await managerContext(parsed.data.projectId);
  if (!context) redirect(`/projects/${parsed.data.projectId}/raid?assumptionError=permission#assumptions`);
  const result =
    kind === "validate"
      ? await context.supabase.rpc("validate_project_assumption", {
          p_assumption_id: parsed.data.assumptionId,
          p_validation_evidence: parsed.data.validationEvidence!,
          p_outcome_notes: parsed.data.outcomeNotes,
        })
      : kind === "invalidate"
        ? await context.supabase.rpc("invalidate_project_assumption", {
            p_assumption_id: parsed.data.assumptionId,
            p_validation_evidence: parsed.data.validationEvidence!,
            p_outcome_notes: parsed.data.outcomeNotes,
          })
        : await context.supabase.rpc("retire_project_assumption", {
            p_assumption_id: parsed.data.assumptionId,
            p_outcome_notes: parsed.data.outcomeNotes,
          });
  if (result.error) redirect(`/projects/${context.project.id}/raid?assumptionError=unavailable#assumptions`);
  const outcome = kind === "validate" ? "validated" : kind === "invalidate" ? "invalidated" : "retired";
  redirect(`/projects/${context.project.id}/raid?assumptionUpdated=${outcome}#assumptions`);
}
