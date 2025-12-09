import type { Entry, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// 5etools optional feature prerequisite structure
interface OptionalFeaturePrerequisite {
  level?: {
    level: number;
    class?: {
      name: string;
      source?: string;
    };
  };
  spell?: Array<string | object>;
}

// Optional feature-specific interface extending Reference
interface OptionalFeatureReference extends Reference {
  featureType: string[]; // e.g., ["EI"] for Eldritch Invocation
  prerequisite?: OptionalFeaturePrerequisite[];
}

// Structure of optional feature data from 5etools JSON file
interface OptionalFeatureData {
  optionalfeature: Array<OptionalFeatureReference>;
}

// Map of feature type codes to readable names
const FEATURE_TYPE_NAMES: Record<string, string> = {
  EI: "Eldritch Invocation",
  PB: "Pact Boon",
  "MV:B": "Battle Master Maneuver",
  "MV:C2-UA": "Cavalier Maneuver",
  AS: "Arcane Shot",
  "AS:V1-UA": "Arcane Shot (UA)",
  "AS:V2-UA": "Arcane Shot (UA)",
  OTH: "Other",
  FS: "Fighting Style",
  "FS:F": "Fighting Style (Fighter)",
  "FS:B": "Fighting Style (Bard)",
  "FS:P": "Fighting Style (Paladin)",
  "FS:R": "Fighting Style (Ranger)",
  MM: "Metamagic",
  AF: "Artificer Infusion",
  AI: "Artificer Infusion",
  ED: "Elemental Discipline",
  RN: "Rune Knight Rune",
  TCE: "Tasha's Cauldron",
};

function getFeatureTypeName(featureTypes: string[]): string {
  for (const type of featureTypes) {
    if (FEATURE_TYPE_NAMES[type]) {
      return FEATURE_TYPE_NAMES[type];
    }
  }
  return featureTypes.join(", ");
}

function formatPrerequisites(prerequisites?: OptionalFeaturePrerequisite[]): string | null {
  if (!prerequisites || prerequisites.length === 0) return null;

  const parts: string[] = [];

  for (const prereq of prerequisites) {
    if (prereq.level) {
      const className = prereq.level.class?.name || "";
      if (className) {
        parts.push(`${className} ${prereq.level.level}`);
      } else {
        parts.push(`Level ${prereq.level.level}`);
      }
    }
  }

  return parts.length > 0 ? parts.join(", ") : null;
}

/**
 * Get an optional feature (invocation, maneuver, etc.) from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The feature name (e.g., "Pact of the Blade")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The optional feature reference data
 * @throws Error if feature is not found
 */
export function getOptionalFeature(name: string, source: string = "XPHB"): Reference {
  const data = loadData<OptionalFeatureData>("optionalfeatures.json");

  const feature = data.optionalfeature.find((f) => f.name.toLowerCase() === name.toLowerCase() && f.source === source);

  if (!feature) {
    throw new Error(`Optional feature "${name}" from source "${source}" not found in 5etools data`);
  }

  const byline = getFeatureTypeName(feature.featureType);
  const prereqText = formatPrerequisites(feature.prerequisite);

  // Build entries array
  const entries: Entry[] = [];

  // Add prerequisite as a property if present
  if (prereqText) {
    entries.push({
      type: "properties",
      data: [{ key: "Prerequisite", value: prereqText }],
    });
  }

  entries.push(...feature.entries);

  return {
    name: feature.name,
    source: feature.source,
    byline,
    entries,
  };
}
