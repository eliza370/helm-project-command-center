"use client";
import { useActionState } from "react";
import { FieldError } from "@/features/auth/components/field-error";
import { SubmitButton } from "@/features/auth/components/submit-button";
import { saveMilestoneAction, type MilestoneActionState, type MilestoneValues } from "../actions";

const field = "min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-300";
export function MilestoneForm({projectId,milestoneId,initialValues}:{projectId:string;milestoneId?:string;initialValues?:MilestoneValues}) {
  const [state, action] = useActionState(saveMilestoneAction, {status:"idle",values:initialValues} as MilestoneActionState);
  const values = state.values ?? initialValues;
  return <form action={action} noValidate className="space-y-5">
    <input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="operation" value={milestoneId?"update":"create"}/>{milestoneId?<input type="hidden" name="milestoneId" value={milestoneId}/>:null}
    {state.message?<p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{state.message}</p>:null}
    <div><label htmlFor={`title-${milestoneId??"new"}`} className="mb-2 block text-sm font-medium">Title <span aria-hidden="true" className="text-rose-700">*</span></label><input id={`title-${milestoneId??"new"}`} name="title" required maxLength={200} defaultValue={values?.title} className={field} aria-invalid={!!state.fieldErrors?.title}/><FieldError id="title-error" errors={state.fieldErrors?.title}/></div>
    <div><label htmlFor={`description-${milestoneId??"new"}`} className="mb-2 block text-sm font-medium">Description <span className="text-slate-500">(optional)</span></label><textarea id={`description-${milestoneId??"new"}`} name="description" rows={3} maxLength={4000} defaultValue={values?.description} className={field}/><FieldError id="description-error" errors={state.fieldErrors?.description}/></div>
    <div><label htmlFor={`target-${milestoneId??"new"}`} className="mb-2 block text-sm font-medium">Target date <span aria-hidden="true" className="text-rose-700">*</span></label><input id={`target-${milestoneId??"new"}`} name="targetDate" type="date" required defaultValue={values?.targetDate} className={field} aria-invalid={!!state.fieldErrors?.targetDate}/><FieldError id="target-error" errors={state.fieldErrors?.targetDate}/></div>
    <SubmitButton idleLabel={milestoneId?"Save milestone":"Add milestone"} pendingLabel={milestoneId?"Saving…":"Adding…"}/>
  </form>;
}
