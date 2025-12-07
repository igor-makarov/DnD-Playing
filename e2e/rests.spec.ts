import { expect, test } from "@playwright/test";

const azamatPath = "/characters/Azamat";
const adrikPath = "/characters/Adrik";

test.describe("Rest Buttons Browser History", () => {
  test("Azamat - Short Rest should create only one history entry", async ({ page }) => {
    // Navigate to Azamat page with channel divinity already used
    await page.goto(`${azamatPath}?channel-divinity-used=1`);
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Verify the URL has the parameter
    let url = new URL(page.url());
    expect(url.searchParams.get("channel-divinity-used")).toBe("1");

    // Get history length before Short Rest
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length before Short Rest:", initialHistoryLength);

    // Find and click the Short Rest button
    const shortRestButton = page.locator("button", { hasText: "Short Rest" });
    await expect(shortRestButton).toBeVisible();
    await shortRestButton.click();

    // Wait for the URL to update
    await page.waitForTimeout(500);

    // Get history length after Short Rest
    const afterShortRestHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length after Short Rest:", afterShortRestHistoryLength);

    // Should have added only ONE history entry
    expect(afterShortRestHistoryLength).toBe(initialHistoryLength + 1);

    // Verify channel divinity was restored (removed from URL)
    url = new URL(page.url());
    const channelDivinityAfter = url.searchParams.get("channel-divinity-used");
    console.log("channel-divinity-used after Short Rest:", channelDivinityAfter);
    expect(channelDivinityAfter).toBeNull();
  });

  test("Azamat - Long Rest should create only one history entry with multiple resources", async ({ page }) => {
    // Navigate to Azamat page with multiple resources already used
    await page.goto(`${azamatPath}?channel-divinity-used=1&hit-dice-d10=10&hit-points=100`);
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Verify all parameters are in URL
    let url = new URL(page.url());
    expect(url.searchParams.get("channel-divinity-used")).toBe("1");
    expect(url.searchParams.get("hit-dice-d10")).toBe("10");
    expect(url.searchParams.get("hit-points")).toBe("100");

    // Get history length before Long Rest
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length before Long Rest:", initialHistoryLength);

    // Find and click the Long Rest button
    const longRestButton = page.locator("button", { hasText: "Long Rest" });
    await expect(longRestButton).toBeVisible();
    await longRestButton.click();

    // Wait for the URL to update
    await page.waitForTimeout(500);

    // Get history length after Long Rest
    const afterLongRestHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length after Long Rest:", afterLongRestHistoryLength);

    // Should have added only ONE history entry despite updating multiple resources
    expect(afterLongRestHistoryLength).toBe(initialHistoryLength + 1);

    // Verify all resources were restored
    url = new URL(page.url());
    console.log("channel-divinity-used after Long Rest:", url.searchParams.get("channel-divinity-used"));
    console.log("hit-points after Long Rest:", url.searchParams.get("hit-points"));
    console.log("hit-dice-d10 after Long Rest:", url.searchParams.get("hit-dice-d10"));

    // All should be restored (removed from URL or set to default)
    expect(url.searchParams.get("channel-divinity-used")).toBeNull();
    expect(url.searchParams.get("hit-points")).toBeNull();
    // Hit dice should be partially restored (half of 14 = 7, so 10+7 = 14 which is max, so null)
    expect(url.searchParams.get("hit-dice-d10")).toBeNull();
  });

  test("Adrik - Long Rest should create only one history entry with multiple hit dice types", async ({ page }) => {
    // Navigate to Adrik page with multiple resources already used
    await page.goto(`${adrikPath}?hit-dice-d10=2&hit-dice-d8=3&channel-divinity-used=1`);
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Verify all params are in URL
    let url = new URL(page.url());
    expect(url.searchParams.get("hit-dice-d10")).toBe("2");
    expect(url.searchParams.get("hit-dice-d8")).toBe("3");
    expect(url.searchParams.get("channel-divinity-used")).toBe("1");

    // Get history length before Long Rest
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length before Long Rest:", initialHistoryLength);

    // Find and click the Long Rest button
    const longRestButton = page.locator("button", { hasText: "Long Rest" });
    await expect(longRestButton).toBeVisible();
    await longRestButton.click();

    // Wait for the URL to update
    await page.waitForTimeout(500);

    // Get history length after Long Rest
    const afterLongRestHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length after Long Rest:", afterLongRestHistoryLength);

    // Should have added only ONE history entry despite updating:
    // - d10 hit dice
    // - d8 hit dice
    // - channel divinity
    // - potentially other resources
    expect(afterLongRestHistoryLength).toBe(initialHistoryLength + 1);

    // Verify resources were restored
    url = new URL(page.url());
    const hitDiceD10After = url.searchParams.get("hit-dice-d10");
    const hitDiceD8After = url.searchParams.get("hit-dice-d8");
    const channelDivinityAfter = url.searchParams.get("channel-divinity-used");

    console.log("hit-dice-d10 after Long Rest:", hitDiceD10After);
    console.log("hit-dice-d8 after Long Rest:", hitDiceD8After);
    console.log("channel-divinity-used after Long Rest:", channelDivinityAfter);

    // Channel divinity should be restored
    expect(channelDivinityAfter).toBeNull();

    // Hit dice restoration: started with 2d10 + 3d8 (7 spent out of 12 total)
    // Can restore: floor(12/2) = 6 dice
    // Restores largest first: 3 to d10 (2+3=5, which is max), then 3 to d8 (3+3=6)
    expect(hitDiceD10After).toBeNull(); // d10 restored to max (5)
    expect(hitDiceD8After).toBe("6"); // d8 restored from 3 to 6
  });
});
