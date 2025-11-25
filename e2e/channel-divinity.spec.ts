import { expect, test } from "@playwright/test";

test.describe("Channel Divinity Query String", () => {
  test("should update query string when checking channel divinity checkboxes", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto("/Azamat");

    // Wait for the page to be loaded
    await page.waitForLoadState("networkidle");

    // Find the channel divinity checkboxes
    // They should be in the Features table
    const channelDivinityRow = page.locator("text=Channel Divinity").locator("..");
    await expect(channelDivinityRow).toBeVisible();

    // Get initial URL
    const initialURL = page.url();
    console.log("Initial URL:", initialURL);

    // Find checkboxes in the channel divinity row
    const checkboxes = channelDivinityRow.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    console.log("Number of checkboxes found:", checkboxCount);

    if (checkboxCount === 0) {
      throw new Error("No checkboxes found for Channel Divinity");
    }

    // Click the first checkbox
    await checkboxes.first().click();

    // Wait a bit for the URL to update
    await page.waitForTimeout(500);

    // Check the URL has been updated
    const updatedURL = page.url();
    console.log("Updated URL after click:", updatedURL);

    // Parse the query string
    const url = new URL(updatedURL);
    const channelDivinityUsed = url.searchParams.get("channel-divinity-used");
    console.log("channel-divinity-used param:", channelDivinityUsed);

    // The value should be 1 after clicking the first checkbox
    expect(channelDivinityUsed).toBe("1");

    // Click second checkbox
    if (checkboxCount > 1) {
      await checkboxes.nth(1).click();
      await page.waitForTimeout(500);

      const url2 = new URL(page.url());
      const channelDivinityUsed2 = url2.searchParams.get("channel-divinity-used");
      console.log("channel-divinity-used param after second click:", channelDivinityUsed2);
      expect(channelDivinityUsed2).toBe("2");
    }

    // Uncheck the first checkbox
    await checkboxes.first().click();
    await page.waitForTimeout(500);

    const url3 = new URL(page.url());
    const channelDivinityUsed3 = url3.searchParams.get("channel-divinity-used");
    console.log("channel-divinity-used param after unchecking first:", channelDivinityUsed3);

    if (checkboxCount > 1) {
      expect(channelDivinityUsed3).toBe("1");
    } else {
      // Should be removed when set to 0 (default value)
      expect(channelDivinityUsed3).toBeNull();
    }
  });

  test("should preserve query string on page load", async ({ page }) => {
    // Navigate with initial channel divinity value
    await page.goto("/Azamat?channel-divinity-used=2");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Debug: Check what value the store has
    const storeValue = await page.evaluate(() => {
      // @ts-ignore
      return window.location.search;
    });
    console.log("Query string from page:", storeValue);

    // Check that checkboxes reflect the query string state
    const channelDivinityRow = page.locator("text=Channel Divinity").locator("..");
    const checkboxes = channelDivinityRow.locator('input[type="checkbox"]');

    // Debug: log checkbox states
    const count = await checkboxes.count();
    console.log("Checkbox count:", count);
    for (let i = 0; i < count; i++) {
      const isChecked = await checkboxes.nth(i).isChecked();
      const hasCheckedAttr = await checkboxes.nth(i).getAttribute("checked");
      console.log(`Checkbox ${i} checked:`, isChecked, "hasAttr:", hasCheckedAttr);
    }

    // First two checkboxes should be checked
    await expect(checkboxes.nth(0)).toBeChecked();
    await expect(checkboxes.nth(1)).toBeChecked();

    // If there's a third checkbox, it should not be checked
    if (count > 2) {
      await expect(checkboxes.nth(2)).not.toBeChecked();
    }
  });
});
