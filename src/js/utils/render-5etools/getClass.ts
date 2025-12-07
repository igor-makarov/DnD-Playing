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

// Class-specific interface extending Reference
interface ClassReference extends Omit<Reference, "entries"> {
  page?: number;
  entries?: Entry[]; // Classes may not have entries in the data
  hd?: HitDice;
  proficiency?: string[]; // Saving throw proficiencies
  spellcastingAbility?: string;
  casterProgression?: string;
  subclassTitle?: string;
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

  if (classInfo.spellcastingAbility) {
    properties["Spellcasting Ability"] = ABILITY_NAMES[classInfo.spellcastingAbility] || classInfo.spellcastingAbility;
  }

  const classReference: Reference = {
    ...classInfo,
    entries: classInfo.entries || [], // Provide empty array if no entries
    properties,
  };

  return classReference;
}
