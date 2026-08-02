"use client";

import { useActionState } from "react";
import { FieldError } from "@/features/auth/components/field-error";
import { SubmitButton } from "@/features/auth/components/submit-button";
import { saveProjectAssumption, type AssumptionState } from "../actions";
import { assumptionCategories, confidenceValues } from "../schemas";

const fieldClass = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base outline-none focus:ring-2 focus:ring-slate-300";

type Props = {
  projectId: string;
  assumptionId?: string;
  initialValues?: Record<string, string>;
  owners: { membership_id: string; full_name: string; access_level: string }[];
};

export function AssumptionForm({ projectId, assumptionId, initialValues, owners }: Props) {
  const [state, action] = useActionState(saveProjectAssumption, {
    status: "idle",
    values: initialValues,
  } as AssumptionState);
  const values = state.values ?? initialValues;
  return (
    <form key={assumptionId ?? "create"} action={action} noValidate className="space-y-5">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="operation" value={assumptionId ? "update" : "create"} />
      {assumptionId ? <input type="hidden" name="assumptionId" value={assumptionId} /> : null}
      {state.message ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm">{state.message}</p> : null}
      <Text name="assumptionTitle" label="Assumption title" value={values?.title} errors={state.fieldErrors?.title} />
      <Area name="assumptionDescription" label="Assumption description" value={values?.description} errors={state.fieldErrors?.description} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select name="assumptionCategory" label="Affected project dimension" value={values?.category ?? "Operational"} options={assumptionCategories} errors={state.fieldErrors?.category} />
        <Select name="assumptionConfidence" label="Assumption confidence" value={values?.confidence ?? "Medium"} options={confidenceValues} errors={state.fieldErrors?.confidence} />
      </div>
      <Area name="planningRationale" label="Planning rationale" value={values?.planningRationale} errors={state.fieldErrors?.planningRationale} />
      <Area name="validationMethod" label="Validation method" value={values?.validationMethod} errors={state.fieldErrors?.validationMethod} />
      <Area name="impactIfFalse" label="Impact if false" value={values?.impactIfFalse} errors={state.fieldErrors?.impactIfFalse} />
      <Area name="assumptionEvidence" label="Current validation evidence (optional)" value={values?.validationEvidence} errors={state.fieldErrors?.validationEvidence} optional />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="assumptionOwner" className="mb-2 block text-sm font-medium">Validation owner *</label>
          <select id="assumptionOwner" name="assumptionOwner" required defaultValue={values?.ownerMembershipId ?? ""} className={fieldClass}>
            <option value="">Select an eligible owner</option>
            {owners.map((owner) => <option key={owner.membership_id} value={owner.membership_id}>{owner.full_name} - {owner.access_level}</option>)}
          </select>
          <FieldError id="assumption-owner-error" errors={state.fieldErrors?.ownerMembershipId} />
        </div>
        {!assumptionId ? <DateField name="assumptionRecordedDate" label="Assumption recorded date" value={values?.recordedDate ?? new Date().toISOString().slice(0, 10)} errors={state.fieldErrors?.recordedDate} /> : null}
        <DateField name="assumptionDueDate" label="Validation due date" value={values?.validationDueDate} errors={state.fieldErrors?.validationDueDate} />
      </div>
      <SubmitButton idleLabel={assumptionId ? "Save assumption" : "Add assumption"} pendingLabel="Saving..." />
    </form>
  );
}

function Text({ name, label, value, errors }: { name: string; label: string; value?: string; errors?: string[] }) {
  return <div><label htmlFor={name} className="mb-2 block text-sm font-medium">{label} *</label><input id={name} name={name} required maxLength={200} defaultValue={value} className={fieldClass} /><FieldError id={`${name}-error`} errors={errors} /></div>;
}

function Area({ name, label, value, errors, optional = false }: { name: string; label: string; value?: string; errors?: string[]; optional?: boolean }) {
  return <div><label htmlFor={name} className="mb-2 block text-sm font-medium">{label}{optional ? null : " *"}</label><textarea id={name} name={name} required={!optional} maxLength={4000} rows={3} defaultValue={value} className={fieldClass} /><FieldError id={`${name}-error`} errors={errors} /></div>;
}

function Select({ name, label, value, options, errors }: { name: string; label: string; value: string; options: readonly string[]; errors?: string[] }) {
  return <div><label htmlFor={name} className="mb-2 block text-sm font-medium">{label} *</label><select id={name} name={name} required defaultValue={value} className={fieldClass}>{options.map((option) => <option key={option}>{option}</option>)}</select><FieldError id={`${name}-error`} errors={errors} /></div>;
}

function DateField({ name, label, value, errors }: { name: string; label: string; value?: string; errors?: string[] }) {
  return <div><label htmlFor={name} className="mb-2 block text-sm font-medium">{label} *</label><input id={name} name={name} type="date" required defaultValue={value} className={fieldClass} /><FieldError id={`${name}-error`} errors={errors} /></div>;
}
