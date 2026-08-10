import { describe, expect, it } from "vitest";

import renderHTML from "@/js/utils/render-5etools/renderHTML";

import { getSteelDefender, getSteelDefenderGameplay, getSteelDefenderGameplayStatBlock } from "./ArtificerReferences";

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

  it("adapts owner stats to an explicit gameplay model", () => {
    const statBlock = getSteelDefenderGameplayStatBlock({
      artificerLevel: 3,
      intelligenceModifier: 3,
      proficiencyBonus: 2,
      spellAttackModifier: 5,
    });

    expect(statBlock).toMatchObject({
      id: "steel-defender",
      proficiencyBonus: 2,
      armorClass: 15,
      hitPointMaximum: 20,
      hitDice: [{ die: "d8", count: 3 }],
      initiativeBonus: 3,
    });
    expect(statBlock.abilities.find(({ ability }) => ability === "Str")).toMatchObject({ checkBonus: 4, saveBonus: 4 });
    expect(statBlock.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Force-Empowered Rend", attackBonus: 5, rolls: [{ label: "damage", dice: "d8+5" }] }),
        expect.objectContaining({ name: "Repair", uses: 3, rolls: [{ label: "roll", dice: "2d8+3" }] }),
      ]),
    );
  });

  it("surfaces bespoke action and reaction data", () => {
    const gameplay = getSteelDefenderGameplay({
      artificerLevel: 3,
      intelligenceModifier: 3,
      proficiencyBonus: 2,
      spellAttackModifier: 5,
    });

    expect(gameplay.forceEmpoweredRend.attackBonus).toBe(5);
    expect(gameplay.forceEmpoweredRend.damage).toBe("d8+5");
    expect(gameplay.forceEmpoweredRend.reference.sanitizedHtml).toContain("<strong>Force-Empowered Rend.</strong>");
    expect(gameplay.repair.uses).toBe(3);
    expect(gameplay.repair.healing).toBe("2d8+3");
    expect(gameplay.repair.reference.sanitizedHtml).toContain("<strong>Repair (3/Day).</strong>");
    expect(gameplay.deflectAttack.description).toContain("Trigger:");
    expect(gameplay.deflectAttack.description).toContain("Disadvantage");
    expect(gameplay.deflectAttack.reference.sanitizedHtml).toContain("<strong>Deflect Attack.</strong>");
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
