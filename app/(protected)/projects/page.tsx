import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ApplicationShell } from "@/features/organizations/components/application-shell";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { ProjectEmptyState } from "@/features/projects/components/project-empty-state";
import { getAuthorizedProjects } from "@/features/projects/queries";
import Link from "next/link";
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
  const { data: projects, error: projectsError } = await getAuthorizedProjects(supabase, membership.membership.organizationId);
  if (projectsError) throw new Error("Unable to load authorized projects.");
  const canCreate = membership.membership.role === "Administrator";

  return (
    <ApplicationShell organizationName={membership.membership.organizationName} userLabel={userLabel}>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-sky-700">Project workspace</p><h1 className="mt-1 text-3xl font-semibold text-slate-950">Projects</h1></div>{canCreate&&projects?.length?<Link href="/projects/new" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Create project</Link>:null}</div>
        {!projects?.length?<ProjectEmptyState canCreate={canCreate}/>:<div className="grid gap-4">{projects.map(project=><Link key={project.id} href={`/projects/${project.id}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"><h2 className="text-lg font-semibold text-slate-950">{project.name}</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><div><dt className="text-slate-500">Lifecycle phase</dt><dd className="font-medium">{project.lifecycle_phase}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="font-medium">{project.status}</dd></div><div><dt className="text-slate-500">Overall health</dt><dd className="font-medium">{project.overall_health}</dd></div><div><dt className="text-slate-500">Target completion</dt><dd className="font-medium">{project.target_completion_date}</dd></div></dl></Link>)}</div>}
      </section>
    </ApplicationShell>
  );
}
