import type { Entry, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// 5etools character creation option prerequisite structure
interface CharOptionPrerequisite {
  race?: Array<{ name: string; source?: string }>;
  note?: string;
}

// Character creation option interface extending Reference
interface CharOptionReference extends Reference {
  optionType: string[]; // e.g., ["SG"] for Supernatural Gift
  prerequisite?: CharOptionPrerequisite[];
}

// Structure of character creation option data from 5etools JSON file
interface CharOptionData {
  charoption: Array<CharOptionReference>;
}

// Map of option type codes to readable names
const OPTION_TYPE_NAMES: Record<string, string> = {
  SG: "Supernatural Gift",
  CS: "Character Secret",
  DG: "Dark Gift",
  "RF:B": "Ravenloft Background",
};

function getOptionTypeName(optionTypes: string[]): string {
  for (const type of optionTypes) {
    if (OPTION_TYPE_NAMES[type]) {
      return OPTION_TYPE_NAMES[type];
    }
  }
  return optionTypes.join(", ");
}

function formatPrerequisites(prerequisites?: CharOptionPrerequisite[]): string | null {
  if (!prerequisites || prerequisites.length === 0) return null;

  const parts: string[] = [];

  for (const prereq of prerequisites) {
    if (prereq.race && prereq.race.length > 0) {
      const raceNames = prereq.race.map((r) => r.name).join(" or ");
      parts.push(raceNames);
    }
    if (prereq.note) {
      parts.push(prereq.note);
    }
  }

  return parts.length > 0 ? parts.join("; ") : null;
}

/**
 * Get a character creation option (supernatural gift, dark gift, etc.) from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The option name (e.g., "Hollow One")
 * @param source - The source book (e.g., "EGW" for Explorer's Guide to Wildemount)
 * @returns The character creation option reference data
 * @throws Error if option is not found
 */
export function getCharacterCreationOption(name: string, source?: string): Reference {
  const data = loadData<CharOptionData>("charcreationoptions.json");

  const option = data.charoption.find((o) => o.name.toLowerCase() === name.toLowerCase() && (source === undefined || o.source === source));

  if (!option) {
    const sourceMsg = source ? ` from source "${source}"` : "";
    throw new Error(`Character creation option "${name}"${sourceMsg} not found in 5etools data`);
  }

  const byline = getOptionTypeName(option.optionType);
  const prereqText = formatPrerequisites(option.prerequisite);

  // Build entries array
  const entries: Entry[] = [];

  // Add prerequisite as a property if present
  if (prereqText) {
    entries.push({
      type: "properties",
      data: [{ key: "Prerequisite", value: prereqText }],
    });
  }

  entries.push(...option.entries);

  return {
    name: option.name,
    source: option.source,
    byline,
    entries,
  };
}
