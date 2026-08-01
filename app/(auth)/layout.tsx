import Link from "next/link";

export default function AuthenticationLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[minmax(320px,0.9fr)_minmax(480px,1.1fr)]">
      <section className="flex flex-col justify-between bg-slate-900 px-6 py-10 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-14">
        <Link href="/" className="w-fit rounded-sm text-2xl font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Helm</Link>
        <div className="max-w-lg py-12 lg:py-0">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">Project command center</p>
          <p className="text-4xl font-semibold tracking-tight sm:text-5xl">Plan. Navigate. Deliver.</p>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">A calm, connected workspace for guiding projects from initiation through closure.</p>
        </div>
        <p className="text-sm text-slate-400">Secure local authentication</p>
      </section>
      <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
