import { DiceString } from "@/js/common/DiceString";
import type { Entry, Reference } from "@/js/utils/render-5etools/ReferenceTypes";
import { getStatBlock } from "@/js/utils/render-5etools/getStatBlock";

export interface SteelDefenderOwnerStats {
  artificerLevel: number;
  intelligenceModifier: number;
  proficiencyBonus: number;
  spellAttackModifier: number;
}

/**
 * Get the EFA Steel Defender reference using its owner's relevant stats.
 */
export function getSteelDefender({
  artificerLevel,
  intelligenceModifier,
  proficiencyBonus,
  spellAttackModifier,
}: SteelDefenderOwnerStats): Reference {
  const signedProficiencyBonus = `${proficiencyBonus >= 0 ? "+" : ""}${proficiencyBonus}`;
  const rendDamage = new DiceString("d8", 2 + intelligenceModifier);
  const repairHealing = new DiceString("2d8", intelligenceModifier);

  const transformText = (text: string): string =>
    text
      .replace("Add your {@variantrule Proficiency|XPHB|Proficiency Bonus}", `Add {@b ${signedProficiencyBonus}}`)
      .replace(/{@hitYourSpellAttack [^}]+}/, `{@hit ${spellAttackModifier}}`)
      .replace("{@dice 1d8 + 2} plus your Intelligence modifier", `{@damage ${rendDamage}}`)
      .replace("{@dice 2d8} plus your Intelligence modifier", `{@dice ${repairHealing}}`);

  function parameterizeEntry(entry: Entry): Entry {
    if (typeof entry === "string") return transformText(entry);

    return {
      ...entry,
      entry: entry.entry ? transformText(entry.entry) : undefined,
      entries: entry.entries?.map(parameterizeEntry),
      items: entry.items?.map(parameterizeEntry),
      data: entry.data?.map(({ key, value }) => {
        if (key === "Armor Class") value = (12 + intelligenceModifier).toString();
        if (key === "Hit Points") value = `${5 + 5 * artificerLevel} (${artificerLevel}d8 Hit Dice)`;
        if (key === "Proficiency Bonus") value = signedProficiencyBonus;
        return { key, value: transformText(value) };
      }),
      rows: entry.rows?.map((row) => row.map(parameterizeEntry)),
    };
  }

  const reference = getStatBlock("Steel Defender", "EFA");
  return {
    ...reference,
    entries: reference.entries.map(parameterizeEntry),
  };
}
