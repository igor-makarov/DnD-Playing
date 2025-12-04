import spellsXPHB from "@5etools/data/spells/spells-xphb.json";

import type { Entry, Reference, ReferenceRendered } from "./ReferenceTypes";
import renderReference from "./renderReference";

// 5etools spell time structure
interface SpellTime {
  number: number;
  unit: string;
}

// 5etools spell range structure
interface SpellRange {
  type: string;
  distance?: {
    type: string;
    amount?: number;
  };
}

// 5etools spell components structure
interface SpellComponents {
  v?: boolean;
  s?: boolean;
  m?:
    | string
    | boolean
    | {
        text: string;
        cost?: number;
        consume?: boolean;
      };
}

// 5etools spell duration structure
interface SpellDuration {
  type: string;
  duration?: {
    type: string;
    amount: number;
  };
  concentration?: boolean;
}

// Spell-specific interface extending Reference
interface SpellReference extends Reference {
  level: number; // 0 for cantrips, 1-9 for leveled spells
  school: string; // See SCHOOL_NAMES
  time: SpellTime[];
  range: SpellRange;
  components: SpellComponents;
  duration: SpellDuration[];
  entriesHigherLevel?: Entry[]; // Optional higher-level casting info
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

function formatCastingTime(time: SpellTime[]): string {
  if (time.length === 0) return "Unknown";
  const first = time[0];
  const unit = first.unit.charAt(0).toUpperCase() + first.unit.slice(1);
  return first.number === 1 ? unit : `${first.number} ${unit}s`;
}

function formatRange(range: SpellRange): string {
  if (!range.distance) return "Special";

  const { type: rangeType } = range;
  const { type: distanceType, amount } = range.distance;

  // Area effect spells (cone, emanation, sphere, cube, line) have range "Self"
  if (rangeType !== "point") return "Self";

  // Handle special distance types for point ranges
  if (distanceType === "self") return "Self";
  if (distanceType === "touch") return "Touch";
  if (distanceType === "sight") return "Sight";
  if (distanceType === "unlimited") return "Unlimited";

  // Handle numeric distances for point ranges
  if (amount !== undefined) {
    return `${amount} ${distanceType}`;
  }

  return "Special";
}

function formatComponents(components: SpellComponents): string {
  const parts: string[] = [];
  if (components.v) parts.push("V");
  if (components.s) parts.push("S");
  if (components.m) {
    if (typeof components.m === "string") {
      parts.push(`M (${components.m})`);
    } else if (typeof components.m === "object") {
      // No need to check the other props, because the text field already contains all information (cost, consume, etc.)
      parts.push(`M (${components.m.text})`);
    } else {
      parts.push("M");
    }
  }
  return parts.join(", ");
}

function formatDuration(duration: SpellDuration[]): string {
  if (duration.length === 0) return "Unknown";
  const first = duration[0];

  let result = "";
  if (first.type === "instant") {
    result = "Instantaneous";
  } else if (first.type === "timed" && first.duration) {
    const amount = first.duration.amount;
    const type = first.duration.type;
    result = amount === 1 ? `1 ${type}` : `${amount} ${type}s`;
  } else if (first.type === "permanent") {
    result = "Permanent";
  } else {
    result = first.type;
  }

  if (first.concentration) {
    result = `Concentration, up to ${result}`;
  }

  return result;
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

  const properties: Record<string, string> = {
    "Casting Time": formatCastingTime(spell.time),
    Range: formatRange(spell.range),
    Components: formatComponents(spell.components),
    Duration: formatDuration(spell.duration),
  };

  const spellData: SpellReference = {
    ...spell,
    entries: [...spell.entries, ...(spell.entriesHigherLevel || [])],
    byline,
    properties,
  };

  return renderReference(spellData);
}
