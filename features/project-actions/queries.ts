import type{SupabaseClient}from"@supabase/supabase-js";import type{Database}from"@/lib/supabase/database.types";
export const getProjectActions=(supabase:SupabaseClient<Database>,projectId:string)=>supabase.rpc("get_project_actions",{p_project_id:projectId});
export const getEligibleActionOwners=(supabase:SupabaseClient<Database>,projectId:string)=>supabase.rpc("get_eligible_action_owners",{p_project_id:projectId});
