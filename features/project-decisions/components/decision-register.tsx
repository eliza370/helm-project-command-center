import Link from "next/link";

export type DecisionRow = {
  id: string; title: string; context: string; decision: string; rationale: string; alternatives_considered: string; consequences: string;
  decision_maker_name: string; decision_date: string; effective_date: string | null; follow_up_notes: string | null;
  correction_reason: string | null; last_corrected_at: string | null; created_at: string;
  creator: { full_name: string } | null; corrector: { full_name: string } | null;
};
const date = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
const time = (value: string) => new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function DecisionRegister({ projectId, decisions, canManage }: { projectId: string; decisions: DecisionRow[]; canManage: boolean }) {
  if (!decisions.length) return <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-semibold">No decisions recorded</p><p className="mt-1 text-sm text-slate-600">{canManage ? "Record the first important choice after it has been made." : "No important project decisions have been recorded yet."}</p></div>;
  return <div className="mt-4 grid min-w-0 gap-5">{decisions.map((item) => <article key={item.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><h3 className="break-words text-lg font-semibold">{item.title}</h3><p className="mt-1 text-sm text-slate-600">Decided {date(item.decision_date)} by {item.decision_maker_name}</p></div><span className="rounded-full border px-3 py-1 text-xs font-semibold">{item.last_corrected_at ? "Corrected" : "Recorded"}</span></div>
    <dl className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
      {[["Context",item.context],["Decision",item.decision],["Rationale",item.rationale],["Alternatives considered",item.alternatives_considered],["Consequences",item.consequences]].map(([label,value]) => <div key={label} className="min-w-0"><dt className="font-semibold">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{value}</dd></div>)}
      <div><dt className="font-semibold">Decision date</dt><dd className="mt-1 text-sm">{date(item.decision_date)}</dd></div>
      {item.effective_date ? <div><dt className="font-semibold">Effective date</dt><dd className="mt-1 text-sm">{date(item.effective_date)}</dd></div> : null}
      {item.follow_up_notes ? <div className="min-w-0"><dt className="font-semibold">Follow-up notes</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{item.follow_up_notes}</dd></div> : null}
      <div><dt className="font-semibold">Recorded</dt><dd className="mt-1 text-sm">{time(item.created_at)} by {item.creator?.full_name ?? "Helm user"}</dd></div>
      {item.last_corrected_at ? <><div><dt className="font-semibold">Latest correction</dt><dd className="mt-1 text-sm">{time(item.last_corrected_at)} by {item.corrector?.full_name ?? "Helm user"}</dd></div><div className="min-w-0"><dt className="font-semibold">Correction reason</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{item.correction_reason}</dd></div></> : null}
    </dl>
    {canManage ? <Link href={`/projects/${projectId}/decisions?correct=${item.id}`} aria-label={`Correct decision record ${item.title}`} className="mt-5 inline-block rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-400">Correct decision record</Link> : null}
  </article>)}</div>;
}
