import { expect, test } from "@playwright/test";

const azamatPath = "/characters/Azamat";

test.describe("Hit Points Browser History", () => {
  test("Azamat - should add one history entry after editing hit points once", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto(azamatPath);

    // Wait for the page to be loaded
    await page.waitForLoadState("networkidle");

    // Get initial history length
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Initial history length:", initialHistoryLength);

    // Find the hit points input field using data-testid
    const hpInput = page.getByTestId("hp-input");
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

  test("Azamat - should add one history entry after editing temporary hit points once", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto(azamatPath);

    // Wait for the page to be loaded
    await page.waitForLoadState("networkidle");

    // Get initial history length
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Initial history length:", initialHistoryLength);

    // Find the temporary hit points input field using data-testid
    const tempHpInput = page.getByTestId("temp-hp-input");
    await expect(tempHpInput).toBeVisible();

    // Get initial value (should be 0)
    const initialValue = await tempHpInput.inputValue();
    console.log("Initial Temp HP value:", initialValue);
    expect(initialValue).toBe("0");

    // Edit the temporary hit points
    await tempHpInput.click();
    await tempHpInput.fill("50");
    await tempHpInput.press("Enter");

    // Wait for the URL to update
    await page.waitForTimeout(500);

    // Get history length after editing
    const afterEditHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length after edit:", afterEditHistoryLength);

    // Should have one more history entry
    expect(afterEditHistoryLength).toBe(initialHistoryLength + 1);

    // Verify the URL has the temp-hit-points parameter
    const url = new URL(page.url());
    const tempHitPoints = url.searchParams.get("temp-hit-points");
    console.log("temp-hit-points param:", tempHitPoints);
    expect(tempHitPoints).toBe("50");
  });
});
