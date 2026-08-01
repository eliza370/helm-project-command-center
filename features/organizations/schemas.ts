import { z } from "zod";

export const FULL_NAME_MAX_LENGTH = 200;
export const ORGANIZATION_NAME_MAX_LENGTH = 200;
export const ORGANIZATION_DESCRIPTION_MAX_LENGTH = 4000;

export const organizationOnboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(
      FULL_NAME_MAX_LENGTH,
      `Full name must be ${FULL_NAME_MAX_LENGTH} characters or fewer.`,
    ),
  organizationName: z
    .string()
    .trim()
    .min(2, "Enter your organization name.")
    .max(
      ORGANIZATION_NAME_MAX_LENGTH,
      `Organization name must be ${ORGANIZATION_NAME_MAX_LENGTH} characters or fewer.`,
    ),
  description: z
    .string()
    .trim()
    .max(
      ORGANIZATION_DESCRIPTION_MAX_LENGTH,
      `Description must be ${ORGANIZATION_DESCRIPTION_MAX_LENGTH} characters or fewer.`,
    )
    .optional()
    .transform((value) => value || undefined),
});

export type OrganizationOnboardingInput = z.infer<
  typeof organizationOnboardingSchema
>;
