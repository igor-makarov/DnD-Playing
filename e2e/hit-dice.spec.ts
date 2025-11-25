import { expect, test } from "@playwright/test";

test.describe("Hit Dice Query String", () => {
  test("Azamat - should update query string when editing one hit dice cell", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto("/Azamat");

    // Wait for the page to be loaded
    await page.waitForLoadState("networkidle");

    // Find the hit dice table - Azamat has 14d10 hit dice
    const hitDiceTable = page.locator("table").filter({ hasText: "Hit Dice" });
    await expect(hitDiceTable).toBeVisible();

    // Get initial URL
    const initialURL = page.url();
    console.log("Initial URL:", initialURL);

    // Find the d10 row
    const d10Row = hitDiceTable.locator("tr").filter({ hasText: "d10" });
    await expect(d10Row).toBeVisible();

    // Find the input field showing "14 / 14" (or similar)
    const inputField = d10Row.locator('input[type="text"]');
    await expect(inputField).toBeVisible();

    // Check initial value should be empty (meaning max)
    const initialValue = await inputField.inputValue();
    console.log("Initial input value:", initialValue);

    // Edit the input to set available dice to 10
    await inputField.click();
    await inputField.fill("10");
    await inputField.press("Enter");

    // Wait a bit for the URL to update
    await page.waitForTimeout(500);

    // Check the URL has been updated
    const updatedURL = page.url();
    console.log("Updated URL after edit:", updatedURL);

    // Parse the query string
    const url = new URL(updatedURL);
    const hitDiceD10 = url.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param:", hitDiceD10);

    // The value should be 10 after editing
    expect(hitDiceD10).toBe("10");

    // Edit again to reduce to 5
    await inputField.click();
    await inputField.fill("5");
    await inputField.press("Enter");
    await page.waitForTimeout(500);

    const url2 = new URL(page.url());
    const hitDiceD10Second = url2.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after second edit:", hitDiceD10Second);
    expect(hitDiceD10Second).toBe("5");

    // Clear the input to restore to maximum
    await inputField.click();
    await inputField.clear();
    await inputField.press("Enter");
    await page.waitForTimeout(500);

    const url3 = new URL(page.url());
    const hitDiceD10Third = url3.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after clearing:", hitDiceD10Third);
    // Should be null/undefined when at maximum (default value)
    expect(hitDiceD10Third).toBeNull();
  });

  test("Azamat - should update query string when clicking damage roll cell", async ({ page }) => {
    // Navigate to Azamat page
    await page.goto("/Azamat");
    await page.waitForLoadState("networkidle");

    // Find the hit dice table
    const hitDiceTable = page.locator("table").filter({ hasText: "Hit Dice" });
    const d10Row = hitDiceTable.locator("tr").filter({ hasText: "d10" });

    // Find the damage roll cell (should contain text like "1d10+2" or similar)
    // It's typically the last cell in the row
    const damageRollCell = d10Row.locator("td").last();
    await expect(damageRollCell).toBeVisible();
    console.log("Damage roll cell text:", await damageRollCell.textContent());

    // Click the damage roll cell to use one hit die
    await damageRollCell.click();
    await page.waitForTimeout(500);

    // Check the URL has been updated
    const url = new URL(page.url());
    const hitDiceD10 = url.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after clicking roll:", hitDiceD10);

    // After using one die from 14, should have 13 remaining
    expect(hitDiceD10).toBe("13");

    // Click again
    await damageRollCell.click();
    await page.waitForTimeout(500);

    const url2 = new URL(page.url());
    const hitDiceD10Second = url2.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after second click:", hitDiceD10Second);
    expect(hitDiceD10Second).toBe("12");
  });

  test("Adrik - should update query string when editing each hit dice cell", async ({ page }) => {
    // Navigate to Adrik page
    await page.goto("/Adrik");
    await page.waitForLoadState("networkidle");

    // Find the hit dice table - Adrik has 5d10 (Ranger) + 7d8 (Cleric)
    const hitDiceTable = page.locator("table").filter({ hasText: "Hit Dice" });
    await expect(hitDiceTable).toBeVisible();

    // Get initial URL
    const initialURL = page.url();
    console.log("Initial URL:", initialURL);

    // Test d10 row (Ranger dice)
    const d10Row = hitDiceTable.locator("tr").filter({ hasText: "d10" });
    await expect(d10Row).toBeVisible();
    const d10Input = d10Row.locator('input[type="text"]');

    // Edit d10 to 3
    await d10Input.click();
    await d10Input.fill("3");
    await d10Input.press("Enter");
    await page.waitForTimeout(500);

    let url = new URL(page.url());
    let hitDiceD10 = url.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after edit:", hitDiceD10);
    expect(hitDiceD10).toBe("3");

    // Test d8 row (Cleric dice)
    const d8Row = hitDiceTable.locator("tr").filter({ hasText: "d8" });
    await expect(d8Row).toBeVisible();
    const d8Input = d8Row.locator('input[type="text"]');

    // Edit d8 to 4
    await d8Input.click();
    await d8Input.fill("4");
    await d8Input.press("Enter");
    await page.waitForTimeout(500);

    url = new URL(page.url());
    const hitDiceD8 = url.searchParams.get("hit-dice-d8");
    console.log("hit-dice-d8 param after edit:", hitDiceD8);
    expect(hitDiceD8).toBe("4");

    // Both params should be in the URL
    hitDiceD10 = url.searchParams.get("hit-dice-d10");
    expect(hitDiceD10).toBe("3");
    expect(hitDiceD8).toBe("4");

    // Test arithmetic expressions - reduce d10 by 1 (3-1=2)
    await d10Input.click();
    await d10Input.fill("3-1");
    await d10Input.press("Enter");
    await page.waitForTimeout(500);

    url = new URL(page.url());
    hitDiceD10 = url.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after arithmetic:", hitDiceD10);
    expect(hitDiceD10).toBe("2");

    // Test arithmetic expressions - add 2 to d8 (4+2=6)
    await d8Input.click();
    await d8Input.fill("4+2");
    await d8Input.press("Enter");
    await page.waitForTimeout(500);

    url = new URL(page.url());
    const hitDiceD8After = url.searchParams.get("hit-dice-d8");
    console.log("hit-dice-d8 param after arithmetic:", hitDiceD8After);
    expect(hitDiceD8After).toBe("6");

    // Clear d10 input to restore to maximum
    await d10Input.click();
    await d10Input.clear();
    await d10Input.press("Enter");
    await page.waitForTimeout(500);

    url = new URL(page.url());
    hitDiceD10 = url.searchParams.get("hit-dice-d10");
    console.log("hit-dice-d10 param after clearing:", hitDiceD10);
    expect(hitDiceD10).toBeNull();

    // d8 should still be 6
    const finalD8 = url.searchParams.get("hit-dice-d8");
    expect(finalD8).toBe("6");
  });

  test("should preserve query string on page load - Azamat", async ({ page }) => {
    // Navigate with initial hit dice value
    await page.goto("/Azamat?hit-dice-d10=8");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Debug: Check the query string
    const queryString = await page.evaluate(() => {
      return window.location.search;
    });
    console.log("Query string from page:", queryString);

    // Find the hit dice table
    const hitDiceTable = page.locator("table").filter({ hasText: "Hit Dice" });
    const d10Row = hitDiceTable.locator("tr").filter({ hasText: "d10" });
    const inputField = d10Row.locator('input[type="text"]');

    // The input should show "8 / 14"
    const displayValue = await inputField.inputValue();
    console.log("Input field value:", displayValue);
    expect(displayValue).toBe("8");

    // Verify the URL still has the parameter
    const url = new URL(page.url());
    const hitDiceD10 = url.searchParams.get("hit-dice-d10");
    expect(hitDiceD10).toBe("8");
  });

  test("should preserve query string on page load - Adrik", async ({ page }) => {
    // Navigate with initial hit dice values for both die types
    await page.goto("/Adrik?hit-dice-d10=2&hit-dice-d8=5");
    await page.waitForLoadState("networkidle");

    // Wait for hydration
    await page.waitForTimeout(1000);

    // Debug: Check the query string
    const queryString = await page.evaluate(() => {
      return window.location.search;
    });
    console.log("Query string from page:", queryString);

    // Find the hit dice table
    const hitDiceTable = page.locator("table").filter({ hasText: "Hit Dice" });

    // Check d10 input
    const d10Row = hitDiceTable.locator("tr").filter({ hasText: "d10" });
    const d10Input = d10Row.locator('input[type="text"]');
    const d10Value = await d10Input.inputValue();
    console.log("d10 input field value:", d10Value);
    expect(d10Value).toBe("2");

    // Check d8 input
    const d8Row = hitDiceTable.locator("tr").filter({ hasText: "d8" });
    const d8Input = d8Row.locator('input[type="text"]');
    const d8Value = await d8Input.inputValue();
    console.log("d8 input field value:", d8Value);
    expect(d8Value).toBe("5");

    // Verify the URL still has both parameters
    const url = new URL(page.url());
    const hitDiceD10 = url.searchParams.get("hit-dice-d10");
    const hitDiceD8 = url.searchParams.get("hit-dice-d8");
    expect(hitDiceD10).toBe("2");
    expect(hitDiceD8).toBe("5");
  });
});
