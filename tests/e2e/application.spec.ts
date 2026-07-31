import { expect, test } from "@playwright/test";

test("loads the current application shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Create Next App/);
  await expect(
    page.getByRole("heading", { name: "To get started, edit the page.tsx file." }),
  ).toBeVisible();
});
