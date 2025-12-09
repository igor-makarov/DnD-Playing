import { expect, test } from "@playwright/test";

const azamatPath = "/characters/Azamat";

test.describe("InfoTooltip", () => {
  test("opening Warforged tooltip should not focus close button and should not scroll", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto(azamatPath);
    await page.waitForLoadState("networkidle");

    // Find the Warforged InfoTooltip button
    const warforgedButton = page.locator("button.info-tooltip-button", { hasText: "Warforged" });
    await expect(warforgedButton).toBeVisible();

    // Get the dialog element
    const dialog = page.locator("dialog.info-tooltip-dialog").first();

    // Click to open the tooltip dialog
    await warforgedButton.click();

    // Wait for dialog to be visible
    await expect(dialog).toBeVisible();

    // Check that the close button is NOT focused
    const closeButton = dialog.locator("button", { hasText: "Close" });
    await expect(closeButton).toBeVisible();

    // The close button should NOT be the active element (focused)
    const isCloseButtonFocused = await closeButton.evaluate((el) => document.activeElement === el);
    expect(isCloseButtonFocused).toBe(false);

    // Check that the dialog content is not scrolled down
    // The scrollTop of the dialog content should be 0 (at the top)
    const scrollTop = await dialog.evaluate((el) => el.scrollTop);
    expect(scrollTop).toBe(0);
  });
});
