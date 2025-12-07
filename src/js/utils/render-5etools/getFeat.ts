import featsData from "@5etools/data/feats.json";

import type { Reference } from "./ReferenceTypes";

// Feat-specific interface extending Reference
interface FeatReference extends Reference {
  category?: string; // See FEAT_CATEGORIES
}

// Structure of feat data from 5etools JSON files
interface FeatData {
  feat: Array<FeatReference>;
}

// Feat category mappings
const FEAT_CATEGORIES: Record<string, string> = {
  O: "Origin Feat",
  G: "General Feat",
  FS: "Fighting Style Feat",
  "FS:P": "Fighting Style Feat (Paladin)",
  "FS:R": "Fighting Style Feat (Ranger)",
  EB: "Epic Boon Feat",
};

function getCategoryByline(category: string | undefined): string | undefined {
  if (!category) return undefined;
  return FEAT_CATEGORIES[category] || category;
}

/**
 * Get a feat from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The feat name (e.g., "Alert")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The feat reference data
 * @throws Error if feat is not found
 */
export function getFeat(name: string, source: string = "XPHB"): Reference {
  const typedFeatsData = featsData as FeatData;
  const feat = typedFeatsData.feat.find((f) => f.name === name && f.source === source);

  if (!feat) {
    throw new Error(`Feat "${name}" from source "${source}" not found in 5etools data`);
  }

  const byline = getCategoryByline(feat.category);

  const featData: FeatReference = {
    ...feat,
    byline,
  };

  return featData;
}
