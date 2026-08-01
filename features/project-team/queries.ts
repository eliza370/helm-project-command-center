import type{SupabaseClient}from"@supabase/supabase-js";import type{Database}from"@/lib/supabase/database.types";
export async function getProjectTeam(s:SupabaseClient<Database>,projectId:string){return s.rpc("get_project_team",{p_project_id:projectId})}
export async function getEligibleProjectMembers(s:SupabaseClient<Database>,projectId:string){return s.rpc("get_eligible_project_members",{p_project_id:projectId})}
