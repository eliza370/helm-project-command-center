import { z } from "zod";

const requiredText = (label: string, max = 4000) =>
  z.string().trim().min(1, `${label} is required.`).max(max, `${label} must be ${max} characters or fewer.`);
const optionalText = z.string().trim().max(4000, "Follow-up notes must be 4000 characters or fewer.").transform((value) => value || null);
const dateOnly = z.iso.date();

const fields = {
  projectId: z.uuid(),
  title: requiredText("Title", 200),
  context: requiredText("Context"),
  decision: requiredText("Decision"),
  rationale: requiredText("Rationale"),
  alternativesConsidered: requiredText("Alternatives considered"),
  consequences: requiredText("Consequences"),
  decisionMakerName: requiredText("Decision-maker", 200),
  decisionDate: dateOnly,
  effectiveDate: z.union([dateOnly, z.literal("")]).transform((value) => value || null),
  followUpNotes: optionalText,
};

function validateDates(value: { decisionDate: string; effectiveDate: string | null }, context: z.RefinementCtx) {
  const today = new Date().toISOString().slice(0, 10);
  if (value.decisionDate > today) context.addIssue({ code: "custom", path: ["decisionDate"], message: "Decision date cannot be in the future." });
  if (value.effectiveDate && value.effectiveDate < value.decisionDate) context.addIssue({ code: "custom", path: ["effectiveDate"], message: "Effective date cannot precede decision date." });
}

export const createDecisionSchema = z.object(fields).strict().superRefine(validateDates);
export const correctDecisionSchema = z.object({
  ...fields,
  decisionId: z.uuid(),
  correctionReason: requiredText("Correction reason"),
  confirmCorrection: z.literal("confirmed", { error: "Confirm that this is a correction to an inaccurate record." }),
}).strict().superRefine(validateDates);

export type DecisionInput = z.input<typeof createDecisionSchema>;
