import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ApplicationShell } from "@/features/organizations/components/application-shell";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/sign-in");

  const membership = await getActiveOrganizationMembership(supabase, data.user.id);
  if (membership.status === "none") redirect("/onboarding");
  if (membership.status === "error") {
    throw new Error("Unable to verify workspace access.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", data.user.id)
    .maybeSingle();
  const userLabel = profile?.full_name || data.user.email || "Signed-in user";

  return (
    <ApplicationShell organizationName={membership.membership.organizationName} userLabel={userLabel}>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-semibold text-sky-700">Workspace ready</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your organization workspace is ready</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            {membership.membership.organizationName} is set up securely. Creating the first project is the next step.
          </p>
          <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-900">No projects yet</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Project creation will be added in the next checkpoint.</p>
          </div>
        </div>
      </section>
    </ApplicationShell>
  );
}
