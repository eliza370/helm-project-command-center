import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div><p className="text-xl font-semibold tracking-tight text-slate-950">Helm</p><p className="text-xs font-medium text-slate-500">Plan. Navigate. Deliver.</p></div>
          <form action="/auth/sign-out" method="post"><button type="submit" className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Sign out</button></form>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <p className="text-sm font-semibold text-sky-700">Authenticated workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Your project workspace is ready for onboarding</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">You are securely signed in. Organization onboarding is the next checkpoint; no projects or project data are available yet.</p>
          <p className="mt-6 text-sm text-slate-500">Signed in as <span className="font-medium text-slate-700">{data.user?.email}</span></p>
        </div>
      </section>
    </main>
  );
}
