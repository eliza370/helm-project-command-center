import Link from "next/link";
import { redirect } from "next/navigation";

import { SignInForm } from "@/features/auth/components/sign-in-form";
import { getSafeRedirectPath } from "@/features/auth/redirects";
import { createClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ confirmation?: string; next?: string; signedOut?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims.sub) redirect("/projects");

  const params = await searchParams;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold text-sky-700">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in to Helm</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Continue to your protected project workspace.</p>
      </div>
      {params.signedOut === "true" ? <p role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-900">You have been signed out.</p> : null}
      {params.confirmation === "invalid" ? <p role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm leading-6 text-rose-900">This confirmation link is invalid or has expired. Return to sign up to create an account again.</p> : null}
      <SignInForm next={getSafeRedirectPath(params.next)} />
      <p className="mt-6 text-center text-sm text-slate-600">New to Helm?{" "}<Link href="/sign-up" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Create an account</Link></p>
    </div>
  );
}
