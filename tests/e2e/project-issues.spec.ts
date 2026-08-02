import { expect, test, type Page } from "@playwright/test";
import { randomUUID } from "node:crypto";
import {
  createLocalUserClient,
  deleteLocalTestUsers,
  provisionLocalProjectMember,
} from "./local-supabase";

const suffix = randomUUID();
const password = `Helm-${randomUUID()}-9a!`;
const users = {
  admin: `issue-admin-${suffix}@example.test`,
  member: `issue-member-${suffix}@example.test`,
  viewer: `issue-viewer-${suffix}@example.test`,
  outsider: `issue-out-${suffix}@example.test`,
};
const ids: string[] = [];
let organizationId = "";
let projectId = "";

async function signup(email: string, name: string) {
  const client = createLocalUserClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error || !data.user) throw error;
  ids.push(data.user.id);
  return data.user.id;
}

async function login(page: Page, email: string) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/(projects|onboarding)(?:\/|$)/);
}

async function createRiskFixture(
  ownerMembershipId: string,
  title: string,
  terminalStatus?: "Realized" | "Closed",
) {
  const client = createLocalUserClient();
  await client.auth.signInWithPassword({ email: users.admin, password });
  const created = await client.rpc("create_project_risk", {
    p_project_id: projectId,
    p_title: title,
    p_description: `${title} fixture`,
    p_risk_type: "Threat",
    p_category: "Technical",
    p_probability: 3,
    p_impact: 4,
    p_response_strategy: "Reduce",
    p_response_plan: "Control the risk deliberately.",
    p_trigger: "Fixture trigger",
    p_owner_membership_id: ownerMembershipId,
    p_review_date: "2026-08-15",
  });
  if (created.error) throw created.error;
  if (terminalStatus) {
    const transitioned = await client.rpc("transition_project_risk", {
      p_risk_id: created.data.id,
      p_target_status: terminalStatus,
      p_notes: `${terminalStatus} for Issue E2E coverage.`,
    });
    if (transitioned.error) throw transitioned.error;
  }
  await client.auth.signOut();
}

async function fillIssueForm(
  page: Page,
  input: {
    name: string;
    details: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    effect: string;
    plan: string;
    target: string;
    origin?: string;
    ownerIndex?: number;
  },
) {
  await page.getByLabel("Issue name").fill(input.name);
  await page.getByLabel("Occurred problem details").fill(input.details);
  await page.getByLabel("Problem classification").selectOption("Technical");
  await page.getByLabel("Severity").selectOption(input.severity);
  await page.getByLabel("Current business effect").fill(input.effect);
  await page.getByLabel("Resolution plan").fill(input.plan);
  await page.getByLabel("Accountable person").selectOption({ index: input.ownerIndex ?? 1 });
  await page.getByLabel("Target resolution date").fill(input.target);
  if (await page.getByLabel("Date identified").count()) {
    await page.getByLabel("Date identified").fill("2026-08-01");
  }
  if (input.origin) {
    await page.getByLabel("Originating realized risk (optional)").selectOption({ label: input.origin });
  }
}

