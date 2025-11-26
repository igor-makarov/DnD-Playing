import { expect, test } from "@playwright/test";

test.describe("Hit Points Browser History", () => {
  test("Azamat - should add one history entry after editing hit points once", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto("/Azamat");

    // Wait for the page to be loaded
    await page.waitForLoadState("networkidle");

    // Get initial history length
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Initial history length:", initialHistoryLength);

    // Find the HP table
    const hpTable = page.locator("table").filter({ hasText: "HP" });
    await expect(hpTable).toBeVisible();

    // Find the hit points input field
    const hpInput = hpTable.locator('input[type="text"]');
    await expect(hpInput).toBeVisible();

    // Get initial value
    const initialValue = await hpInput.inputValue();
    console.log("Initial HP value:", initialValue);

    // Edit the hit points
    await hpInput.click();
    await hpInput.fill("100");
    await hpInput.press("Enter");

    // Wait for the URL to update
    await page.waitForTimeout(500);

    // Get history length after editing
    const afterEditHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length after edit:", afterEditHistoryLength);

    // Should have one more history entry
    expect(afterEditHistoryLength).toBe(initialHistoryLength + 1);

    // Verify the URL has the hit-points parameter
    const url = new URL(page.url());
    const hitPoints = url.searchParams.get("hit-points");
    console.log("hit-points param:", hitPoints);
    expect(hitPoints).toBe("100");
  });
});
