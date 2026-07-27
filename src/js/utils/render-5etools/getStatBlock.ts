import type { Entry, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

interface StatBlockEntry {
  name: string;
  entries: Entry[];
}

interface ArmorClassEntry {
  ac?: number;
  special?: string;
  from?: string[];
}

interface HitPointsEntry {
  average?: number;
  formula?: string;
  special?: string;
}

interface InitiativeEntry {
  proficiency?: number;
  advantageMode?: string;
}

interface StatBlockData {
  name: string;
  source: string;
  size?: string[];
  type?: string;
  alignment?: string[];
  ac?: Array<number | ArmorClassEntry>;
  hp?: HitPointsEntry;
  speed?: Record<string, number | string | boolean>;
  initiative?: number | InitiativeEntry;
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
  save?: Record<string, string>;
  skill?: Record<string, string>;
  vulnerable?: string[];
  resist?: string[];
  immune?: string[];
  conditionImmune?: string[];
  senses?: string[];
  passive?: number | string;
  languages?: string[];
  cr?: string | { cr: string };
  pbNote?: string;
  trait?: StatBlockEntry[];
  action?: StatBlockEntry[];
  bonus?: StatBlockEntry[];
  reaction?: StatBlockEntry[];
}

type BestiaryData = Record<string, unknown>;

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"] as const;
const SIZE_NAMES: Record<string, string> = {
  T: "Tiny",
  S: "Small",
  M: "Medium",
  L: "Large",
  H: "Huge",
  G: "Gargantuan",
};
const ALIGNMENT_NAMES: Record<string, string> = {
  L: "Lawful",
  N: "Neutral",
  C: "Chaotic",
  G: "Good",
  E: "Evil",
  U: "Unaligned",
  A: "Any Alignment",
};

function signed(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function findStatBlockCollection(data: BestiaryData): StatBlockData[] {
  const statBlocks = Object.values(data).find(
    (value): value is StatBlockData[] =>
      Array.isArray(value) && value.every((entry) => typeof entry === "object" && entry !== null && "name" in entry && "source" in entry),
  );
  if (!statBlocks) throw new Error("Stat block collection not found in 5etools bestiary data");
  return statBlocks;
}

function formatArmorClass(statBlock: StatBlockData): string | undefined {
  return statBlock.ac
    ?.map((entry) => {
      if (typeof entry === "number") return entry.toString();
      if (entry.special) return entry.special;
      if (entry.ac === undefined) return "";
      return `${entry.ac}${entry.from?.length ? ` (${entry.from.join(", ")})` : ""}`;
    })
    .filter(Boolean)
    .join(", ");
}

function formatHitPoints(statBlock: StatBlockData): string | undefined {
  if (statBlock.hp?.special) return statBlock.hp.special;
  if (statBlock.hp?.average === undefined) return undefined;
  return `${statBlock.hp.average}${statBlock.hp.formula ? ` (${statBlock.hp.formula})` : ""}`;
}

function proficiencyBonusFromChallengeRating(cr: StatBlockData["cr"]): number | undefined {
  const value = typeof cr === "string" ? cr : cr?.cr;
  if (!value) return undefined;

  const [numerator, denominator = "1"] = value.split("/");
  const challengeRating = Number(numerator) / Number(denominator);
  if (!Number.isFinite(challengeRating)) return undefined;
  return challengeRating < 1 ? 2 : 2 + Math.floor((challengeRating - 1) / 4);
}

function formatInitiative(statBlock: StatBlockData): string | undefined {
  if (statBlock.dex === undefined) return undefined;

  let bonus = typeof statBlock.initiative === "number" ? statBlock.initiative : abilityModifier(statBlock.dex);
  if (typeof statBlock.initiative === "object" && statBlock.initiative.proficiency) {
    const proficiencyBonus = proficiencyBonusFromChallengeRating(statBlock.cr);
    if (proficiencyBonus !== undefined) bonus += proficiencyBonus * statBlock.initiative.proficiency;
  }

  return `${signed(bonus)} (${10 + bonus})`;
}

function formatSpeed(statBlock: StatBlockData): string | undefined {
  if (!statBlock.speed) return undefined;

  return Object.entries(statBlock.speed)
    .filter(([, value]) => value !== false)
    .map(([movement, value]) => `${movement === "walk" ? "" : `${titleCase(movement)} `}${value} ft.`)
    .join(", ");
}

function formatMap(values: Record<string, string> | undefined): string | undefined {
  if (!values) return undefined;
  return Object.entries(values)
    .map(([name, value]) => `${titleCase(name)} ${value}`)
    .join(", ");
}

function addProperty(data: Array<{ key: string; value: string }>, key: string, value: string | undefined): void {
  if (value) data.push({ key, value });
}

function sectionEntries(entries: StatBlockEntry[] | undefined): Entry[] {
  return (entries ?? []).map((entry) => ({
    type: "entries",
    name: entry.name,
    entries: entry.entries,
  }));
}

/**
 * Get a renderable stat block reference from 5etools bestiary data.
 */
export function getStatBlock(name: string, source: string): Reference {
  const data = loadData<BestiaryData>(`bestiary/bestiary-${source.toLowerCase()}.json`);
  const statBlock = findStatBlockCollection(data).find(
    (candidate) => candidate.name.toLowerCase() === name.toLowerCase() && candidate.source === source,
  );
  if (!statBlock) throw new Error(`Stat block "${name}" from source "${source}" not found in 5etools data`);

  const primaryProperties: Array<{ key: string; value: string }> = [];
  addProperty(primaryProperties, "Armor Class", formatArmorClass(statBlock));
  addProperty(primaryProperties, "Initiative", formatInitiative(statBlock));
  addProperty(primaryProperties, "Hit Points", formatHitPoints(statBlock));
  addProperty(primaryProperties, "Speed", formatSpeed(statBlock));

  const detailProperties: Array<{ key: string; value: string }> = [];
  addProperty(detailProperties, "Saving Throws", formatMap(statBlock.save));
  addProperty(detailProperties, "Skills", formatMap(statBlock.skill));
  addProperty(detailProperties, "Damage Vulnerabilities", statBlock.vulnerable?.map(titleCase).join(", "));
  addProperty(detailProperties, "Damage Resistances", statBlock.resist?.map(titleCase).join(", "));
  addProperty(detailProperties, "Damage Immunities", statBlock.immune?.map(titleCase).join(", "));
  addProperty(detailProperties, "Condition Immunities", statBlock.conditionImmune?.map(titleCase).join(", "));
  addProperty(
    detailProperties,
    "Senses",
    statBlock.senses
      ? `${statBlock.senses.join(", ")}${statBlock.passive !== undefined ? `, Passive Perception ${statBlock.passive}` : ""}`
      : undefined,
  );
  addProperty(detailProperties, "Languages", statBlock.languages?.join(", "));
  addProperty(detailProperties, "Challenge", typeof statBlock.cr === "string" ? statBlock.cr : statBlock.cr?.cr);
  addProperty(detailProperties, "Proficiency Bonus", statBlock.pbNote);

  const entries: Entry[] = [{ type: "properties", data: primaryProperties }];
  if (ABILITIES.every((ability) => statBlock[ability] !== undefined)) {
    entries.push({
      type: "table",
      colLabels: ABILITIES.map((ability) => ability.toUpperCase()),
      rows: [ABILITIES.map((ability) => `${statBlock[ability]} (${signed(abilityModifier(statBlock[ability] as number))})`)],
    });
  }
  if (detailProperties.length) entries.push({ type: "properties", data: detailProperties });
  if (statBlock.trait?.length) entries.push({ type: "heading", name: "Traits" }, ...sectionEntries(statBlock.trait));
  if (statBlock.action?.length) entries.push({ type: "heading", name: "Actions" }, ...sectionEntries(statBlock.action));
  if (statBlock.bonus?.length) entries.push({ type: "heading", name: "Bonus Actions" }, ...sectionEntries(statBlock.bonus));
  if (statBlock.reaction?.length) entries.push({ type: "heading", name: "Reactions" }, ...sectionEntries(statBlock.reaction));

  const size = statBlock.size?.map((value) => SIZE_NAMES[value] ?? value).join(" or ");
  const alignment = statBlock.alignment?.map((value) => ALIGNMENT_NAMES[value] ?? value).join(" ");
  const sizeAndType = [size, statBlock.type ? titleCase(statBlock.type) : undefined].filter(Boolean).join(" ");

  return {
    name: statBlock.name,
    source: statBlock.source,
    byline: [sizeAndType, alignment].filter(Boolean).join(", "),
    entries,
  };
}
