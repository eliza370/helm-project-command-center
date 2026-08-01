import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

export type ActiveOrganizationMembership = {
  id: string;
  organizationId: string;
  organizationName: string;
  role: string;
  status: "Active";
};

export type MembershipLookup =
  | { status: "found"; membership: ActiveOrganizationMembership }
  | { status: "none" }
  | { status: "error" };

export async function getActiveOrganizationMembership(
  supabase: SupabaseClient<Database>,
  userId: User["id"],
): Promise<MembershipLookup> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("id, organization_id, role, status, joined_at, organizations!inner(name)")
    .eq("user_id", userId)
    .eq("status", "Active")
    .order("joined_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) return { status: "error" };
  if (!data) return { status: "none" };

  const organization = Array.isArray(data.organizations)
    ? data.organizations[0]
    : data.organizations;

  if (!organization?.name || data.status !== "Active") {
    return { status: "error" };
  }

  // The foundation permits multiple active memberships across organizations.
  // Until switching exists, the earliest membership is the deterministic context.
  return {
    status: "found",
    membership: {
      id: data.id,
      organizationId: data.organization_id,
      organizationName: organization.name,
      role: data.role,
      status: "Active",
    },
  };
}
