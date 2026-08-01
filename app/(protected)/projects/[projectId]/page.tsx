import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { ApplicationShell } from "@/features/organizations/components/application-shell";
import { getActiveOrganizationMembership } from "@/features/organizations/queries";
import { ProjectOverview } from "@/features/projects/components/project-overview";
import { canEditProject, getAuthorizedProject } from "@/features/projects/queries";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectPage({params,searchParams}:{params:Promise<{projectId:string}>;searchParams:Promise<{created?:string;updated?:string}>}) {
  const supabase=await createClient();const{data,error}=await supabase.auth.getUser();if(error||!data.user)redirect("/sign-in");
  const membership=await getActiveOrganizationMembership(supabase,data.user.id);if(membership.status==="none")redirect("/onboarding");if(membership.status==="error")throw new Error("Unable to verify organization access.");
  const{projectId}=await params;if(!z.uuid().safeParse(projectId).success)notFound();const{data:project,error:projectError}=await getAuthorizedProject(supabase,projectId);if(projectError||!project)notFound();
  const{data:manager}=await supabase.from("profiles").select("full_name").eq("id",project.project_manager_id).maybeSingle();const{data:profile}=await supabase.from("profiles").select("full_name").eq("id",data.user.id).maybeSingle();const query=await searchParams;const editable=await canEditProject(supabase,data.user.id,project,membership.membership);
  return <ApplicationShell organizationName={membership.membership.organizationName} userLabel={profile?.full_name||data.user.email||"Signed-in user"}><section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    {query.created==="true"?<p role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Project created successfully.</p>:null}{query.updated==="true"?<p role="status" className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">Project updated successfully.</p>:null}
    <div className="flex flex-wrap items-center justify-between gap-4"><Link href="/projects" className="text-sm font-semibold text-slate-700 underline underline-offset-4">Back to projects</Link><div className="flex flex-wrap gap-3"><Link href={`/projects/${project.id}/milestones`} className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">Milestones</Link><Link href={`/projects/${project.id}/team`} className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">Project team</Link>{editable?<Link href={`/projects/${project.id}/edit`} className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white">Edit project</Link>:null}</div></div>
    <div className="mt-5"><ProjectOverview project={project} managerName={manager?.full_name||(project.project_manager_id===data.user.id?(profile?.full_name||data.user.email||"Project Manager"):"Project Manager")}/></div>
  </section></ApplicationShell>;
}
