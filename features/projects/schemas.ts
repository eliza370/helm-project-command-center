import { z } from "zod";
import { healthValues, lifecyclePhases, projectStatuses } from "./types";

const requiredText = (label: string, max: number) => z.string().trim().min(1, `Enter ${label.toLowerCase()}.`).max(max, `${label} must be ${max} characters or fewer.`);
const optionalText = (max: number) => z.string().trim().max(max, `Must be ${max} characters or fewer.`).transform((v) => v || undefined);
const date = (label: string) => z.string().min(1, `Enter ${label.toLowerCase()}.`).regex(/^\d{4}-\d{2}-\d{2}$/, `Enter a valid ${label.toLowerCase()}.`);

const projectShape = {
  name: requiredText("Project name", 200),
  description: optionalText(4000),
  businessObjective: requiredText("Business objective", 4000),
  sponsorName: requiredText("Sponsor name", 200),
  sponsorEmail: z.string().trim().max(320, "Sponsor email must be 320 characters or fewer.").refine((v) => !v || z.email().safeParse(v).success, "Enter a valid sponsor email.").transform((v) => v || undefined),
  lifecyclePhase: z.enum(lifecyclePhases, "Select a valid lifecycle phase."),
  status: z.enum(projectStatuses, "Select a valid project status."),
  startDate: date("Start date"),
  targetCompletionDate: date("Target completion date"),
  overallHealth: z.enum(healthValues), scopeHealth: z.enum(healthValues), scheduleHealth: z.enum(healthValues),
  budgetHealth: z.enum(healthValues), resourceHealth: z.enum(healthValues), riskHealth: z.enum(healthValues),
};

function validateProjectRules(value: z.infer<z.ZodObject<typeof projectShape>>, context: z.RefinementCtx) {
  if (value.targetCompletionDate && value.startDate && value.targetCompletionDate < value.startDate) context.addIssue({ code: "custom", path: ["targetCompletionDate"], message: "Target completion date cannot be before the start date." });
  if (value.status === "Draft" && value.lifecyclePhase !== "Initiation") context.addIssue({ code: "custom", path: ["status"], message: "Draft projects must be in Initiation." });
  if (value.lifecyclePhase === "Closed" && !["Completed", "Cancelled"].includes(value.status)) context.addIssue({ code: "custom", path: ["status"], message: "Closed projects must be Completed or Cancelled." });
  if (["Completed", "Cancelled"].includes(value.status) && value.lifecyclePhase !== "Closed") context.addIssue({ code: "custom", path: ["lifecyclePhase"], message: `${value.status} projects must use the Closed lifecycle phase.` });
}

export const createProjectSchema = z.object(projectShape).strict().superRefine(validateProjectRules);
export const updateProjectSchema = z.object({
  ...projectShape,
  confirmTerminal: z.string().optional(),
}).strict().superRefine((value, context) => {
  validateProjectRules(value, context);
  if (["Completed", "Cancelled"].includes(value.status) && value.confirmTerminal !== "confirmed") {
    context.addIssue({ code: "custom", path: ["confirmTerminal"], message: `Confirm that you intend to mark this project ${value.status}.` });
  }
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
