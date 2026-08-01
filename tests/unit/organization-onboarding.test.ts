import { describe, expect, it } from "vitest";

import { getSafeOnboardingError } from "../../features/organizations/errors";
import {
  FULL_NAME_MAX_LENGTH,
  ORGANIZATION_DESCRIPTION_MAX_LENGTH,
  ORGANIZATION_NAME_MAX_LENGTH,
  organizationOnboardingSchema,
} from "../../features/organizations/schemas";

describe("organization onboarding validation", () => {
  it("trims and accepts valid onboarding details", () => {
    const result = organizationOnboardingSchema.safeParse({
      fullName: "  Avery Morgan  ",
      organizationName: "  Northstar Delivery  ",
      description: "  A workspace for the delivery team.  ",
    });

    expect(result).toMatchObject({
      success: true,
      data: {
        fullName: "Avery Morgan",
        organizationName: "Northstar Delivery",
        description: "A workspace for the delivery team.",
      },
    });
  });

  it.each([
    ["fullName", ""],
    ["fullName", "   "],
    ["fullName", "A"],
    ["organizationName", ""],
    ["organizationName", "   "],
    ["organizationName", "A"],
  ])("rejects invalid %s values", (field, value) => {
    const input = {
      fullName: "Avery Morgan",
      organizationName: "Northstar Delivery",
      description: "",
      [field]: value,
    };
    expect(organizationOnboardingSchema.safeParse(input).success).toBe(false);
  });

  it("accepts an omitted or blank optional description", () => {
    const omitted = organizationOnboardingSchema.safeParse({
      fullName: "Avery Morgan",
      organizationName: "Northstar Delivery",
    });
    const blank = organizationOnboardingSchema.safeParse({
      fullName: "Avery Morgan",
      organizationName: "Northstar Delivery",
      description: "   ",
    });

    expect(omitted.success).toBe(true);
    expect(blank).toMatchObject({ success: true, data: { description: undefined } });
  });

  it.each([
    ["fullName", "x".repeat(FULL_NAME_MAX_LENGTH + 1)],
    ["organizationName", "x".repeat(ORGANIZATION_NAME_MAX_LENGTH + 1)],
    ["description", "x".repeat(ORGANIZATION_DESCRIPTION_MAX_LENGTH + 1)],
  ])("rejects %s beyond its maximum length", (field, value) => {
    const input = {
      fullName: "Avery Morgan",
      organizationName: "Northstar Delivery",
      description: "",
      [field]: value,
    };
    expect(organizationOnboardingSchema.safeParse(input).success).toBe(false);
  });
});

describe("safe onboarding errors", () => {
  it("maps duplicate and authorization failures without database details", () => {
    expect(getSafeOnboardingError({ code: "23505" })).toContain("already been created");
    expect(getSafeOnboardingError({ code: "42501" })).toContain("session");
    expect(getSafeOnboardingError({ code: "XX000" })).toBe(
      "We could not create your workspace. Your details are safe; try again.",
    );
  });
});
