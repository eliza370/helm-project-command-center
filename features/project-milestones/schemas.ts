import { z } from "zod";

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid target date.").refine((value) => {
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}, "Enter a valid target date.");

export const milestoneInputSchema = z.object({
  operation: z.enum(["create", "update"]),
  projectId: z.uuid(),
  milestoneId: z.uuid().optional(),
  title: z.string().trim().min(1, "Enter a milestone title.").max(200, "Use 200 characters or fewer."),
  description: z.string().trim().max(4000, "Use 4,000 characters or fewer.").transform((value) => value || undefined),
  targetDate: dateOnly,
}).strict().superRefine((value, context) => {
  if (value.operation === "update" && !value.milestoneId) context.addIssue({ code: "custom", path: ["milestoneId"], message: "Select a milestone to edit." });
});

export const milestoneTransitionSchema = z.object({
  projectId: z.uuid(), milestoneId: z.uuid(), status: z.enum(["Completed", "Cancelled"]), confirm: z.literal("confirmed"),
}).strict();
