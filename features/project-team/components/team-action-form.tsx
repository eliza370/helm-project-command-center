"use client";
import { useActionState } from "react";
import { manageProjectMembershipAction,type TeamActionState } from "../actions";
import { managedAccessLevels } from "../schemas";
import { SubmitButton } from "@/features/auth/components/submit-button";
import { FieldError } from "@/features/auth/components/field-error";
const input="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base focus:ring-2 focus:ring-slate-300";

export function AddTeamMemberForm({projectId,eligible}:{projectId:string;eligible:{user_id:string;full_name:string;email:string;existing_access_level:string|null}[]}){
 const[state,action]=useActionState(manageProjectMembershipAction,{status:"idle"}as TeamActionState);
 if(!eligible.length)return <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-600"><h2 className="font-semibold text-slate-900">No eligible organization members</h2><p className="mt-1">All active organization members already have active project access. Invitations are not available here.</p></div>;
 return <form action={action} className="space-y-4" noValidate><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="operation" value="add"/>{state.message?<p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-900">{state.message}</p>:null}<div><label htmlFor="eligible-user" className="text-sm font-medium">Organization member</label><select id="eligible-user" name="userId" defaultValue={state.values?.userId??""} className={input}><option value="">Select a member</option>{eligible.map(member=><option key={member.user_id} value={member.user_id}>{member.full_name} — {member.email}{member.existing_access_level?" (reactivate)":""}</option>)}</select><FieldError id="user-error" errors={state.fieldErrors?.userId}/></div><AccessSelect id="new-access" value={state.values?.accessLevel}/><SubmitButton idleLabel="Add team member" pendingLabel="Adding member…"/></form>;
}

export function MembershipActionForm({projectId,userId,accessLevel,active}:{projectId:string;userId:string;accessLevel:string;active:boolean}){
 const[state,action]=useActionState(manageProjectMembershipAction,{status:"idle"}as TeamActionState);const id=`access-${userId}`;
 return <div className="mt-4 space-y-3">{state.message?<p role="alert" className="text-sm text-rose-800">{state.message}</p>:null}<form action={action} className="space-y-3"><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="userId" value={userId}/><input type="hidden" name="operation" value={active?"update":"reactivate"}/><AccessSelect id={id} value={state.values?.accessLevel??accessLevel}/><SubmitButton idleLabel={active?"Update access":"Reactivate membership"} pendingLabel="Saving…"/></form>{active?<form action={action} className="space-y-2 border-t border-slate-200 pt-3"><input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="userId" value={userId}/><input type="hidden" name="accessLevel" value={accessLevel}/><input type="hidden" name="operation" value="deactivate"/><label className="flex gap-2 text-sm text-slate-700"><input type="checkbox" name="confirmDeactivate" value="confirmed"/>Confirm deactivation</label><button className="min-h-10 rounded-lg border border-rose-300 px-4 text-sm font-semibold text-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2">Deactivate access</button></form>:null}</div>;
}
function AccessSelect({id,value="Project Member"}:{id:string;value?:string}){return <div><label className="text-sm font-medium" htmlFor={id}>Access level</label><select id={id} name="accessLevel" defaultValue={value} className={input}>{managedAccessLevels.map(level=><option key={level}>{level}</option>)}</select></div>}
