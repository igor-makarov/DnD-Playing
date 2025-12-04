import spellsXPHB from "@5etools/data/spells/spells-xphb.json";

import type { Reference, ReferenceRendered } from "./ReferenceTypes";
import renderReference from "./renderReference";

// Spell-specific interface extending Reference
interface SpellReference extends Reference {
  level: number; // 0 for cantrips, 1-9 for leveled spells
  school: string; // See SCHOOL_NAMES
}

// Structure of spell data from 5etools JSON files
interface SpellData {
  spell: Array<SpellReference>;
}

// Map of source codes to spell data
const SPELL_DATA_BY_SOURCE: Record<string, SpellData> = {
  XPHB: spellsXPHB,
};

// Map of school codes to full names
const SCHOOL_NAMES: Record<string, string> = {
  A: "Abjuration",
  C: "Conjuration",
  D: "Divination",
  E: "Enchantment",
  I: "Illusion",
  N: "Necromancy",
  T: "Transmutation",
  V: "Evocation",
};

function getSchoolNameAndLevelByline(schoolCode: string, level: number): string {
  const schoolName = SCHOOL_NAMES[schoolCode] || schoolCode;
  const schoolNameAndLevel = level === 0 ? `${schoolName} Cantrip` : `Level ${level} ${schoolName}`;
  return schoolNameAndLevel;
}

/**
 * Get a spell from the 5etools data by name and source, with rendered HTML.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The spell name (e.g., "Fireball")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The spell data with rendered HTML
 * @throws Error if spell is not found
 */
export function getSpell(name: string, source: string = "XPHB"): ReferenceRendered {
  const spellsData = SPELL_DATA_BY_SOURCE[source];

  if (!spellsData) {
    throw new Error(`Spell source "${source}" not supported. Available sources: ${Object.keys(SPELL_DATA_BY_SOURCE).join(", ")}`);
  }

  const spell = spellsData.spell.find((s) => s.name === name && s.source === source);

  if (!spell) {
    throw new Error(`Spell "${name}" from source "${source}" not found in 5etools data`);
  }

  const byline = getSchoolNameAndLevelByline(spell.school, spell.level);

  const spellData: SpellReference = {
    ...spell,
    byline,
  };

  return renderReference(spellData);
}
