import type { Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Weapon mastery-specific interface extending Reference
interface WeaponMasteryReference extends Reference {
  page?: number;
  srd52?: boolean;
  basicRules2024?: boolean;
}

// Structure of items-base.json
interface ItemsBaseData {
  itemMastery: Array<WeaponMasteryReference>;
}

/**
 * Get a weapon mastery property from the 5etools data.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The mastery property name (e.g., "Vex", "Topple")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The mastery property reference data
 * @throws Error if mastery property is not found
 */
export function getWeaponMastery(name: string, source: string = "XPHB"): Reference {
  const data = loadData<ItemsBaseData>("items-base.json");

  const mastery = data.itemMastery.find((m) => m.name.toLowerCase() === name.toLowerCase() && m.source === source);

  if (!mastery) {
    const available = data.itemMastery
      .filter((m) => m.source === source)
      .map((m) => m.name)
      .join(", ");
    throw new Error(`Weapon mastery "${name}" from source "${source}" not found. Available: ${available}`);
  }

  return {
    ...mastery,
    byline: "Weapon Mastery Property",
  };
}
