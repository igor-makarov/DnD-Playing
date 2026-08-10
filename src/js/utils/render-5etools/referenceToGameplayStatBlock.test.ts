import { describe, expect, it } from "vitest";

import { getStatBlock } from "./getStatBlock";
import { getRemainingStatBlockReference, referenceToGameplayStatBlock } from "./referenceToGameplayStatBlock";
import renderHTML from "./renderHTML";

describe("referenceToGameplayStatBlock", () => {
  it("extracts structured gameplay values from a stat-block reference", () => {
    const statBlock = referenceToGameplayStatBlock(getStatBlock("Wolf", "XMM"));

    expect(statBlock).toMatchObject({
      id: "wolf",
      name: "Wolf",
      armorClass: 12,
      hitPointMaximum: 11,
      hitDice: [{ die: "d8", count: 2 }],
      initiativeBonus: 2,
    });
    expect(statBlock.abilities.find(({ ability }) => ability === "Dex")).toMatchObject({
      score: 15,
      checkBonus: 2,
      saveBonus: 2,
    });
    expect(statBlock.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Bite",
          attackBonus: 4,
          rolls: [{ label: "damage", dice: "d6+2" }],
        }),
      ]),
    );

    const bite = statBlock.actions.find(({ name }) => name === "Bite");
    expect(bite?.reference?.sanitizedHtml).toContain("<strong>Bite.</strong>");
    expect(bite?.reference?.sanitizedHtml).toContain("<em>Melee Attack Roll:</em>");
  });

  it("keeps reference details not represented by gameplay components", () => {
    const reference = getRemainingStatBlockReference(getStatBlock("Wolf", "XMM"));
    const rendered = renderHTML(reference).sanitizedHtml;

    expect(rendered).toContain("<strong>Speed:</strong> 40 ft.");
    expect(rendered).toContain("<strong>Skills:</strong>");
    expect(rendered).toContain("<strong>Pack Tactics.</strong>");
    expect(rendered).not.toContain("<strong>Armor Class:</strong>");
    expect(rendered).not.toContain("<strong>Bite.</strong>");
  });
});
