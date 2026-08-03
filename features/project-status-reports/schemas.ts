import { z } from "zod";
import { healthValues } from "../projects/types";

const required = (label:string) => z.string().trim().min(1,`${label} is required.`).max(4000,`${label} must be 4000 characters or fewer.`);
const optional = (label:string) => z.string().trim().max(4000,`${label} must be 4000 characters or fewer.`).transform(v=>v||null);
const health=z.enum(healthValues);
const fields={
 projectId:z.uuid(), reportingPeriodStart:z.iso.date(), reportingPeriodEnd:z.iso.date(),
 overallHealth:health,scopeHealth:health,scheduleHealth:health,budgetHealth:health,resourceHealth:health,riskHealth:health,
 executiveSummary:required("Executive summary"),accomplishments:required("Accomplishments"),plannedWork:required("Planned work"),
 concerns:optional("Concerns"),decisionsRequired:optional("Decisions required"),supportRequired:optional("Support required"),
};
function dates(v:{reportingPeriodStart:string;reportingPeriodEnd:string},ctx:z.RefinementCtx){const today=new Date().toISOString().slice(0,10);if(v.reportingPeriodStart>v.reportingPeriodEnd)ctx.addIssue({code:"custom",path:["reportingPeriodEnd"],message:"Reporting period end cannot precede its start."});if(v.reportingPeriodEnd>today)ctx.addIssue({code:"custom",path:["reportingPeriodEnd"],message:"Reporting period end cannot be in the future."});}
export const createStatusReportSchema=z.object(fields).strict().superRefine(dates);
export const updateStatusReportSchema=z.object({...fields,reportId:z.uuid()}).strict().superRefine(dates);
export const publishStatusReportSchema=z.object({projectId:z.uuid(),reportId:z.uuid(),confirmPublication:z.literal("confirmed",{error:"Confirm publication of this historical snapshot."})}).strict();
