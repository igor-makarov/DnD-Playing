import type { Entry, PropertyItem, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Species-specific interface extending Reference
interface SpeciesReference extends Reference {
  size?: string[];
  speed?: number | { walk?: number; fly?: number; swim?: number };
  creatureTypes?: string[];
  sizeEntry?: {
    type: string;
    name?: string;
    entries?: string[];
  };
}

// Structure of subspecies data from 5etools JSON files
interface SubspeciesReference extends Reference {
  raceName: string;
  raceSource: string;
}

// Structure of species data from 5etools JSON files
interface SpeciesData {
  race: Array<SpeciesReference>;
  subrace: Array<SubspeciesReference>;
}

// Map of size codes to full names
const SIZE_NAMES: Record<string, string> = {
  T: "Tiny",
  S: "Small",
  M: "Medium",
  L: "Large",
  H: "Huge",
  G: "Gargantuan",
};

function formatCreatureType(creatureTypes?: string[]): string {
  if (!creatureTypes || creatureTypes.length === 0) return "Humanoid";
  // Capitalize first letter
  return creatureTypes[0].charAt(0).toUpperCase() + creatureTypes[0].slice(1);
}

function formatSize(species: SpeciesReference): string {
  // If there's a sizeEntry with detailed description, use that
  if (species.sizeEntry?.entries?.[0]) {
    return species.sizeEntry.entries[0];
  }

  // Otherwise, format from size array
  if (!species.size || species.size.length === 0) return "Medium";

  const sizeNames = species.size.map((s) => SIZE_NAMES[s] || s);

  if (sizeNames.length === 1) {
    return sizeNames[0];
  }

  return sizeNames.join(" or ");
}

function formatSpeed(speed?: number | { walk?: number; fly?: number; swim?: number }): string {
  if (typeof speed === "number") {
    return `${speed} feet`;
  }

  if (!speed) return "30 feet";

  const parts: string[] = [];
  if (speed.walk) parts.push(`${speed.walk} feet`);
  if (speed.fly) parts.push(`fly ${speed.fly} feet`);
  if (speed.swim) parts.push(`swim ${speed.swim} feet`);

  return parts.join(", ") || "30 feet";
}

/**
 * Get a species from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The species name (e.g., "Human", "Elf")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The species reference data
 * @throws Error if species is not found
 */
export function getSpecies(name: string, source: string = "XPHB"): Reference {
  const speciesData = loadData<SpeciesData>("races.json");
  const species = speciesData.race.find((s) => s.name.toLowerCase() === name.toLowerCase() && s.source === source);

  if (!species) {
    throw new Error(`Species "${name}" from source "${source}" not found in 5etools data`);
  }

  // Build ordered properties
  const propsData: PropertyItem[] = [
    { key: "Creature Type", value: formatCreatureType(species.creatureTypes) },
    { key: "Size", value: formatSize(species) },
    { key: "Speed", value: formatSpeed(species.speed) },
  ];

  // Build entries array
  const entries: Entry[] = [{ type: "properties", data: propsData }, ...species.entries];

  return {
    name: species.name,
    source: species.source,
    entries,
  };
}

/**
 * Get a subspecies from the 5etools data by name, species name, and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The subspecies name (e.g., "Hill", "Mountain")
 * @param speciesName - The parent species name (e.g., "Dwarf", "Elf")
 * @param source - The source book (default: "PHB")
 * @returns The subspecies reference data
 * @throws Error if subspecies is not found
 */
export function getSubspecies(name: string, speciesName: string, source: string = "PHB"): Reference {
  const speciesData = loadData<SpeciesData>("races.json");
  const subspecies = speciesData.subrace.find(
    (s) => s.name?.toLowerCase() === name.toLowerCase() && s.raceName?.toLowerCase() === speciesName.toLowerCase() && s.raceSource === source,
  );

  if (!subspecies) {
    throw new Error(`Subspecies "${name}" of "${speciesName}" from source "${source}" not found in 5etools data`);
  }

  return {
    name: `${subspecies.raceName} (${subspecies.name})`,
    source: subspecies.source,
    entries: subspecies.entries,
  };
}
