import { expect, test } from "@playwright/test";

const APP_MODE_URL_REGEX = /^dice:\/\/roll\//;
const SITE_MODE_URL_REGEX = /^https:\/\/dice\.run\/#\/d\//;

test.describe("Roll Mode Browser History", () => {
  test("should not create new history entry when toggling roll mode (replace mode)", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto("/Azamat");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Get initial URL and history length
    const initialURL = page.url();
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Initial URL:", initialURL);
    console.log("Initial history length:", initialHistoryLength);

    // Find a dice roll link (D20TestCell or DamageCell)
    const diceRollLink = page.locator("a.dice-roll").first();
    await expect(diceRollLink).toBeVisible();

    // Check initial href (should be dice:// URL for "app" mode)
    const initialHref = await diceRollLink.getAttribute("href");
    console.log("Initial dice roll href:", initialHref);
    expect(initialHref).toMatch(APP_MODE_URL_REGEX);

    // Press "r" to toggle roll mode
    await page.keyboard.press("r");

    // Wait for the URL to update
    await page.waitForTimeout(500);

    // Get updated URL and history length
    const updatedURL = page.url();
    const updatedHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Updated URL after pressing 'r':", updatedURL);
    console.log("History length after pressing 'r':", updatedHistoryLength);

    // History length should NOT change (replace mode)
    expect(updatedHistoryLength).toBe(initialHistoryLength);

    // URL should have the roll parameter
    const url = new URL(updatedURL);
    const rollMode = url.searchParams.get("roll");
    console.log("roll param after first toggle:", rollMode);
    expect(rollMode).toBe("site");

    // Check dice roll link href changed to https://dice.run URL
    const updatedHref = await diceRollLink.getAttribute("href");
    console.log("Dice roll href after toggle to 'site':", updatedHref);
    expect(updatedHref).toMatch(SITE_MODE_URL_REGEX);

    // Press "r" again to toggle back
    await page.keyboard.press("r");
    await page.waitForTimeout(500);

    const secondToggleURL = page.url();
    const secondToggleHistoryLength = await page.evaluate(() => window.history.length);
    console.log("URL after pressing 'r' again:", secondToggleURL);
    console.log("History length after second toggle:", secondToggleHistoryLength);

    // History length should still NOT change
    expect(secondToggleHistoryLength).toBe(initialHistoryLength);

    // Roll parameter should be removed (back to default "app")
    const url2 = new URL(secondToggleURL);
    const rollMode2 = url2.searchParams.get("roll");
    console.log("roll param after second toggle:", rollMode2);
    expect(rollMode2).toBeNull(); // Should be removed when back to default

    // Check dice roll link href changed back to dice:// URL
    const finalHref = await diceRollLink.getAttribute("href");
    console.log("Dice roll href after toggle back to 'app':", finalHref);
    expect(finalHref).toMatch(APP_MODE_URL_REGEX);
  });

  test("should preserve roll mode query parameter on page load", async ({ page }) => {
    // Navigate with initial roll mode value
    await page.goto("/Azamat?roll=site");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Verify the URL still has the roll parameter
    const url = new URL(page.url());
    const rollMode = url.searchParams.get("roll");
    console.log("roll param from URL:", rollMode);
    expect(rollMode).toBe("site");

    // Find a dice roll link and verify it uses the site mode URL
    const diceRollLink = page.locator("a.dice-roll").first();
    await expect(diceRollLink).toBeVisible();

    const href = await diceRollLink.getAttribute("href");
    console.log("Dice roll href with roll=site:", href);
    expect(href).toMatch(SITE_MODE_URL_REGEX);
  });

  test("should toggle from site mode back to app mode", async ({ page }) => {
    // Navigate with roll=site
    await page.goto("/Azamat?roll=site");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Get initial URL and history length
    const initialURL = page.url();
    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Initial URL:", initialURL);
    console.log("Initial history length:", initialHistoryLength);

    // Verify we're in site mode
    const url = new URL(initialURL);
    expect(url.searchParams.get("roll")).toBe("site");

    // Find a dice roll link
    const diceRollLink = page.locator("a.dice-roll").first();
    await expect(diceRollLink).toBeVisible();

    // Check initial href (should be https://dice.run URL for "site" mode)
    const initialHref = await diceRollLink.getAttribute("href");
    console.log("Initial dice roll href (site mode):", initialHref);
    expect(initialHref).toMatch(SITE_MODE_URL_REGEX);

    // Press "r" to toggle to app mode
    await page.keyboard.press("r");
    await page.waitForTimeout(500);

    // Get updated URL and history length
    const updatedURL = page.url();
    const updatedHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Updated URL after pressing 'r':", updatedURL);
    console.log("History length after pressing 'r':", updatedHistoryLength);

    // History length should NOT change (replace mode)
    expect(updatedHistoryLength).toBe(initialHistoryLength);

    // Roll parameter should be removed (back to default "app")
    const url2 = new URL(updatedURL);
    const rollMode = url2.searchParams.get("roll");
    console.log("roll param after toggle to app:", rollMode);
    expect(rollMode).toBeNull();

    // Check dice roll link href changed to dice:// URL
    const updatedHref = await diceRollLink.getAttribute("href");
    console.log("Dice roll href after toggle to 'app':", updatedHref);
    expect(updatedHref).toMatch(APP_MODE_URL_REGEX);
  });

  test("should not toggle roll mode when typing in input field", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto("/Azamat");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Find a dice roll link to check later
    const diceRollLink = page.locator("a.dice-roll").first();
    await expect(diceRollLink).toBeVisible();

    // Check initial href (should be dice:// URL)
    const initialHref = await diceRollLink.getAttribute("href");
    console.log("Initial dice roll href:", initialHref);
    expect(initialHref).toMatch(APP_MODE_URL_REGEX);

    // Find hit points input (it's a text input, not number)
    const hitPointsInput = page.locator('input[type="text"]').first();
    await expect(hitPointsInput).toBeVisible();

    // Focus on the input
    await hitPointsInput.focus();

    // Press "r" while focused on input
    await page.keyboard.press("r");
    await page.waitForTimeout(500);

    // URL should NOT have the roll parameter (toggle should be ignored in input)
    const url = new URL(page.url());
    const rollMode = url.searchParams.get("roll");
    console.log("roll param after pressing 'r' in input:", rollMode);
    expect(rollMode).toBeNull();

    // Dice roll link should still be dice:// URL (no change)
    const hrefAfterInputR = await diceRollLink.getAttribute("href");
    console.log("Dice roll href after 'r' in input:", hrefAfterInputR);
    expect(hrefAfterInputR).toMatch(APP_MODE_URL_REGEX);

    // Now unfocus and press "r" - it should work
    await page.keyboard.press("Escape"); // Unfocus
    await page.waitForTimeout(200);
    await page.keyboard.press("r");
    await page.waitForTimeout(500);

    const url2 = new URL(page.url());
    const rollMode2 = url2.searchParams.get("roll");
    console.log("roll param after pressing 'r' outside input:", rollMode2);
    expect(rollMode2).toBe("site");

    // Dice roll link should now be https://dice.run URL
    const finalHref = await diceRollLink.getAttribute("href");
    console.log("Dice roll href after 'r' outside input:", finalHref);
    expect(finalHref).toMatch(SITE_MODE_URL_REGEX);
  });
});
