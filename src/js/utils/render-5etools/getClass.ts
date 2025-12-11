import { classRoute } from "../collectClasses";
import type { Entry, PropertyItem, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Hit dice structure
interface HitDice {
  number: number;
  faces: number;
}

// Starting proficiencies structure
interface StartingProficiencies {
  armor?: Array<string | { proficiency: string; full: string }>;
  weapons?: string[];
  tools?: string[];
  skills?: Array<{
    choose?: {
      from: string[];
      count: number;
    };
    any?: number;
  }>;
}

// Multiclassing structure
interface Multiclassing {
  requirements?: Record<string, number> | { or: Record<string, number>[] };
  proficienciesGained?: {
    armor?: Array<string | { proficiency: string; full: string }>;
    weapons?: string[];
    tools?: string[];
    skills?: Array<{
      choose?: {
        from: string[];
        count: number;
      };
      any?: number;
    }>;
  };
}

// Class-specific interface extending Reference
interface ClassReference extends Omit<Reference, "entries"> {
  page?: number;
  entries?: Entry[]; // Classes may not have entries in the data
  hd?: HitDice;
  proficiency?: string[]; // Saving throw proficiencies
  spellcastingAbility?: string;
  casterProgression?: string;
  subclassTitle?: string;
  startingProficiencies?: StartingProficiencies;
  multiclassing?: Multiclassing;
  cantripProgression?: number[];
  preparedSpells?: string | null;
}

// Class feature entry in the classFeature array
interface ClassFeatureEntry {
  name: string;
  source: string;
  className: string;
  classSource: string;
  level: number;
  entries?: Entry[];
}

// Structure of class data from 5etools JSON files
interface ClassData {
  class: Array<ClassReference>;
  classFeature: Array<ClassFeatureEntry>;
}

// Ability abbreviation to full name
const ABILITY_NAMES: Record<string, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

function formatProficiencies(proficiencies?: string[]): string {
  if (!proficiencies || proficiencies.length === 0) return "None";
  return proficiencies.map((p) => ABILITY_NAMES[p] || p).join(", ");
}

function formatArmorProficiencies(armor?: Array<string | { proficiency: string; full: string }>): string {
  if (!armor || armor.length === 0) return "None";
  return armor
    .map((a) => {
      if (typeof a === "string") {
        return a.charAt(0).toUpperCase() + a.slice(1);
      } else {
        return a.proficiency.charAt(0).toUpperCase() + a.proficiency.slice(1);
      }
    })
    .join(", ");
}

function formatWeaponProficiencies(weapons?: string[]): string {
  if (!weapons || weapons.length === 0) return "None";
  return weapons
    .map((w) => {
      // Remove 5etools markup like {@filter ...} and {@item ...}
      // Extract just the display text (first part before pipe)
      const cleaned = w.replace(/\{@\w+\s+([^}|]+)(?:\|[^}]*)?\}/g, "$1");
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    })
    .join(", ");
}

function formatSkillProficiencies(skills?: Array<{ choose?: { from: string[]; count: number }; any?: number }>): string {
  if (!skills || skills.length === 0) return "None";

  const parts: string[] = [];
  for (const skill of skills) {
    if (skill.choose) {
      const skillList = skill.choose.from
        .map((s) =>
          s
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        )
        .join(", ");
      parts.push(`Choose ${skill.choose.count} from: ${skillList}`);
    } else if (skill.any) {
      parts.push(`Choose any ${skill.any} skills`);
    }
  }

  return parts.length > 0 ? parts.join("; ") : "None";
}

function formatMulticlassingRequirements(requirements?: Record<string, number> | { or: Record<string, number>[] }): string {
  if (!requirements) return "";

  // Handle "or" structure (e.g., Fighter requires STR 13 OR DEX 13)
  if ("or" in requirements && Array.isArray(requirements.or)) {
    const orParts = requirements.or.map((req: Record<string, number>) =>
      Object.entries(req)
        .map(([ability, score]) => `${ABILITY_NAMES[ability] || ability} ${score}`)
        .join(" and "),
    );
    return orParts.join(" or ");
  }

  // Handle simple structure
  if (Object.keys(requirements).length === 0) return "";
  return Object.entries(requirements)
    .map(([ability, score]) => `${ABILITY_NAMES[ability] || ability} ${score}`)
    .join(" and ");
}

function formatCantripProgression(progression?: number[]): string {
  if (!progression || progression.length === 0) return "";

  // Show key levels: 1, 4, 10
  const level1 = progression[0];
  const level4 = progression[3];
  const level10 = progression[9];

  return `${level1} at 1st level, ${level4} at 4th level, ${level10} at 10th level`;
}

function formatCasterProgression(progression: string): string {
  switch (progression) {
    case "full":
      return "Full Caster";
    case "1/2":
    case "artificer":
      return "Half Caster";
    case "1/3":
      return "Third Caster";
    case "pact":
      return "Pact Magic";
    default:
      return progression;
  }
}

