import { expect, test } from "@playwright/test";

test("Steel Defender Repair uses reset on a Long Rest", async ({ page }) => {
  await page.goto("/npcs/Shelly/");
  await page.waitForLoadState("networkidle");

  const repairRow = page.getByRole("row").filter({ hasText: "Repair" });
  await repairRow.getByRole("checkbox").first().check();

  await expect.poll(() => new URL(page.url()).searchParams.get("steel-defender-repair-used")).toBe("1");

  await page.getByRole("button", { name: "Long Rest" }).click();

  await expect.poll(() => new URL(page.url()).searchParams.get("steel-defender-repair-used")).toBeNull();
  await expect(repairRow.getByRole("checkbox").first()).not.toBeChecked();
});

test("Steel Defender actions have tooltip references", async ({ page }) => {
  await page.goto("/npcs/Shelly/");
  await page.waitForLoadState("networkidle");

  const actionsTable = page.getByRole("table").filter({ hasText: "Actions" });
  const dialog = page.locator("dialog.info-tooltip-dialog[open]");

  await actionsTable.getByRole("button", { name: "Force-Empowered Rend" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Melee Attack Roll:");
  await expect(dialog).toContainText("Force-Empowered Rend");

  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).not.toBeVisible();

  await actionsTable.getByRole("button", { name: "Repair" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Repair (3/Day)");
});
