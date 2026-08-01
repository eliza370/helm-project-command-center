import type{SupabaseClient}from"@supabase/supabase-js";import type{Database}from"@/lib/supabase/database.types";
export const getProjectDeliverables=(supabase:SupabaseClient<Database>,projectId:string)=>supabase.rpc("get_project_deliverables",{p_project_id:projectId});
export const getEligibleDeliverableOwners=(supabase:SupabaseClient<Database>,projectId:string)=>supabase.rpc("get_eligible_deliverable_owners",{p_project_id:projectId});
export const getAssignableDeliverableMilestones=(supabase:SupabaseClient<Database>,projectId:string)=>supabase.rpc("get_assignable_deliverable_milestones",{p_project_id:projectId});

