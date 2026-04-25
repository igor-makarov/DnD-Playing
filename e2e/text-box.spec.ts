import { expect, test } from "@playwright/test";

const benderPath = "/characters/Bender/";

test.describe("Text Box Query String", () => {
  test("Bender - should update notes query parameter when editing notes text box", async ({ page }) => {
    await page.goto(benderPath);
    await page.waitForLoadState("networkidle");

    const initialHistoryLength = await page.evaluate(() => window.history.length);
    console.log("Initial history length:", initialHistoryLength);

    const notesTextBox = page.getByTestId("notes-text-box");
    await expect(notesTextBox).toBeVisible();

    const notes = "Sneak attack with Vex";
    await notesTextBox.fill(notes);

    await expect
      .poll(() => {
        const url = new URL(page.url());
        return url.searchParams.get("notes");
      })
      .toBe(notes);

    const afterEditHistoryLength = await page.evaluate(() => window.history.length);
    console.log("History length after edit:", afterEditHistoryLength);
    expect(afterEditHistoryLength).toBe(initialHistoryLength);
  });

  test("Bender - should preserve notes query parameter on page load", async ({ page }) => {
    const notes = "Remember thieves' tools";
    const query = new URLSearchParams({ notes });

    await page.goto(`${benderPath}?${query}`);
    await page.waitForLoadState("networkidle");

    const notesTextBox = page.getByTestId("notes-text-box");
    await expect(notesTextBox).toBeVisible();
    await expect(notesTextBox).toHaveValue(notes);

    const url = new URL(page.url());
    const notesParam = url.searchParams.get("notes");
    console.log("notes param from URL:", notesParam);
    expect(notesParam).toBe(notes);
  });

  test("Bender - should remove notes query parameter when notes text box is cleared", async ({ page }) => {
    const query = new URLSearchParams({ notes: "Temporary note" });

    await page.goto(`${benderPath}?${query}`);
    await page.waitForLoadState("networkidle");

    const notesTextBox = page.getByTestId("notes-text-box");
    await expect(notesTextBox).toHaveValue("Temporary note");

    await notesTextBox.fill("");

    await expect
      .poll(() => {
        const url = new URL(page.url());
        return url.searchParams.get("notes");
      })
      .toBeNull();
  });
});
