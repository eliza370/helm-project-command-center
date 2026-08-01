"use server";
import { redirect } from "next/navigation";
import { getSafeProjectError, getSafeProjectUpdateError } from "./errors";
import { createProjectSchema, updateProjectSchema } from "./schemas";
import { canEditProject, getAuthorizedProject } from "./queries";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

export type ProjectActionState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string[] | undefined>; values?: Record<string, string> };
const value = (data: FormData, name: string) => typeof data.get(name) === "string" ? String(data.get(name)) : "";
const fieldNames = ["name","description","businessObjective","sponsorName","sponsorEmail","lifecyclePhase","status","startDate","targetCompletionDate","overallHealth","scopeHealth","scheduleHealth","budgetHealth","resourceHealth","riskHealth"];

export async function createProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  const values = Object.fromEntries(fieldNames.map((name) => [name, value(formData, name)]));
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

export async function updateProjectAction(_state: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  const values = Object.fromEntries(fieldNames.map((name) => [name, value(formData, name)]));
  const input = {...values, confirmTerminal: value(formData,"confirmTerminal")};
  const parsed = updateProjectSchema.safeParse(input);
  if(!parsed.success)return{status:"error",message:"Review the highlighted fields and try again.",fieldErrors:parsed.error.flatten().fieldErrors,values};
  const projectId=value(formData,"projectId");
  if(!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(projectId))return{status:"error",message:"This project is not available.",values};
  const supabase=await createClient();const{data,error:authError}=await supabase.auth.getUser();if(authError||!data.user)return{status:"error",message:"Your session could not be verified. Sign in again.",values};
  const membership=await getActiveOrganizationMembership(supabase,data.user.id);if(membership.status!=="found")return{status:"error",message:membership.status==="error"?"We could not verify your organization access. Try again.":"You do not have permission to update this project.",values};
  const{data:project,error:projectError}=await getAuthorizedProject(supabase,projectId);if(projectError||!project)return{status:"error",message:"This project is not available.",values};
  if(!await canEditProject(supabase,data.user.id,project,membership.membership))return{status:"error",message:"You do not have permission to update this project.",values};
  if(["Completed","Cancelled"].includes(project.status)&&!(["Completed","Cancelled"].includes(parsed.data.status)))return{status:"error",message:"Reopening completed or cancelled projects is not available.",values};
  const p=parsed.data;const{data:updatedProject,error}=await supabase.from("projects").update({name:p.name,description:p.description??null,business_objective:p.businessObjective,sponsor_name:p.sponsorName,sponsor_email:p.sponsorEmail??null,lifecycle_phase:p.lifecyclePhase,status:p.status,start_date:p.startDate,target_completion_date:p.targetCompletionDate,overall_health:p.overallHealth,scope_health:p.scopeHealth,schedule_health:p.scheduleHealth,budget_health:p.budgetHealth,resource_health:p.resourceHealth,risk_health:p.riskHealth}).eq("id",project.id).select("id").maybeSingle();
  if(error||!updatedProject)return{status:"error",message:getSafeProjectUpdateError(error??{code:"42501"}),values};redirect(`/projects/${project.id}?updated=true`);
}
