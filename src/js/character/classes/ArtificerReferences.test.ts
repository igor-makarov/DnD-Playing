import { describe, expect, it } from "vitest";

import renderHTML from "@/js/utils/render-5etools/renderHTML";

import { getSteelDefender } from "./ArtificerReferences";

describe("getSteelDefender", () => {
  it("resolves owner-dependent values", () => {
    const rendered = renderHTML(
      getSteelDefender({
        artificerLevel: 3,
        intelligenceModifier: 3,
        proficiencyBonus: 2,
        spellAttackModifier: 5,
      }),
    ).sanitizedHtml;

    expect(rendered).toContain("<strong>Armor Class:</strong> 15");
    expect(rendered).toContain("<strong>Initiative:</strong> +1 (11)");
    expect(rendered).toContain("<strong>Hit Points:</strong> 20 (3d8 Hit Dice)");
    expect(rendered).toContain("<strong>Proficiency Bonus:</strong> +2");
    expect(rendered).toContain("<h3>Traits</h3><p><strong>Steel Bond.</strong>");
    expect(rendered).toContain("<em>Melee Attack Roll:</em> <strong>+5</strong>");
    expect(rendered).toContain("<highlight-5e>d8+5</highlight-5e>");
    expect(rendered).toContain("<highlight-5e>2d8+3</highlight-5e>");
    expect(rendered).toContain("<em>Trigger:</em>");
    expect(rendered).toContain("<em>Response:</em>");
  });

  it("updates values when owner stats change", () => {
    const rendered = renderHTML(
      getSteelDefender({
        artificerLevel: 10,
        intelligenceModifier: 5,
        proficiencyBonus: 4,
        spellAttackModifier: 9,
      }),
    ).sanitizedHtml;

    expect(rendered).toContain("<strong>Armor Class:</strong> 17");
    expect(rendered).toContain("<strong>Hit Points:</strong> 55 (10d8 Hit Dice)");
    expect(rendered).toContain("<strong>Proficiency Bonus:</strong> +4");
    expect(rendered).toContain("<em>Melee Attack Roll:</em> <strong>+9</strong>");
    expect(rendered).toContain("<highlight-5e>d8+7</highlight-5e>");
    expect(rendered).toContain("<highlight-5e>2d8+5</highlight-5e>");
  });
});
