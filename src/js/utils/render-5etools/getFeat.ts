import featsData from "@5etools/data/feats.json";

import type { Reference, ReferenceRendered } from "./ReferenceTypes";
import renderReference from "./renderReference";

/**
 * Feat category mappings
 */
const FEAT_CATEGORIES: Record<string, string> = {
  O: "Origin Feat",
  G: "General Feat",
  FS: "Fighting Style Feat",
  "FS:P": "Fighting Style Feat (Paladin)",
  "FS:R": "Fighting Style Feat (Ranger)",
  EB: "Epic Boon Feat",
};

/**
 * Converts a feat category code to a human-readable byline
 * @param category - The category code (e.g., "O", "G", "FS")
 * @returns The readable category name, or the original category if not found, or undefined if no category
 */
function getCategoryByline(category: string | undefined): string | undefined {
  if (!category) return undefined;
  return FEAT_CATEGORIES[category] || category;
}

/**
 * Get a feat from the 5etools data by name and source, with rendered HTML.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The feat name (e.g., "Alert")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The feat data with rendered HTML
 * @throws Error if feat is not found
 */
export function getFeat(name: string, source: string = "XPHB"): ReferenceRendered {
  const feat = featsData.feat.find((f: any) => f.name === name && f.source === source);

  if (!feat) {
    throw new Error(`Feat "${name}" from source "${source}" not found in 5etools data`);
  }

  const featData: Reference = {
    ...feat,
    byline: getCategoryByline(feat.category),
  };

  return renderReference(featData);
}
