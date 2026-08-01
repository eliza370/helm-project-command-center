import Link from "next/link";

export function ApplicationShell({
  children,
  organizationName,
  userLabel,
}: Readonly<{
  children: React.ReactNode;
  organizationName: string;
  userLabel: string;
}>) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-5">
            <Link href="/projects" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">
              <span className="block text-xl font-semibold tracking-tight text-slate-950">Helm</span>
              <span className="block text-xs font-medium text-slate-500">Plan. Navigate. Deliver.</span>
            </Link>
            <span className="hidden h-9 w-px bg-slate-200 sm:block" aria-hidden="true" />
            <p className="min-w-0 truncate text-sm font-semibold text-slate-700">{organizationName}</p>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <p className="hidden max-w-56 truncate text-sm text-slate-600 sm:block">{userLabel}</p>
            <form action="/auth/sign-out" method="post">
              <button type="submit" className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
