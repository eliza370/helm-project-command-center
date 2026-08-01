import Link from "next/link";
import { redirect } from "next/navigation";

import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { createClient } from "@/lib/supabase/server";

export default async function SignUpPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims.sub) redirect("/projects");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold text-sky-700">Get started</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Create your Helm account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Your organization workspace will be configured in the next step.</p>
      </div>
      <SignUpForm />
      <p className="mt-6 text-center text-sm text-slate-600">Already have an account?{" "}<Link href="/sign-in" className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">Sign in</Link></p>
    </div>
  );
}
