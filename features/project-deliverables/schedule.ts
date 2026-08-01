import { getDateScheduleLabel } from "../project-milestones/schedule";
export type DeliverableStatus="Planned"|"In Progress"|"Ready for Acceptance"|"Accepted"|"Cancelled";
export function getDeliverableScheduleLabel(dueDate:string,status:DeliverableStatus,today:string){return status==="Accepted"||status==="Cancelled"?status:getDateScheduleLabel(dueDate,today)}
