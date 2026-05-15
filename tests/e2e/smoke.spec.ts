import { expect, test } from "@playwright/test";

test("home page renders and links to the game", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Titrate the Vinegar/i })).toBeVisible();
  await page.getByRole("link", { name: /Start the lab/i }).click();
  await expect(page.getByRole("heading", { name: /Vinegar Titration/i })).toBeVisible();
});

test("clicking Drop advances volume", async ({ page }) => {
  await page.goto("/game");
  await page.getByRole("button", { name: /Drop/i }).click();
  await expect(page.locator("text=mL added")).toBeVisible();
});
