export type MilestoneStatus = "Planned" | "Completed" | "Cancelled";
export type ScheduleLabel = MilestoneStatus | "Overdue" | "Due today" | "Upcoming" | "Scheduled";

export function getMilestoneScheduleLabel(targetDate: string, status: MilestoneStatus, today: string): ScheduleLabel {
  if (status !== "Planned") return status;
  if (targetDate < today) return "Overdue";
  if (targetDate === today) return "Due today";
  const days = (Date.parse(`${targetDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000;
  return days <= 14 ? "Upcoming" : "Scheduled";
}

export function todayDateOnly(now = new Date()) { return now.toISOString().slice(0, 10); }
