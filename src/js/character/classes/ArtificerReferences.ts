import type { GameplayStatBlock } from "@/js/character/GameplayStatBlockTypes";
import { DiceString } from "@/js/common/DiceString";
import type { Entry, Reference, ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";
import { getStatBlock } from "@/js/utils/render-5etools/getStatBlock";
import { referenceToGameplayStatBlock } from "@/js/utils/render-5etools/referenceToGameplayStatBlock";

export interface SteelDefenderOwnerStats {
  artificerLevel: number;
  intelligenceModifier: number;
  proficiencyBonus: number;
  spellAttackModifier: number;
}

/**
 * Get the EFA Steel Defender reference using its owner's relevant stats.
 */
export function getSteelDefenderGameplayStatBlock(ownerStats: SteelDefenderOwnerStats): GameplayStatBlock {
  const statBlock = referenceToGameplayStatBlock(getSteelDefender(ownerStats));
  const abilities = statBlock.abilities.map((ability) => ({
    ...ability,
    checkBonus: ability.checkBonus + ownerStats.proficiencyBonus,
    saveBonus: ability.saveBonus + ownerStats.proficiencyBonus,
  }));
  const dexterity = abilities.find(({ ability }) => ability === "Dex");

  return {
    ...statBlock,
    initiativeBonus: dexterity?.checkBonus ?? statBlock.initiativeBonus,
    abilities,
  };
}

export interface SteelDefenderRend {
  attackBonus: number;
  damage: string;
  reference: ReferenceRendered;
}

export interface SteelDefenderRepair {
  uses: number;
  healing: string;
  reference: ReferenceRendered;
}

export interface SteelDefenderDeflectAttack {
  description: string;
  reference: ReferenceRendered;
}

/** Steel Defender gameplay data: generic stat block plus bespoke action/reaction rows data. */
export interface SteelDefenderGameplay {
  statBlock: GameplayStatBlock;
  forceEmpoweredRend: SteelDefenderRend;
  repair: SteelDefenderRepair;
  deflectAttack: SteelDefenderDeflectAttack;
}

export function getSteelDefenderGameplay(ownerStats: SteelDefenderOwnerStats): SteelDefenderGameplay {
  const statBlock = getSteelDefenderGameplayStatBlock(ownerStats);

  const rend = statBlock.actions.find(({ name }) => name === "Force-Empowered Rend");
  const repair = statBlock.actions.find(({ name }) => name === "Repair");
  const deflectAttack = statBlock.reactions.find(({ name }) => name === "Deflect Attack");

  if (rend?.attackBonus === undefined || !rend.rolls?.[0] || !rend.reference) {
    throw new Error("Steel Defender requires a Force-Empowered Rend attack action");
  }
  if (repair?.uses === undefined || !repair.rolls?.[0] || !repair.reference) {
    throw new Error("Steel Defender requires a Repair action");
  }
  if (!deflectAttack || !deflectAttack.reference) {
    throw new Error("Steel Defender requires a Deflect Attack reaction");
  }

  return {
    statBlock,
    forceEmpoweredRend: { attackBonus: rend.attackBonus, damage: rend.rolls[0].dice, reference: rend.reference },
    repair: { uses: repair.uses, healing: repair.rolls[0].dice, reference: repair.reference },
    deflectAttack: { description: deflectAttack.description, reference: deflectAttack.reference },
  };
}

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
