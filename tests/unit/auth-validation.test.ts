import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "../../features/auth/redirects";
import { signInSchema, signUpSchema } from "../../features/auth/schemas";

describe("authentication validation", () => {
  it("accepts a valid sign-up submission", () => {
    const result = signUpSchema.safeParse({
      fullName: "Avery Morgan",
      email: "avery@example.com",
      password: "SecurePass123!",
      confirmPassword: "SecurePass123!",
    });

    expect(result.success).toBe(true);
  });

  it("requires the sign-up fields", () => {
    const result = signUpSchema.safeParse({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        fullName: expect.any(Array),
        email: expect.any(Array),
        password: expect.any(Array),
        confirmPassword: expect.any(Array),
      });
    }
  });

  it("rejects mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      fullName: "Avery Morgan",
      email: "avery@example.com",
      password: "SecurePass123!",
      confirmPassword: "DifferentPass123!",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "Passwords do not match.",
      );
    }
  });

  it("rejects invalid email addresses for sign-up and sign-in", () => {
    expect(
      signUpSchema.safeParse({
        fullName: "Avery Morgan",
        email: "not-an-email",
        password: "SecurePass123!",
        confirmPassword: "SecurePass123!",
      }).success,
    ).toBe(false);

    expect(
      signInSchema.safeParse({ email: "not-an-email", password: "password" })
        .success,
    ).toBe(false);
  });

  it("requires sign-in email and password", () => {
    const result = signInSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("safe authentication redirects", () => {
  it.each([
    ["/projects", "/projects"],
    ["/projects?view=active", "/projects?view=active"],
    ["https://attacker.example", "/projects"],
    ["//attacker.example", "/projects"],
    ["/\\attacker.example", "/projects"],
    [null, "/projects"],
  ])("maps %s to %s", (candidate, expected) => {
    expect(getSafeRedirectPath(candidate)).toBe(expected);
  });
});
