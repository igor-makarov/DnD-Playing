import barbarianJson from "@5etools/data/class/class-barbarian.json";
import bardJson from "@5etools/data/class/class-bard.json";
import clericJson from "@5etools/data/class/class-cleric.json";
import druidJson from "@5etools/data/class/class-druid.json";
import fighterJson from "@5etools/data/class/class-fighter.json";
import monkJson from "@5etools/data/class/class-monk.json";
import paladinJson from "@5etools/data/class/class-paladin.json";
import rangerJson from "@5etools/data/class/class-ranger.json";
import rogueJson from "@5etools/data/class/class-rogue.json";
import sorcererJson from "@5etools/data/class/class-sorcerer.json";
import warlockJson from "@5etools/data/class/class-warlock.json";
import wizardJson from "@5etools/data/class/class-wizard.json";

import type { Entry, Reference } from "./ReferenceTypes";

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

// Structure of class data from 5etools JSON files
interface ClassData {
  class: Array<ClassReference>;
  classFeature: Array<unknown>; // Not used here
}

// Map of class names to class data
const CLASS_DATA_BY_NAME: Record<string, ClassData> = {
  Barbarian: barbarianJson,
  Bard: bardJson,
  Cleric: clericJson,
  Druid: druidJson,
  Fighter: fighterJson,
  Monk: monkJson,
  Paladin: paladinJson,
  Ranger: rangerJson,
  Rogue: rogueJson,
  Sorcerer: sorcererJson,
  Warlock: warlockJson,
  Wizard: wizardJson,
};

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
  if (!requirements) return "None";

  // Handle "or" structure (e.g., Barbarian requires STR 13+ OR DEX 13+)
  if ("or" in requirements && Array.isArray(requirements.or)) {
    const orParts = requirements.or.map((req: Record<string, number>) =>
      Object.entries(req)
        .map(([ability, score]) => `${ABILITY_NAMES[ability] || ability} ${score}+`)
        .join(" and "),
    );
    return orParts.join(" or ");
  }

  // Handle simple structure
  if (Object.keys(requirements).length === 0) return "None";
  return Object.entries(requirements)
    .map(([ability, score]) => `${ABILITY_NAMES[ability] || ability} ${score}+`)
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

function formatProficienciesGained(proficienciesGained?: {
  armor?: Array<string | { proficiency: string; full: string }>;
  weapons?: string[];
  tools?: string[];
}): string {
  if (!proficienciesGained) return "";

  const parts: string[] = [];

  if (proficienciesGained.armor && proficienciesGained.armor.length > 0) {
    const armor = proficienciesGained.armor
      .map((a) => {
        if (typeof a === "string") {
          return a.charAt(0).toUpperCase() + a.slice(1);
        } else {
          return a.proficiency.charAt(0).toUpperCase() + a.proficiency.slice(1);
        }
      })
      .join(", ");
    parts.push(`Armor: ${armor}`);
  }

  if (proficienciesGained.weapons && proficienciesGained.weapons.length > 0) {
    const weapons = proficienciesGained.weapons.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(", ");
    parts.push(`Weapons: ${weapons}`);
  }

  if (proficienciesGained.tools && proficienciesGained.tools.length > 0) {
    const tools = proficienciesGained.tools.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ");
    parts.push(`Tools: ${tools}`);
  }

  return parts.join("; ");
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
export function getClass(name: string, source: string = "XPHB"): Reference {
  const classData = CLASS_DATA_BY_NAME[name];

  if (!classData) {
    throw new Error(`Class "${name}" not supported. Available classes: ${Object.keys(CLASS_DATA_BY_NAME).join(", ")}`);
  }

  const classInfo = classData.class.find((c) => c.name === name && c.source === source);

  if (!classInfo) {
    throw new Error(`Class "${name}" from source "${source}" not found in 5etools data`);
  }

  const properties: Record<string, string> = {};

  if (classInfo.hd) {
    properties["Hit Die"] = `1d${classInfo.hd.faces}`;
  }

  if (classInfo.proficiency) {
    properties["Saving Throws"] = formatProficiencies(classInfo.proficiency);
  }

  // Starting proficiencies
  if (classInfo.startingProficiencies) {
    if (classInfo.startingProficiencies.armor) {
      properties["Armor"] = formatArmorProficiencies(classInfo.startingProficiencies.armor);
    }
    if (classInfo.startingProficiencies.weapons) {
      properties["Weapons"] = formatWeaponProficiencies(classInfo.startingProficiencies.weapons);
    }
    if (classInfo.startingProficiencies.skills) {
      properties["Skills"] = formatSkillProficiencies(classInfo.startingProficiencies.skills);
    }
  }

  // Spellcasting information
  if (classInfo.spellcastingAbility) {
    properties["Spellcasting Ability"] = ABILITY_NAMES[classInfo.spellcastingAbility] || classInfo.spellcastingAbility;
  }

  if (classInfo.casterProgression) {
    const progressionType =
      classInfo.casterProgression === "full"
        ? "Full Caster"
        : classInfo.casterProgression === "1/2" || classInfo.casterProgression === "artificer"
          ? "Half Caster"
          : classInfo.casterProgression === "1/3"
            ? "Third Caster"
            : classInfo.casterProgression;
    properties["Caster Progression"] = progressionType;
  }

  if (classInfo.cantripProgression) {
    properties["Cantrips Known"] = formatCantripProgression(classInfo.cantripProgression);
  }

  // Multiclassing information
  if (classInfo.multiclassing?.requirements) {
    properties["Multiclassing Requirement"] = formatMulticlassingRequirements(classInfo.multiclassing.requirements);
  }

  if (classInfo.multiclassing?.proficienciesGained) {
    const profGained = formatProficienciesGained(classInfo.multiclassing.proficienciesGained);
    if (profGained) {
      properties["Multiclass Proficiencies"] = profGained;
    }
  }

  const classReference: Reference = {
    ...classInfo,
    entries: classInfo.entries || [], // Provide empty array if no entries
    properties,
  };

  return classReference;
}
