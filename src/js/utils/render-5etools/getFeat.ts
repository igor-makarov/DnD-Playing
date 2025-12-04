import featsData from "@5etools/data/feats.json";

import type { Reference, ReferenceRendered } from "./ReferenceTypes";
import renderReference from "./renderReference";

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

  const featData = feat as Reference;

  return {
    name: featData.name,
    source: featData.source,
    html: renderReference(featData),
  };
}
