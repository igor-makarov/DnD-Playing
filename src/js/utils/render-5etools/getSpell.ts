import spellsXPHB from "@5etools/data/spells/spells-xphb.json";

import type { Reference, ReferenceRendered } from "./ReferenceTypes";
import renderReference from "./renderReference";

// Map of source codes to spell data
const SPELL_DATA_BY_SOURCE: Record<string, any> = {
  XPHB: spellsXPHB,
};

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

  const spell = spellsData.spell.find((s: any) => s.name === name && s.source === source);

  if (!spell) {
    throw new Error(`Spell "${name}" from source "${source}" not found in 5etools data`);
  }

  const spellData = spell as Reference;

  return {
    name: spellData.name,
    source: spellData.source,
    html: renderReference(spellData),
  };
}
