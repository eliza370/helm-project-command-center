"use client";
import { useActionState } from "react";
import { createProjectAction, type ProjectActionState } from "../actions";
import { healthValues, lifecyclePhases, projectStatuses } from "../types";
import { FieldError } from "@/features/auth/components/field-error";
import { SubmitButton } from "@/features/auth/components/submit-button";

const input = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-300";
const fields = [
  ["name", "Project name", 200], ["businessObjective", "Business objective", 4000], ["sponsorName", "Sponsor name", 200],
] as const;
const healthFields = [["overallHealth","Overall"],["scopeHealth","Scope"],["scheduleHealth","Schedule"],["budgetHealth","Budget"],["resourceHealth","Resource"],["riskHealth","Risk"]] as const;

export function CreateProjectForm() {
  const [state, action] = useActionState(createProjectAction, { status: "idle" } as ProjectActionState);
  return <form action={action} noValidate className="space-y-7">
    {state.message ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{state.message}</p> : null}
    <fieldset className="space-y-5"><legend className="text-lg font-semibold text-slate-950">Project details</legend>
      {fields.map(([name,label,max]) => <div className="space-y-2" key={name}><label htmlFor={name} className="block text-sm font-medium text-slate-800">{label} <span aria-hidden="true" className="text-rose-700">*</span></label>{name === "businessObjective" ? <textarea id={name} name={name} rows={4} required maxLength={max} defaultValue={state.values?.[name]} className={input} aria-invalid={!!state.fieldErrors?.[name]} /> : <input id={name} name={name} required maxLength={max} defaultValue={state.values?.[name]} className={input} aria-invalid={!!state.fieldErrors?.[name]} />}<FieldError id={`${name}-error`} errors={state.fieldErrors?.[name]} /></div>)}
      <div className="space-y-2"><label htmlFor="description" className="block text-sm font-medium text-slate-800">Project description <span className="text-slate-500">(optional)</span></label><textarea id="description" name="description" rows={3} maxLength={4000} defaultValue={state.values?.description} className={input}/><FieldError id="description-error" errors={state.fieldErrors?.description}/></div>
      <div className="space-y-2"><label htmlFor="sponsorEmail" className="block text-sm font-medium text-slate-800">Sponsor email <span className="text-slate-500">(optional)</span></label><input id="sponsorEmail" name="sponsorEmail" type="email" defaultValue={state.values?.sponsorEmail} className={input}/><FieldError id="sponsorEmail-error" errors={state.fieldErrors?.sponsorEmail}/></div>
    </fieldset>
    <fieldset><legend className="mb-4 text-lg font-semibold text-slate-950">Schedule and status</legend><div className="grid gap-5 sm:grid-cols-2">
      <Select name="lifecyclePhase" label="Lifecycle phase" options={lifecyclePhases} value={state.values?.lifecyclePhase ?? "Initiation"} errors={state.fieldErrors?.lifecyclePhase}/>
      <Select name="status" label="Project status" options={projectStatuses} value={state.values?.status ?? "Draft"} errors={state.fieldErrors?.status}/>
      <DateField name="startDate" label="Start date" value={state.values?.startDate} errors={state.fieldErrors?.startDate}/>
      <DateField name="targetCompletionDate" label="Target completion date" value={state.values?.targetCompletionDate} errors={state.fieldErrors?.targetCompletionDate}/>
    </div></fieldset>
    <fieldset><legend className="mb-1 text-lg font-semibold text-slate-950">Health assessment</legend><p className="mb-4 text-sm text-slate-600">Select a value for every health dimension.</p><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{healthFields.map(([name,label]) => <Select key={name} name={name} label={`${label} health`} options={healthValues} value={state.values?.[name] ?? "Not Assessed"} errors={state.fieldErrors?.[name]}/>)}</div></fieldset>
    <SubmitButton idleLabel="Create project" pendingLabel="Creating project…" />
  </form>;
}

function Select({name,label,options,value,errors}:{name:string;label:string;options:readonly string[];value:string;errors?:string[]}) { return <div className="space-y-2"><label htmlFor={name} className="block text-sm font-medium text-slate-800">{label} <span aria-hidden="true" className="text-rose-700">*</span></label><select id={name} name={name} defaultValue={value} className={input} aria-invalid={!!errors}>{options.map(o=><option key={o}>{o}</option>)}</select><FieldError id={`${name}-error`} errors={errors}/></div>; }
function DateField({name,label,value,errors}:{name:string;label:string;value?:string;errors?:string[]}) { return <div className="space-y-2"><label htmlFor={name} className="block text-sm font-medium text-slate-800">{label} <span aria-hidden="true" className="text-rose-700">*</span></label><input id={name} name={name} type="date" required defaultValue={value} className={input} aria-invalid={!!errors}/><FieldError id={`${name}-error`} errors={errors}/></div>; }