test.describe.serial("project issue register", () => {
  test.beforeAll(async () => {
    await signup(users.admin, "Issue Admin");
    await signup(users.member, "Issue Member");
    await signup(users.viewer, "Issue Viewer");
    await signup(users.outsider, "Issue Outsider");

    const client = createLocalUserClient();
    await client.auth.signInWithPassword({ email: users.admin, password });
    const onboard = await client.rpc("complete_onboarding", {
      p_full_name: "Issue Admin",
      p_organization_name: `Issue Org ${suffix}`,
    });
    if (onboard.error) throw onboard.error;
    organizationId = onboard.data;
    const project = await client.rpc("create_project", {
      p_actual_completion_date: null as unknown as string,
      p_budget_health: "Not Assessed",
      p_business_objective: "Resolve occurred problems.",
      p_description: "Issue fixture",
      p_lifecycle_phase: "Initiation",
      p_name: `Issue Project ${suffix.slice(0, 8)}`,
      p_organization_id: organizationId,
      p_overall_health: "Not Assessed",
      p_resource_health: "Not Assessed",
      p_risk_health: "Not Assessed",
      p_schedule_health: "Not Assessed",
      p_scope_health: "Not Assessed",
      p_sponsor_email: "",
      p_sponsor_name: "Issue Sponsor",
      p_start_date: "2026-08-01",
      p_status: "Draft",
      p_target_completion_date: "2026-12-31",
    });
    if (project.error) throw project.error;
    projectId = project.data;
    const owners = await client.rpc("get_eligible_risk_owners", { p_project_id: projectId });
    if (owners.error || !owners.data.length) throw owners.error ?? new Error("Risk owner fixture unavailable.");
    const managerMembershipId = owners.data[0].membership_id;
    await client.auth.signOut();

    provisionLocalProjectMember({ userId: ids[1], email: users.member, fullName: "Issue Member", organizationId, projectId });
    provisionLocalProjectMember({ userId: ids[2], email: users.viewer, fullName: "Issue Viewer", organizationId, projectId });
    await createRiskFixture(managerMembershipId, "Realized infrastructure outage", "Realized");
    await createRiskFixture(managerMembershipId, "Active capacity concern");
    await createRiskFixture(managerMembershipId, "Closed obsolete concern", "Closed");

    const outsider = createLocalUserClient();
    await outsider.auth.signInWithPassword({ email: users.outsider, password });
    const other = await outsider.rpc("complete_onboarding", {
      p_full_name: "Issue Outsider",
      p_organization_name: `Other ${suffix}`,
    });
    if (other.error) throw other.error;
    await outsider.auth.signOut();
  });

  test.afterAll(async () => deleteLocalTestUsers(ids));

  test("anonymous and inaccessible issue access is non-revealing", async ({ page }) => {
    await page.goto(`/projects/${projectId}/raid`);
    await expect(page).toHaveURL(/sign-in/);
    await login(page, users.outsider);
    await page.goto(`/projects/${projectId}/raid`);
    await expect(page.getByRole("heading", { name: "Project not available" })).toBeVisible();
  });

  test("administrator creates, blocks, and resolves an issue on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await login(page, users.admin);
    await page.goto(`/projects/${projectId}`);
    await page.getByRole("link", { name: "RAID register" }).click();
    await expect(page.getByRole("heading", { name: "Risks", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Issues" }).click();
    await expect(page.getByText("No active issues")).toBeVisible();
    await page.getByLabel("Occurred problem details").fill("Production service is unavailable.");
    await page.getByRole("button", { name: "Add issue" }).click();
    await expect(page.getByText("Enter an issue title.")).toBeVisible();
    await expect(page.getByLabel("Occurred problem details")).toHaveValue("Production service is unavailable.");
    await fillIssueForm(page, {
      name: "Production outage",
      details: "Production service is unavailable.",
      severity: "Critical",
      effect: "Customers cannot complete work.",
      plan: "Restore the service and validate recovery.",
      target: "2026-08-01",
    });
    await page.getByRole("button", { name: "Add issue" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Issue added.")).toBeVisible();
    let card = page.locator("article").filter({ hasText: "Production outage" });
    await expect(card.getByText(/Attention required: Overdue resolution, Critical severity/)).toBeVisible();
    await card.getByLabel("Blocked reason for Production outage").fill("Waiting for recovery approval.");
    await card.getByRole("button", { name: "Mark blocked" }).click();
    await expect(page.getByText("Issue status updated.")).toBeVisible();
    card = page.locator("article").filter({ hasText: "Production outage" });
    await expect(card.getByRole("definition").filter({ hasText: "Waiting for recovery approval." })).toBeVisible();
    await card.getByLabel("Resolution notes for Production outage").fill("Service restored and validated.");
    await card.getByLabel("Confirm resolve for Production outage").check();
    await card.getByRole("button", { name: "Resolve Production outage" }).click();
    await expect(page.getByText("Issue resolved.")).toBeVisible();
    await expect(page.getByText("This terminal issue is read-only.")).toBeVisible();
    expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(390);
    await page.reload();
    await expect(page.getByText("Service restored and validated.")).toBeVisible();
  });

  test("manager links a Realized Risk and edits only active planning fields", async ({ page }) => {
    await login(page, users.admin);
    await page.goto(`/projects/${projectId}/raid#issues`);
    const origin = page.getByLabel("Originating realized risk (optional)");
    await expect(origin.getByRole("option", { name: "Realized infrastructure outage" })).toHaveCount(1);
    await expect(origin.getByRole("option", { name: "Active capacity concern" })).toHaveCount(0);
    await expect(origin.getByRole("option", { name: "Closed obsolete concern" })).toHaveCount(0);
    await fillIssueForm(page, {
      name: "Linked infrastructure issue",
      details: "The realized outage now requires follow-up.",
      severity: "High",
      effect: "Delivery is delayed.",
      plan: "Stabilize the affected service.",
      target: "2026-08-20",
      origin: "Realized infrastructure outage",
    });
    await page.getByRole("button", { name: "Add issue" }).click();
    await expect(page.getByText("Issue added.")).toBeVisible();
    let card = page.locator("article").filter({ hasText: "Linked infrastructure issue" });
    await expect(card.getByText("Realized infrastructure outage - Realized")).toBeVisible();
    await page.reload();
    card = page.locator("article").filter({ hasText: "Linked infrastructure issue" });
    await expect(card.getByText("Realized infrastructure outage - Realized")).toBeVisible();
    await card.getByRole("link", { name: "Edit issue Linked infrastructure issue" }).click();
    await expect(page.getByRole("heading", { name: "Edit issue" })).toBeVisible();
    await expect(page.getByLabel("Originating realized risk (optional)")).toHaveCount(0);
    await expect(page.getByLabel("Date identified")).toHaveCount(0);
    await fillIssueForm(page, {
      name: "Linked infrastructure issue revised",
      details: "The outage requires a revised recovery response.",
      severity: "Critical",
      effect: "Two delivery streams are delayed.",
      plan: "Stabilize service and complete recovery validation.",
      target: "2026-08-25",
      ownerIndex: 2,
    });
    await page.getByRole("button", { name: "Save issue" }).click();
    await expect(page.getByText("Issue updated.")).toBeVisible();
    card = page.locator("article").filter({ hasText: "Linked infrastructure issue revised" });
    await expect(card.getByText("Critical severity", { exact: true })).toBeVisible();
    await expect(card.getByText("Two delivery streams are delayed.")).toBeVisible();
    await expect(card.getByText("Stabilize service and complete recovery validation.")).toBeVisible();
    await expect(card.getByText("Realized infrastructure outage - Realized")).toBeVisible();
    await page.reload();
    card = page.locator("article").filter({ hasText: "Linked infrastructure issue revised" });
    await expect(card.getByText("The outage requires a revised recovery response.")).toBeVisible();
    await expect(card.getByText("Two delivery streams are delayed.")).toBeVisible();
    await expect(card.getByText("Realized infrastructure outage - Realized")).toBeVisible();
  });

  test("manager deliberately cancels an issue with persistent trusted audit", async ({ page }) => {
    await login(page, users.admin);
    await page.goto(`/projects/${projectId}/raid#issues`);
    await fillIssueForm(page, {
      name: "Obsolete supplier issue",
      details: "The supplier problem no longer needs resolution.",
      severity: "Medium",
      effect: "A previous delivery path was affected.",
      plan: "Confirm the replacement path before cancellation.",
      target: "2026-08-30",
    });
    await page.getByRole("button", { name: "Add issue" }).click();
    await expect(page.getByText("Issue added.")).toBeVisible();
    let card = page.locator("article").filter({ hasText: "Obsolete supplier issue" });
    const notes = card.getByLabel("Cancellation notes for Obsolete supplier issue");
    const confirmation = card.getByLabel("Confirm cancel for Obsolete supplier issue");
    await card.getByRole("button", { name: "Cancel Obsolete supplier issue" }).click();
    await expect(notes).toHaveJSProperty("validity.valueMissing", true);
    await notes.fill("Replacement delivery path confirmed; further resolution is unnecessary.");
    await card.getByRole("button", { name: "Cancel Obsolete supplier issue" }).click();
    await expect(confirmation).toHaveJSProperty("validity.valueMissing", true);
    await confirmation.check();
    await card.getByRole("button", { name: "Cancel Obsolete supplier issue" }).click();
    await expect(page.getByText("Issue cancelled.")).toBeVisible();
    card = page.locator("article").filter({ hasText: "Obsolete supplier issue" });
    await expect(card.locator("dt").filter({ hasText: /^Cancelled$/ })).toBeVisible();
    await expect(card.getByText(/by Issue Admin\. Replacement delivery path confirmed/)).toBeVisible();
    await expect(card.getByText("This terminal issue is read-only.")).toBeVisible();
    await expect(card.getByRole("button")).toHaveCount(0);
    await expect(card.getByRole("link", { name: /Edit issue/ })).toHaveCount(0);
    await expect(card.getByRole("textbox")).toHaveCount(0);
    await expect(card.getByRole("checkbox")).toHaveCount(0);

    const client = createLocalUserClient();
    await client.auth.signInWithPassword({ email: users.admin, password });
    const audit = await client.from("project_issues").select("cancelled_by,cancelled_at").eq("title", "Obsolete supplier issue").single();
    expect(audit.error).toBeNull();
    expect(audit.data?.cancelled_by).toBe(ids[0]);
    expect(audit.data?.cancelled_at).toBeTruthy();
    await page.reload();
    card = page.locator("article").filter({ hasText: "Obsolete supplier issue" });
    await expect(card.getByText(/by Issue Admin\. Replacement delivery path confirmed/)).toBeVisible();
    await expect(card.getByRole("button")).toHaveCount(0);
    await expect(card.getByRole("link", { name: /Edit issue/ })).toHaveCount(0);
    await client.auth.signOut();
  });

  test("assigned owner and Read Only user remain read-only", async ({ page }) => {
    await login(page, users.member);
    await page.goto(`/projects/${projectId}/raid#issues`);
    await expect(page.getByText("Issue ownership is informational and does not permit changes.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Add issue" })).toHaveCount(0);
    await page.getByRole("button", { name: "Sign out" }).click();
    await login(page, users.admin);
    await page.goto(`/projects/${projectId}/team`);
    const card = page.locator("article").filter({ hasText: users.viewer });
    await card.getByLabel("Access level").selectOption("Read Only");
    await card.getByRole("button", { name: "Update access" }).click();
    await page.getByRole("button", { name: "Sign out" }).click();
    await login(page, users.viewer);
    await page.goto(`/projects/${projectId}/raid#issues`);
    await expect(page.getByText("Production outage")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Add issue" })).toHaveCount(0);
  });
});
