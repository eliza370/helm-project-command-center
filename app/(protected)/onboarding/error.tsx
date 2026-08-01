"use client";

export default function OnboardingError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-7 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">We could not prepare onboarding</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">We could not verify your workspace access. Try loading onboarding again.</p>
        <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
          Try again
        </button>
      </div>
    </main>
  );
}
