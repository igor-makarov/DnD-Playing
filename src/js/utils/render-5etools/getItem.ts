import type { Entry, PropertyItem, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Item-specific interface extending Reference
interface ItemReference extends Reference {
  type?: string;
  rarity?: string;
  weight?: number;
  value?: number; // in copper pieces
}

// Structure of item data from 5etools JSON file
interface ItemData {
  item: Array<ItemReference>;
}

// Map of item type codes to readable names
const ITEM_TYPE_NAMES: Record<string, string> = {
  A: "Ammunition",
  AF: "Ammunition (Firearm)",
  AT: "Artisan's Tool",
  G: "Adventuring Gear",
  GS: "Gaming Set",
  INS: "Instrument",
  M: "Melee Weapon",
  R: "Ranged Weapon",
  S: "Shield",
  LA: "Light Armor",
  MA: "Medium Armor",
  HA: "Heavy Armor",
  P: "Potion",
  RD: "Rod",
  RG: "Ring",
  SC: "Scroll",
  SCF: "Spellcasting Focus",
  T: "Tool",
  W: "Wondrous Item",
  WD: "Wand",
};

function getItemTypeName(type?: string): string | null {
  if (!type) return null;
  // Type can be "AT|XPHB" format, extract just the type code
  const typeCode = type.split("|")[0];
  return ITEM_TYPE_NAMES[typeCode] || null;
}

function formatValue(value?: number): string | null {
  if (value === undefined) return null;
  // Value is in copper pieces
  if (value >= 100) {
    return `${value / 100} GP`;
  } else if (value >= 10) {
    return `${value / 10} SP`;
  }
  return `${value} CP`;
}

function formatWeight(weight?: number): string | null {
  if (weight === undefined) return null;
  return weight === 1 ? "1 lb." : `${weight} lb.`;
}

/**
 * Get an item from the 5etools data by name and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The item name (e.g., "Alchemist's Supplies", "Longsword")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The item reference data
 * @throws Error if item is not found
 */
export function getItem(name: string, source: string = "XPHB"): Reference {
  const data = loadData<ItemData>("items.json");

  const item = data.item.find((i) => i.name.toLowerCase() === name.toLowerCase() && i.source === source);

  if (!item) {
    throw new Error(`Item "${name}" from source "${source}" not found in 5etools data`);
  }

  const typeName = getItemTypeName(item.type);
  const byline = typeName || undefined;

  // Build properties
  const propsData: PropertyItem[] = [];
  const costStr = formatValue(item.value);
  if (costStr) {
    propsData.push({ key: "Cost", value: costStr });
  }
  const weightStr = formatWeight(item.weight);
  if (weightStr) {
    propsData.push({ key: "Weight", value: weightStr });
  }

  // Build entries array
  const entries: Entry[] = [];
  if (propsData.length > 0) {
    entries.push({ type: "properties", data: propsData });
  }
  entries.push(...item.entries);

  return {
    name: item.name,
    source: item.source,
    byline,
    entries,
  };
}
