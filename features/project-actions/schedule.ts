import { getDateScheduleLabel } from "../project-milestones/schedule";
export type ActionStatus="Open"|"In Progress"|"Blocked"|"Completed"|"Cancelled";
export type ActionPriority="Low"|"Medium"|"High"|"Critical";
export function getActionScheduleLabel(dueDate:string,status:ActionStatus,today:string){return status==="Completed"||status==="Cancelled"?status:getDateScheduleLabel(dueDate,today)}
export function getActionAttentionReasons(dueDate:string,status:ActionStatus,priority:ActionPriority,today:string){if(status==="Completed"||status==="Cancelled")return[];const reasons:string[]=[];if(status==="Blocked")reasons.push("Blocked");if(dueDate<today)reasons.push("Overdue");else if(dueDate===today)reasons.push("Due today");if(priority==="Critical")reasons.push("Critical priority");return reasons}
