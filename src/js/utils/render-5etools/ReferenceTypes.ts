// Generic 5etools entry types (used by feats, spells, items, etc.)
type EntryString = string;
type EntryObject = {
  type: string;
  name?: string;
  entries?: Array<EntryString | EntryObject>;
  items?: Array<EntryString | EntryObject>;
};
export type Entry = EntryString | EntryObject;

/**
 * Generic interface for 5etools reference data (feat, spell, item, etc.)
 * @internal - only exported for use by getFeat/getSpell
 */
export interface Reference {
  name: string;
  source: string;
  entries: Array<Entry>;
  category?: string; // See `FEAT_CATEGORIES`
}

/**
 * Branded type for sanitized HTML string from 5etools references
 */
export type ReferenceHTML = string & { readonly __brand: "ReferenceHTML" };

/**
 * Generic interface for rendered 5etools reference data
 */
export interface ReferenceRendered {
  name: string;
  source: string;
  html: ReferenceHTML;
}

/**
 * Feat category mappings
 */
export const FEAT_CATEGORIES: Record<string, string> = {
  O: "Origin Feat",
  G: "General Feat",
  FS: "Fighting Style Feat",
  "FS:P": "Fighting Style Feat (Paladin)",
  "FS:R": "Fighting Style Feat (Ranger)",
  EB: "Epic Boon Feat",
};

/**
 * Source book abbreviation to readable name mappings
 * Only includes sources where the display name differs from the ID
 */
export const SOURCE_NAMES: Record<string, string> = {
  PHB: "PHB'14",
  DMG: "DMG'14",
  MM: "MM'14",
  XPHB: "PHB'24",
  XDMG: "DMG'24",
  XMM: "MM'25",
};

/**
 * Gets the readable name for a source book abbreviation
 * @param source - The source abbreviation (e.g., "XPHB")
 * @returns The readable name (e.g., "PHB'24") or the original if not found
 */
export function getSourceName(source: string): string {
  return SOURCE_NAMES[source] || source;
}
