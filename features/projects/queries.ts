import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export async function getAuthorizedProjects(supabase: SupabaseClient<Database>, organizationId: string) {
  return supabase.from("projects").select("id, name, lifecycle_phase, status, overall_health, target_completion_date").eq("organization_id", organizationId).order("created_at", { ascending: false });
}

export async function getAuthorizedProject(supabase: SupabaseClient<Database>, projectId: string) {
  return supabase.from("projects").select("id, name, description, business_objective, project_manager_id, sponsor_name, sponsor_email, lifecycle_phase, status, start_date, target_completion_date, overall_health, scope_health, schedule_health, budget_health, resource_health, risk_health").eq("id", projectId).maybeSingle();
}
