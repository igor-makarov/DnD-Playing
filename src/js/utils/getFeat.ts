import featsData from "@5etools/data/feats.json";

type EntryString = string;
type EntryObject = {
  type: string;
  name?: string;
  entries?: Array<EntryString | EntryObject>;
  items?: Array<EntryString | EntryObject>;
};
type Entry = EntryString | EntryObject;

export interface Feat {
  name: string;
  source: string;
  entries: Array<Entry>;
}

/**
 * Get a feat from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The feat name (e.g., "Alert")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The feat data
 * @throws Error if feat is not found
 */
export function getFeat(name: string, source: string = "XPHB"): Feat {
  const feat = featsData.feat.find((f: any) => f.name === name && f.source === source);

  if (!feat) {
    throw new Error(`Feat "${name}" from source "${source}" not found in 5etools data`);
  }

  return feat as Feat;
}
