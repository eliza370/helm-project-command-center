"use server";
import { redirect } from "next/navigation";
import { getSafeProjectError } from "./errors";
import { createProjectSchema } from "./schemas";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

export type ProjectActionState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string[] | undefined>; values?: Record<string, string> };
const value = (data: FormData, name: string) => typeof data.get(name) === "string" ? String(data.get(name)) : "";

export async function createProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  const names = ["name","description","businessObjective","sponsorName","sponsorEmail","lifecyclePhase","status","startDate","targetCompletionDate","overallHealth","scopeHealth","scheduleHealth","budgetHealth","resourceHealth","riskHealth"];
  const values = Object.fromEntries(names.map((name) => [name, value(formData, name)]));
  const parsed = createProjectSchema.safeParse(values);
  if (!parsed.success) return { status: "error", message: "Review the highlighted fields and try again.", fieldErrors: parsed.error.flatten().fieldErrors, values };

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) return { status: "error", message: "Your session could not be verified. Sign in again.", values };
  const lookup = await getActiveOrganizationMembership(supabase, data.user.id);
  if (lookup.status === "error") return { status: "error", message: "We could not verify your organization access. Try again.", values };
  if (lookup.status === "none" || lookup.membership.role !== "Administrator") return { status: "error", message: "You do not have permission to create a project in this organization.", values };

  const p = parsed.data;
  const { data: projectId, error } = await supabase.rpc("create_project", {
    p_organization_id: lookup.membership.organizationId, p_name: p.name, p_description: p.description ?? "",
    p_business_objective: p.businessObjective, p_sponsor_name: p.sponsorName, p_sponsor_email: p.sponsorEmail ?? "",
    p_lifecycle_phase: p.lifecyclePhase, p_status: p.status, p_start_date: p.startDate, p_target_completion_date: p.targetCompletionDate,
    p_actual_completion_date: null as unknown as string, p_overall_health: p.overallHealth, p_scope_health: p.scopeHealth,
    p_schedule_health: p.scheduleHealth, p_budget_health: p.budgetHealth, p_resource_health: p.resourceHealth, p_risk_health: p.riskHealth,
  });
  if (error || !projectId) return { status: "error", message: getSafeProjectError(error ?? {}), values };
  redirect(`/projects/${projectId}?created=true`);
}
