"use client";

import { useActionState } from "react";
import { FieldError } from "@/features/auth/components/field-error";
import { SubmitButton } from "@/features/auth/components/submit-button";
import { saveProjectDecision, type DecisionState } from "../actions";

export type DecisionValues = {
  title?: string; context?: string; decision?: string; rationale?: string; alternativesConsidered?: string;
  consequences?: string; decisionMakerName?: string; decisionDate?: string; effectiveDate?: string; followUpNotes?: string;
};
const field = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-300";

export function DecisionForm({ projectId, decisionId, initialValues }: { projectId: string; decisionId?: string; initialValues?: DecisionValues }) {
  const [state, action] = useActionState(saveProjectDecision, { status: "idle", values: initialValues } as DecisionState);
  const values = state.values ?? initialValues;
  const prefix = decisionId ? `correction-${decisionId}` : "new-decision";
  const input = (name: keyof DecisionValues, label: string, maxLength: number, rows = 3) => (
    <div className="min-w-0">
      <label htmlFor={`${prefix}-${name}`} className="mb-2 block text-sm font-medium">{label} <span className="text-rose-700">*</span></label>
      <textarea id={`${prefix}-${name}`} name={name} required maxLength={maxLength} rows={rows} defaultValue={values?.[name]} aria-describedby={`${prefix}-${name}-error`} className={field} />
      <FieldError id={`${prefix}-${name}-error`} errors={state.fieldErrors?.[name]} />
    </div>
  );
  return <form action={action} noValidate className="min-w-0 space-y-5">
    <input type="hidden" name="projectId" value={projectId} /><input type="hidden" name="operation" value={decisionId ? "correct" : "create"} />
    {decisionId ? <input type="hidden" name="decisionId" value={decisionId} /> : null}
    {state.message ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{state.message}</p> : null}
    <div><label htmlFor={`${prefix}-title`} className="mb-2 block text-sm font-medium">Title <span className="text-rose-700">*</span></label><input id={`${prefix}-title`} name="title" required maxLength={200} defaultValue={values?.title} aria-describedby={`${prefix}-title-error`} className={field} /><FieldError id={`${prefix}-title-error`} errors={state.fieldErrors?.title} /></div>
    {input("context", "Context", 4000)}
    {input("decision", "Decision", 4000)}
    {input("rationale", "Rationale", 4000)}
    {input("alternativesConsidered", "Alternatives considered", 4000)}
    {input("consequences", "Consequences", 4000)}
    <div className="grid min-w-0 gap-5 sm:grid-cols-3">
      <div><label htmlFor={`${prefix}-decisionMakerName`} className="mb-2 block text-sm font-medium">Decision-maker <span className="text-rose-700">*</span></label><input id={`${prefix}-decisionMakerName`} name="decisionMakerName" required maxLength={200} defaultValue={values?.decisionMakerName} aria-describedby={`${prefix}-decisionMakerName-error`} className={field} /><FieldError id={`${prefix}-decisionMakerName-error`} errors={state.fieldErrors?.decisionMakerName} /></div>
      <div><label htmlFor={`${prefix}-decisionDate`} className="mb-2 block text-sm font-medium">Decision date <span className="text-rose-700">*</span></label><input id={`${prefix}-decisionDate`} name="decisionDate" type="date" required defaultValue={values?.decisionDate} aria-describedby={`${prefix}-decisionDate-error`} className={field} /><FieldError id={`${prefix}-decisionDate-error`} errors={state.fieldErrors?.decisionDate} /></div>
      <div><label htmlFor={`${prefix}-effectiveDate`} className="mb-2 block text-sm font-medium">Effective date (optional)</label><input id={`${prefix}-effectiveDate`} name="effectiveDate" type="date" defaultValue={values?.effectiveDate} aria-describedby={`${prefix}-effectiveDate-error`} className={field} /><FieldError id={`${prefix}-effectiveDate-error`} errors={state.fieldErrors?.effectiveDate} /></div>
    </div>
    <div><label htmlFor={`${prefix}-followUpNotes`} className="mb-2 block text-sm font-medium">Follow-up notes (optional)</label><textarea id={`${prefix}-followUpNotes`} name="followUpNotes" maxLength={4000} rows={3} defaultValue={values?.followUpNotes} aria-describedby={`${prefix}-followUpNotes-error`} className={field} /><FieldError id={`${prefix}-followUpNotes-error`} errors={state.fieldErrors?.followUpNotes} /><p className="mt-1 text-xs text-slate-600">Create accountable follow-up work manually in Actions; Helm does not create an Action automatically.</p></div>
    {decisionId ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm text-amber-950">Use a correction only to fix an inaccurate record. If the project made a different decision, record a new Decision instead.</p><label htmlFor={`${prefix}-correctionReason`} className="mb-2 mt-4 block text-sm font-medium">Correction reason <span className="text-rose-700">*</span></label><textarea id={`${prefix}-correctionReason`} name="correctionReason" required maxLength={4000} rows={3} defaultValue={state.values?.correctionReason} aria-describedby={`${prefix}-correctionReason-error`} className={field} /><FieldError id={`${prefix}-correctionReason-error`} errors={state.fieldErrors?.correctionReason} /><label className="mt-4 flex items-start gap-2 text-sm"><input type="checkbox" name="confirmCorrection" value="confirmed" required className="mt-1" />I confirm this corrects an inaccurate record and does not replace a later project decision.</label><FieldError id={`${prefix}-confirm-error`} errors={state.fieldErrors?.confirmCorrection} /></div> : null}
    <SubmitButton idleLabel={decisionId ? "Submit correction" : "Record decision"} pendingLabel={decisionId ? "Correcting…" : "Recording…"} />
  </form>;
}