function createMulticlassingEntries(multiclassing?: Multiclassing): Entry[] {
  if (!multiclassing) return [];

  const entries: Entry[] = [];

  // 1. Heading
  entries.push({ type: "heading", name: "Multiclassing" });

  // 2. Prerequisites text
  const requirements = formatMulticlassingRequirements(multiclassing.requirements);
  if (requirements) {
    entries.push(`To qualify for multiclassing into or out of this class, you must have a score of at least ${requirements}.`);
  } else {
    entries.push(
      "To qualify for a new class, you must have a score of at least 13 in the primary ability of the new class and your current classes.",
    );
  }

  // 3. Proficiencies gained as properties
  const propsData: PropertyItem[] = [];

  if (multiclassing.proficienciesGained) {
    if (multiclassing.proficienciesGained.skills && multiclassing.proficienciesGained.skills.length > 0) {
      const skills = formatSkillProficiencies(multiclassing.proficienciesGained.skills);
      propsData.push({ key: "Skill Proficiencies", value: skills });
    }

    if (multiclassing.proficienciesGained.tools && multiclassing.proficienciesGained.tools.length > 0) {
      const tools = formatWeaponProficiencies(multiclassing.proficienciesGained.tools);
      propsData.push({ key: "Tool Proficiencies", value: tools });
    }

    if (multiclassing.proficienciesGained.armor && multiclassing.proficienciesGained.armor.length > 0) {
      const armor = formatArmorProficiencies(multiclassing.proficienciesGained.armor);
      propsData.push({ key: "Armor Training", value: armor });
    }

    if (multiclassing.proficienciesGained.weapons && multiclassing.proficienciesGained.weapons.length > 0) {
      const weapons = formatWeaponProficiencies(multiclassing.proficienciesGained.weapons);
      propsData.push({ key: "Weapon Training", value: weapons });
    }
  }

  if (propsData.length > 0) {
    entries.push({ type: "properties", data: propsData });
  }

  return entries;
}

/**
 * Get a class from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The class name (e.g., "Fighter", "Wizard")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The class reference data
 * @throws Error if class is not found
 */
export interface ClassFeatureSummary {
  name: string;
  level: number;
}

/**
 * Get list of class features with their levels.
 *
 * @param name - The class name (e.g., "Fighter", "Wizard")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns Array of feature names and levels, sorted by level
 * @throws Error if class is not found
 */
export function getClassFeatures(name: string, source: string = "XPHB"): ClassFeatureSummary[] {
  const classData = loadData<ClassData>(`class/class-${name.toLowerCase()}.json`);

  const features = classData.classFeature.filter((f) => f.className === name && f.classSource === source);

  if (features.length === 0) {
    throw new Error(`No features found for class "${name}" from source "${source}"`);
  }

  return features.map((f) => ({ name: f.name, level: f.level })).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

export interface ClassFeatureFull {
  name: string;
  level: number;
  entries: Entry[];
}

/**
 * Get full class features with entries.
 */
export function getClassFeaturesFull(name: string, source: string = "XPHB"): ClassFeatureFull[] {
  const classData = loadData<ClassData>(`class/class-${name.toLowerCase()}.json`);

  const features = classData.classFeature.filter((f) => f.className === name && f.classSource === source);

  if (features.length === 0) {
    throw new Error(`No features found for class "${name}" from source "${source}"`);
  }

  return features
    .map((f) => ({ name: f.name, level: f.level, entries: f.entries || [] }))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
}

export function getClass(name: string, source: string = "XPHB"): Reference {
  const classData = loadData<ClassData>(`class/class-${name.toLowerCase()}.json`);

  const classInfo = classData.class.find((c) => c.name === name && c.source === source);

  if (!classInfo) {
    throw new Error(`Class "${name}" from source "${source}" not found in 5etools data`);
  }

  // Build ordered properties
  const propsData: PropertyItem[] = [];

  if (classInfo.hd) {
    propsData.push({ key: "Hit Die", value: `1d${classInfo.hd.faces}` });
  }

  if (classInfo.proficiency) {
    propsData.push({ key: "Saving Throws", value: formatProficiencies(classInfo.proficiency) });
  }

  // Starting proficiencies
  if (classInfo.startingProficiencies) {
    if (classInfo.startingProficiencies.armor) {
      propsData.push({ key: "Armor", value: formatArmorProficiencies(classInfo.startingProficiencies.armor) });
    }
    if (classInfo.startingProficiencies.weapons) {
      propsData.push({ key: "Weapons", value: formatWeaponProficiencies(classInfo.startingProficiencies.weapons) });
    }
    if (classInfo.startingProficiencies.skills) {
      propsData.push({ key: "Skills", value: formatSkillProficiencies(classInfo.startingProficiencies.skills) });
    }
  }

  // Spellcasting information
  if (classInfo.spellcastingAbility) {
    propsData.push({
      key: "Spellcasting Ability",
      value: ABILITY_NAMES[classInfo.spellcastingAbility] || classInfo.spellcastingAbility,
    });
  }

  if (classInfo.casterProgression) {
    propsData.push({ key: "Caster Progression", value: formatCasterProgression(classInfo.casterProgression) });
  }

  if (classInfo.cantripProgression) {
    propsData.push({ key: "Cantrips Known", value: formatCantripProgression(classInfo.cantripProgression) });
  }

  // Build entries array
  const entries: Entry[] = [];

  // Add Core Traits heading and properties
  entries.push({ type: "heading", name: "Core Traits" });
  if (propsData.length > 0) {
    entries.push({ type: "properties", data: propsData });
  }

  // Add any existing entries from the class data
  if (classInfo.entries) {
    entries.push(...classInfo.entries);
  }

  // Add multiclassing entries last
  entries.push(...createMulticlassingEntries(classInfo.multiclassing));

  const classReference: Reference = {
    name: classInfo.name,
    source: classInfo.source,
    entries,
    fullLink: classRoute({ name, source }),
  };

  return classReference;
}
