import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { OrganizationOnboardingForm } from "@/features/organizations/components/organization-onboarding-form";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Create your workspace" };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/sign-in");

  const membership = await getActiveOrganizationMembership(supabase, data.user.id);
  if (membership.status === "found") redirect("/projects");
  if (membership.status === "error") {
    throw new Error("Unable to verify workspace access.");
  }

  const defaultFullName =
    typeof data.user.user_metadata.full_name === "string"
      ? data.user.user_metadata.full_name
      : undefined;

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[minmax(320px,0.9fr)_minmax(480px,1.1fr)]">
      <section className="flex flex-col justify-between bg-slate-900 px-6 py-10 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-14">
        <div className="flex items-start justify-between gap-4">
          <p className="text-2xl font-semibold tracking-tight">Helm</p>
          <form action="/auth/sign-out" method="post">
            <button type="submit" className="min-h-10 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Sign out
            </button>
          </form>
        </div>
        <div className="max-w-lg py-12 lg:py-0">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">First workspace</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Set up your organization</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Create the secure organization workspace where your projects will live. You will become its Administrator.
          </p>
        </div>
        <p className="text-sm text-slate-400">Plan. Navigate. Deliver.</p>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-semibold text-sky-700">Organization onboarding</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Create your Helm workspace</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">You can add projects after this one-time setup.</p>
          </div>
          <OrganizationOnboardingForm defaultFullName={defaultFullName} />
        </div>
      </section>
    </main>
  );
}
