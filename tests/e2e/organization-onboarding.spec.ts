import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";

import { createLocalUserClient, deleteLocalTestUsers } from "./local-supabase";

const suffix = randomUUID();
const password = `Helm-${randomUUID()}-9a!`;
const primary = { email: `helm-onboarding-${suffix}@example.test`, name: "Avery Morgan" };
const outsider = { email: `helm-outsider-${suffix}@example.test`, name: "Jordan Lee" };
const keyboardUser = { email: `helm-keyboard-${suffix}@example.test`, name: "Casey Rowan" };
const organizationName = `Northstar Delivery ${suffix.slice(0, 8)}`;
const keyboardOrganizationName = `Keyboard Workspace ${suffix.slice(0, 8)}`;
const userIds: string[] = [];

async function createUser(email: string, fullName: string) {
  const supabase = createLocalUserClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error || !data.user) throw error ?? new Error("Test user was not created.");
  userIds.push(data.user.id);
}

async function signIn(page: Page, email: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe.serial("first-user organization onboarding", () => {
  test.beforeAll(async () => {
    await createUser(primary.email, primary.name);
    await createUser(outsider.email, outsider.name);
    await createUser(keyboardUser.email, keyboardUser.name);
  });

  test.afterAll(async () => {
    await deleteLocalTestUsers(userIds);
  });

  test("anonymous onboarding access redirects to sign-in", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fonboarding$/);
  });

  test("an authenticated user without membership is redirected from projects", async ({ page }) => {
    await signIn(page, primary.email);
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByRole("heading", { name: "Create your Helm workspace" })).toBeVisible();
  });

  test("required-field validation preserves safe values", async ({ page }) => {
    await signIn(page, primary.email);
    await page.getByLabel("Full name").fill("  ");
    await page.getByLabel("Organization name").fill("  ");
    await page.getByLabel("Organization description").fill("Keep this description");
    await page.getByRole("button", { name: "Create workspace" }).click();
    await expect(page.getByText("Enter your full name.")).toBeVisible();
    await expect(page.getByText("Enter your organization name.")).toBeVisible();
    await expect(page.getByLabel("Organization description")).toHaveValue("Keep this description");
  });

  test("onboarding form remains usable at a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signIn(page, primary.email);
    await expect(page.getByRole("heading", { name: "Create your Helm workspace" })).toBeVisible();
    const bodyWidth = await page.locator("body").evaluate((body) => body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });

  test("successful onboarding creates membership and redirects to projects", async ({ page }) => {
    await signIn(page, primary.email);
    await page.getByLabel("Full name").fill(primary.name);
    await page.getByLabel("Organization name").fill(organizationName);
    await page.getByLabel("Organization description").fill("A first Helm delivery workspace.");
    await page.getByRole("button", { name: "Create workspace" }).click();

    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { name: "Your organization workspace is ready" })).toBeVisible();
    await expect(page.getByText(organizationName, { exact: true }).first()).toBeVisible();

    const supabase = createLocalUserClient();
    const { data: session } = await supabase.auth.signInWithPassword({ email: primary.email, password });
    const { data: membership } = await supabase
      .from("organization_members")
      .select("role, status")
      .eq("user_id", session.user!.id)
      .single();
    expect(membership).toEqual({ role: "Administrator", status: "Active" });
    await supabase.auth.signOut();
  });

  test("the onboarded user refreshes on projects and is redirected away from onboarding", async ({ page }) => {
    await signIn(page, primary.email);
    await expect(page).toHaveURL(/\/projects$/);
    await page.reload();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByText(organizationName, { exact: true }).first()).toBeVisible();
    await page.goto("/onboarding");
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("a duplicate onboarding operation is rejected", async () => {
    const supabase = createLocalUserClient();
    await supabase.auth.signInWithPassword({ email: primary.email, password });
    const { error } = await supabase.rpc("complete_onboarding", {
      p_full_name: primary.name,
      p_organization_name: `Duplicate ${organizationName}`,
    });
    expect(error?.code).toBe("23505");
    await supabase.auth.signOut();
  });

  test("keyboard submission completes onboarding", async ({ page }) => {
    await signIn(page, keyboardUser.email);
    await page.getByLabel("Full name").focus();
    await page.getByLabel("Full name").fill(keyboardUser.name);
    await page.keyboard.press("Tab");
    await page.keyboard.type(keyboardOrganizationName);
    await page.keyboard.press("Tab");
    await page.keyboard.type("Created entirely with keyboard navigation.");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByText(keyboardOrganizationName, { exact: true }).first()).toBeVisible();
  });

  test("another user cannot see organization or membership data", async ({ page }) => {
    await signIn(page, outsider.email);
    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(page.getByText(organizationName, { exact: true })).toHaveCount(0);

    const supabase = createLocalUserClient();
    await supabase.auth.signInWithPassword({ email: outsider.email, password });
    const { data } = await supabase.from("organization_members").select("organization_id");
    expect(data).toEqual([]);
    await supabase.auth.signOut();
  });

  test("sign-out still works after onboarding", async ({ page }) => {
    await signIn(page, primary.email);
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/sign-in\?signedOut=true$/);
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/sign-in\?next=%2Fprojects$/);
  });
});
