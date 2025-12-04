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
  category?: string; // For feats: "O" (Origin), "G" (General), "FS" (Fighting Style), "EB" (Epic Boon)
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
 * Feat category mappings (XPHB 2024)
 */
export const FEAT_CATEGORIES: Record<string, string> = {
  O: "Origin Feat",
  G: "General Feat",
  FS: "Fighting Style Feat",
  "FS:P": "Fighting Style Feat (Paladin)",
  "FS:R": "Fighting Style Feat (Ranger)",
  EB: "Epic Boon Feat",
};
