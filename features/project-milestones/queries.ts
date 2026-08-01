import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export function getProjectMilestones(supabase: SupabaseClient<Database>, projectId: string) {
  return supabase.from("milestones").select("id, project_id, title, description, target_date, status, completed_at, cancelled_at, created_at, updated_at").eq("project_id", projectId).order("target_date").order("id");
}
