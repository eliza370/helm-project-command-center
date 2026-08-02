import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export const getProjectDecisions = (supabase: SupabaseClient<Database>, projectId: string) =>
  supabase
    .from("project_decisions")
    .select("*, creator:profiles!project_decisions_created_by_fkey(full_name), corrector:profiles!project_decisions_last_corrected_by_fkey(full_name)")
    .eq("project_id", projectId)
    .order("decision_date", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });
