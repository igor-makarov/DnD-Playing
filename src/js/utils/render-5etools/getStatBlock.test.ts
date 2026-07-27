import { describe, expect, it } from "vitest";

import { getStatBlock } from "./getStatBlock";
import renderHTML from "./renderHTML";

describe("getStatBlock", () => {
  it("loads a generic stat block from 5etools bestiary data", () => {
    const rendered = renderHTML(getStatBlock("Wolf", "XMM")).sanitizedHtml;

    expect(rendered).toContain("<h1>Wolf");
    expect(rendered).toContain("<em>Medium Beast, Unaligned</em>");
    expect(rendered).toContain("<strong>Armor Class:</strong> 12");
    expect(rendered).toContain("<strong>Initiative:</strong> +2 (12)");
    expect(rendered).toContain("<strong>Hit Points:</strong> 11 (2d8 + 2)");
    expect(rendered).toContain("<strong>Bite.</strong>");
    expect(rendered).toContain("<em>Melee Attack Roll:</em> <strong>+4</strong>");
  });
});
