"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { canEditProject, getAuthorizedProject } from "@/features/projects/queries";
import { correctDecisionSchema, createDecisionSchema } from "./schemas";
import { getSafeDecisionError } from "./errors";

export type DecisionState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string[]>; values?: Record<string, string> };
const value = (data: FormData, key: string) => String(data.get(key) ?? "");

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

export async function saveProjectDecision(_: DecisionState, data: FormData): Promise<DecisionState> {
  const operation = value(data, "operation");
  const raw = {
    projectId: value(data, "projectId"), title: value(data, "title"), context: value(data, "context"),
    decision: value(data, "decision"), rationale: value(data, "rationale"), alternativesConsidered: value(data, "alternativesConsidered"),
    consequences: value(data, "consequences"), decisionMakerName: value(data, "decisionMakerName"), decisionDate: value(data, "decisionDate"),
    effectiveDate: value(data, "effectiveDate"), followUpNotes: value(data, "followUpNotes"),
    ...(operation === "correct" ? { decisionId: value(data, "decisionId"), correctionReason: value(data, "correctionReason"), confirmCorrection: value(data, "confirmCorrection") } : {}),
  };
  const parsed = operation === "correct" ? correctDecisionSchema.safeParse(raw) : createDecisionSchema.safeParse(raw);
  if (!parsed.success) return { status: "error", message: "Review the highlighted fields and try again.", fieldErrors: parsed.error.flatten().fieldErrors, values: raw };
  const context = await managerContext(parsed.data.projectId);
  if (!context) return { status: "error", message: "You do not have permission to manage decisions.", values: raw };
  const common = {
    p_title: parsed.data.title, p_context: parsed.data.context, p_decision: parsed.data.decision, p_rationale: parsed.data.rationale,
    p_alternatives_considered: parsed.data.alternativesConsidered, p_consequences: parsed.data.consequences,
    p_decision_maker_name: parsed.data.decisionMakerName, p_decision_date: parsed.data.decisionDate,
    p_effective_date: parsed.data.effectiveDate as unknown as string, p_follow_up_notes: parsed.data.followUpNotes as unknown as string,
  };
  let result;
  if (operation === "correct") {
    const correction = correctDecisionSchema.parse(raw);
    result = await context.supabase.rpc("correct_project_decision", { p_decision_id: correction.decisionId, p_correction_reason: correction.correctionReason, ...common });
  } else result = await context.supabase.rpc("create_project_decision", { p_project_id: context.project.id, ...common });
  if (result.error) return { status: "error", message: getSafeDecisionError(result.error), values: raw };
  redirect(`/projects/${context.project.id}/decisions?updated=${operation === "correct" ? "corrected" : "created"}`);
}
