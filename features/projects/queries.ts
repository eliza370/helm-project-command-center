import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getAuthorizedProjects(supabase: SupabaseClient<Database>, organizationId: string) {
  return supabase.from("projects").select("id, name, lifecycle_phase, status, overall_health, target_completion_date").eq("organization_id", organizationId).order("created_at", { ascending: false });
}

export async function getAuthorizedProject(supabase: SupabaseClient<Database>, projectId: string) {
  return supabase.from("projects").select("id, organization_id, name, description, business_objective, project_manager_id, sponsor_name, sponsor_email, lifecycle_phase, status, start_date, target_completion_date, overall_health, scope_health, schedule_health, budget_health, resource_health, risk_health").eq("id", projectId).maybeSingle();
}

export async function canEditProject(supabase: SupabaseClient<Database>, userId: string, project: {id:string;organization_id:string;project_manager_id:string}, membership: {organizationId:string;role:string}) {
  if (membership.organizationId !== project.organization_id) return false;
  if (membership.role === "Administrator") return true;
  if (project.project_manager_id !== userId) return false;
  const { data, error } = await supabase.from("project_members").select("id").eq("project_id", project.id).eq("user_id", userId).eq("access_level", "Project Manager").is("left_at", null).maybeSingle();
  return !error && Boolean(data);
}
