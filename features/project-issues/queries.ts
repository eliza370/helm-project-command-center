import type{SupabaseClient}from"@supabase/supabase-js";import type{Database}from"@/lib/supabase/database.types";
export const getProjectIssues=(s:SupabaseClient<Database>,id:string)=>s.rpc("get_project_issues",{p_project_id:id});
export const getEligibleIssueOwners=(s:SupabaseClient<Database>,id:string)=>s.rpc("get_eligible_issue_owners",{p_project_id:id});
export const getEligibleIssueOrigins=(s:SupabaseClient<Database>,id:string)=>s.rpc("get_eligible_issue_origins",{p_project_id:id});
