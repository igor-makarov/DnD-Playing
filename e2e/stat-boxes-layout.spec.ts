import { expect, test } from "@playwright/test";

test.describe("Stat boxes layout", () => {
  test("Magpie - all four stat boxes should have the same height", async ({ page }) => {
    await page.goto("/characters/Magpie/");
    await page.waitForLoadState("networkidle");

    // Get the tables inside the four-across row columns
    const tables = page.locator(".row.four-across > .column > table");
    await expect(tables).toHaveCount(4);

    // Get bounding boxes for all tables
    const heights: number[] = [];
    for (let i = 0; i < 4; i++) {
      const box = await tables.nth(i).boundingBox();
      expect(box).not.toBeNull();
      heights.push(box!.height);
    }

    // All heights should be exactly equal
    const [first, ...rest] = heights;
    for (const height of rest) {
      expect(height).toBe(first);
    }
  });
});
