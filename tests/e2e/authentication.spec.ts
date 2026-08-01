import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

import { createLocalUserClient, deleteLocalTestUsers } from "./local-supabase";

const testEmail = `helm-e2e-${randomUUID()}@example.test`;
const testPassword = `Helm-${randomUUID()}-9a!`;

async function signIn(page: Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(testEmail);
  await page.getByLabel("Password").fill(testPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/onboarding$/);
}

test.describe.serial("Supabase SSR authentication", () => {
  let testUserId: string | undefined;

  test.afterAll(async () => {
    if (testUserId) await deleteLocalTestUsers([testUserId]);
  });
  test("anonymous access to projects redirects to sign-in", async ({ page }) => {
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fprojects$/);
    await expect(page.getByRole("heading", { name: "Sign in to Helm" })).toBeVisible();
  });

  test("sign-up validation identifies required and mismatched fields", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter your email address.")).toBeVisible();

    await page.getByLabel("Full name").fill("Test User");
    await page.getByLabel("Email").fill("invalid-email");
    await page.getByLabel("Password", { exact: true }).fill("ValidPass123!");
    await page.getByLabel("Confirm password").fill("DifferentPass123!");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Passwords do not match.")).toBeVisible();
  });

  test("sign-in validation preserves a recoverable email", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill("remember@example.test");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Enter your password.")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue("remember@example.test");
  });

  test("invalid confirmation links return a recoverable state", async ({ page }) => {
    await page.goto(
      "/auth/confirm?token_hash=invalid&type=email&next=%2F%2Fattacker.example",
    );
    await expect(page).toHaveURL(/\/sign-in\?confirmation=invalid$/);
    await expect(
      page.getByText("This confirmation link is invalid or has expired."),
    ).toBeVisible();
  });

  test("authentication form remains usable at a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: "Sign in to Helm" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeInViewport();
    const bodyWidth = await page.locator("body").evaluate((body) => body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });

  test("authentication form supports keyboard completion", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").focus();
    await page.keyboard.type("keyboard@example.test");
    await page.keyboard.press("Tab");
    await page.keyboard.type("incorrect-password");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
  });

  test("creates a local account without creating a Helm workspace", async ({ page }) => {
    await page.goto("/sign-up");
    await page.getByLabel("Full name").fill("Helm E2E User");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password", { exact: true }).fill(testPassword);
    await page.getByLabel("Confirm password").fill(testPassword);
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { name: "Create your Helm workspace" })).toBeVisible();

    const supabase = createLocalUserClient();
    const { data } = await supabase.auth.signInWithPassword({ email: testEmail, password: testPassword });
    testUserId = data.user?.id;
    await supabase.auth.signOut();
  });

  test("authenticated users without a workspace are routed to onboarding", async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole("heading", { name: "Create your Helm workspace" })).toBeVisible();
  });

  test("session persists after refresh", async ({ page }) => {
    await signIn(page);
    await page.reload();
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { name: "Create your Helm workspace" })).toBeVisible();
  });

  test("sign-out clears the authenticated session", async ({ page }) => {
    await signIn(page);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/sign-in\?signedOut=true$/);
    await expect(page.getByText("You have been signed out.")).toBeVisible();
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fprojects$/);
  });

  test("invalid credentials return a generic error and preserve email", async ({ page }) => {
    await page.goto("/sign-in");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Email or password is incorrect.")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue(testEmail);
  });

  test("created account can sign in again", async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole("heading", { name: "Create your Helm workspace" })).toBeVisible();
  });
});
