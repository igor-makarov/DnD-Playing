import type { Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

interface VariantRuleReference extends Reference {
  page?: number;
  srd52?: boolean;
  basicRules2024?: boolean;
  ruleType?: string;
}

interface VariantRulesData {
  variantrule: Array<VariantRuleReference>;
}

/**
 * Get a variant rule from the 5etools data.
 * This function should be called at build time or during server-side rendering.
 *
 * @param name - The variant rule name (e.g., "Unarmed Strike", "Ability Check")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The variant rule reference data
 * @throws Error if variant rule is not found
 */
export function getVariantRule(name: string, source: string = "XPHB"): Reference {
  const data = loadData<VariantRulesData>("variantrules.json");

  const rule = data.variantrule.find((r) => r.name.toLowerCase() === name.toLowerCase() && r.source === source);

  if (!rule) {
    const available = data.variantrule
      .filter((r) => r.source === source)
      .map((r) => r.name)
      .slice(0, 20)
      .join(", ");
    throw new Error(`Variant rule "${name}" from source "${source}" not found. Some available: ${available}`);
  }

  return {
    ...rule,
    byline: "Rule",
  };
}
