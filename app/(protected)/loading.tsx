export default function ProtectedLoading() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5" aria-busy="true" aria-live="polite"><div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm font-medium text-slate-700 shadow-sm">Loading your secure workspace…</div></main>;
}
