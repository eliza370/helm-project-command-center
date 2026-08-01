"use server";
import { redirect } from "next/navigation";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { canEditProject, getAuthorizedProject } from "@/features/projects/queries";
import { createClient } from "@/lib/supabase/server";
import { getSafeMilestoneError } from "./errors";
import { milestoneInputSchema, milestoneTransitionSchema } from "./schemas";

export type MilestoneValues = { title?: string; description?: string; targetDate?: string };
export type MilestoneActionState = { status: "idle" | "error"; message?: string; fieldErrors?: Record<string, string[]>; values?: MilestoneValues };
const value = (data: FormData, key: string) => String(data.get(key) ?? "");

async function managerContext(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const membership = await getActiveOrganizationMembership(supabase, data.user.id);
  if (membership.status !== "found") return null;
  const { data: project, error: projectError } = await getAuthorizedProject(supabase, projectId);
  if (projectError || !project || !await canEditProject(supabase, data.user.id, project, membership.membership)) return null;
  return { supabase, user: data.user, project };
}

export async function saveMilestoneAction(_state: MilestoneActionState, formData: FormData): Promise<MilestoneActionState> {
  const raw = { operation: value(formData,"operation"), projectId: value(formData,"projectId"), milestoneId: value(formData,"milestoneId") || undefined, title: value(formData,"title"), description: value(formData,"description"), targetDate: value(formData,"targetDate") };
  const values = { title: raw.title, description: raw.description, targetDate: raw.targetDate };
  const parsed = milestoneInputSchema.safeParse(raw);
  if (!parsed.success) return { status:"error", message:"Review the highlighted fields and try again.", fieldErrors:parsed.error.flatten().fieldErrors, values };
  const context = await managerContext(parsed.data.projectId);
  if (!context) return { status:"error", message:"You do not have permission to manage milestones.", values };
  const payload = { title:parsed.data.title, description:parsed.data.description ?? null, target_date:parsed.data.targetDate };
  const result = parsed.data.operation === "create"
    ? await context.supabase.from("milestones").insert({ ...payload, project_id:context.project.id, created_by:context.user.id }).select("id").maybeSingle()
    : await context.supabase.from("milestones").update(payload).eq("id", parsed.data.milestoneId!).eq("project_id", context.project.id).eq("status", "Planned").select("id").maybeSingle();
  if (result.error) return { status:"error", message:getSafeMilestoneError(result.error), values };
  if (!result.data) return { status:"error", message:"This planned milestone is no longer available to edit.", values };
  redirect(`/projects/${context.project.id}/milestones?updated=${parsed.data.operation === "create" ? "created" : "edited"}`);
}

export async function transitionMilestoneAction(formData: FormData) {
  const parsed = milestoneTransitionSchema.safeParse({ projectId:value(formData,"projectId"), milestoneId:value(formData,"milestoneId"), status:value(formData,"status"), confirm:value(formData,"confirm") });
  if (!parsed.success) redirect(`/projects/${value(formData,"projectId")}/milestones?error=confirmation`);
  const context = await managerContext(parsed.data.projectId);
  if (!context) redirect(`/projects/${parsed.data.projectId}/milestones?error=permission`);
  const { data: milestone } = await context.supabase.from("milestones").select("project_id,status").eq("id",parsed.data.milestoneId).maybeSingle();
  if (!milestone || milestone.project_id !== context.project.id || milestone.status !== "Planned") redirect(`/projects/${context.project.id}/milestones?error=unavailable`);
  const { error } = await context.supabase.rpc("transition_milestone", { p_milestone_id:parsed.data.milestoneId, p_status:parsed.data.status });
  if (error) redirect(`/projects/${context.project.id}/milestones?error=unavailable`);
  redirect(`/projects/${context.project.id}/milestones?updated=${parsed.data.status.toLowerCase()}`);
}

