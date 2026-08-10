import type { Ability } from "@/js/character/CharacterTypes";
import type { GameplayAbility, GameplayAction, GameplayStatBlock } from "@/js/character/GameplayStatBlockTypes";
import { DiceString } from "@/js/common/DiceString";

import type { Entry, Reference } from "./ReferenceTypes";
import renderHTML from "./renderHTML";

const ABILITIES: Ability[] = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
const INTERACTIVE_PROPERTY_KEYS = new Set(["Armor Class", "Initiative", "Hit Points", "Proficiency Bonus"]);
const INTERACTIVE_SECTIONS = new Set(["Actions", "Reactions"]);

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function entryText(entry: Entry): string {
  if (typeof entry === "string") return entry;
  return [entry.entry, ...(entry.entries ?? []).map(entryText), ...(entry.items ?? []).map(entryText)].filter(Boolean).join(" ");
}

function plainText(text: string): string {
  return text
    .replace(/{@atkr m}/g, "Melee Attack Roll:")
    .replace(/{@atkr r}/g, "Ranged Attack Roll:")
    .replace(/{@h}/g, "Hit: ")
    .replace(/{@actTrigger}/g, "Trigger:")
    .replace(/{@actResponse}/g, "Response:")
    .replace(/{@hit ([+-]?\d+)}/g, (_match, bonus: string) => `${Number(bonus) >= 0 ? "+" : ""}${bonus}`)
    .replace(/{@(?:damage|dice|b) ([^}]+)}/g, "$1")
    .replace(/{@\w+ ([^}|]+)(?:\|[^}]*)?}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function parseNumber(value: string | undefined): number | undefined {
  const match = value?.match(/[+-]?\d+/);
  return match ? Number(match[0]) : undefined;
}

function requireNumber(properties: Map<string, string>, key: string): number {
  const value = parseNumber(properties.get(key));
  if (value === undefined) throw new Error(`Gameplay stat block requires a numeric ${key}`);
  return value;
}

function getHitDice(hitPoints: string | undefined): Array<{ die: string; count: number }> {
  return [...(hitPoints?.matchAll(/(\d*)d(\d+)/gi) ?? [])].map((match) => ({
    die: `d${match[2]}`,
    count: match[1] ? Number(match[1]) : 1,
  }));
}

function getProperties(reference: Reference): Map<string, string> {
  return new Map(
    reference.entries.flatMap((entry) =>
      typeof entry !== "string" && entry.type === "properties" ? (entry.data ?? []).map(({ key, value }) => [key, value]) : [],
    ),
  );
}

function getAbilities(reference: Reference, properties: Map<string, string>): GameplayAbility[] {
  const table = reference.entries.find((entry) => typeof entry !== "string" && entry.type === "table" && entry.colLabels && entry.rows?.[0]);
  if (!table || typeof table === "string") throw new Error("Gameplay stat block requires an ability-score table");

  const savingThrows = properties.get("Saving Throws") ?? "";
  return ABILITIES.map((ability) => {
    const column = table.colLabels!.findIndex((label) => label.toLowerCase() === ability.toLowerCase());
    const cell = table.rows?.[0]?.[column];
    if (column < 0 || typeof cell !== "string") throw new Error(`Gameplay stat block requires a ${ability} score`);

    const scoreAndModifier = cell.match(/(\d+)\s*\(([+-]?\d+)\)/);
    if (!scoreAndModifier) throw new Error(`Could not parse ${ability} score from "${cell}"`);

    const score = Number(scoreAndModifier[1]);
    const modifier = Number(scoreAndModifier[2]);
    const explicitSave = savingThrows.match(new RegExp(`(?:^|,\\s*)${ability}\\s+([+-]?\\d+)`, "i"));

    return {
      ability,
      score,
      checkBonus: modifier,
      saveBonus: explicitSave ? Number(explicitSave[1]) : modifier,
    };
  });
}

function parseAction(entry: Exclude<Entry, string>, source: string): GameplayAction {
  const rawText = entryText(entry);
  const attack = rawText.match(/{@hit ([+-]?\d+)}/);
  const uses = entry.name?.match(/\((\d+)\/Day\)/i);
  const rolls = [...rawText.matchAll(/{@(damage|dice) ([^}]+)}/g)].map((match) => ({
    label: match[1] === "damage" ? "damage" : "roll",
    dice: new DiceString(match[2]).toString(),
  }));

  return {
    name: (entry.name ?? "Unnamed").replace(/\s*\(\d+\/Day\)$/i, ""),
    description: plainText(rawText),
    attackBonus: attack ? Number(attack[1]) : undefined,
    rolls: rolls.length ? rolls : undefined,
    uses: uses ? Number(uses[1]) : undefined,
    reference: renderHTML({ name: entry.name ?? "Unnamed", source, entries: [entry] }),
  };
}

function getSections(reference: Reference): Map<string, GameplayAction[]> {
  const sections = new Map<string, GameplayAction[]>();
  let section = "Traits";

  for (const entry of reference.entries) {
    if (typeof entry !== "string" && entry.type === "heading") {
      section = entry.name ?? section;
    } else if (typeof entry !== "string" && entry.type === "entries" && entry.name) {
      const entries = sections.get(section) ?? [];
      entries.push(parseAction(entry, reference.source));
      sections.set(section, entries);
    }
  }

  return sections;
}

/** Keep the reference entries not represented by the interactive gameplay components. */
export function getRemainingStatBlockReference(reference: Reference): Reference {
  let interactiveSection = false;
  const entries = reference.entries.flatMap((entry): Entry[] => {
    if (typeof entry === "string") return interactiveSection ? [] : [entry];

    if (entry.type === "heading") {
      interactiveSection = INTERACTIVE_SECTIONS.has(entry.name ?? "");
      return interactiveSection ? [] : [entry];
    }
    if (interactiveSection) return [];

    if (entry.type === "table" && entry.colLabels?.every((label) => ABILITIES.some((ability) => ability.toLowerCase() === label.toLowerCase()))) {
      return [];
    }
    if (entry.type === "properties") {
      const data = entry.data?.filter(({ key }) => !INTERACTIVE_PROPERTY_KEYS.has(key));
      return data?.length ? [{ ...entry, data }] : [];
    }

    return [entry];
  });

  return { ...reference, entries };
}

/** Convert structured reference fields to a gameplay model without interpreting feature prose. */
export function referenceToGameplayStatBlock(reference: Reference): GameplayStatBlock {
  const properties = getProperties(reference);
  const sections = getSections(reference);

  return {
    id: slug(reference.name),
    name: reference.name,
    proficiencyBonus: parseNumber(properties.get("Proficiency Bonus")),
    armorClass: requireNumber(properties, "Armor Class"),
    hitPointMaximum: requireNumber(properties, "Hit Points"),
    hitDice: getHitDice(properties.get("Hit Points")),
    initiativeBonus: requireNumber(properties, "Initiative"),
    abilities: getAbilities(reference, properties),
    traits: sections.get("Traits") ?? [],
    actions: sections.get("Actions") ?? [],
    reactions: sections.get("Reactions") ?? [],
  };
}
