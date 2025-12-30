import type { Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

interface ConditionReference extends Reference {
  page?: number;
  srd52?: boolean;
  basicRules2024?: boolean;
}

interface ConditionsData {
  condition: Array<ConditionReference>;
}

/**
 * Get a condition from the 5etools data.
 * This function should be called at build time or during server-side rendering.
 *
 * @param name - The condition name (e.g., "Grappled", "Prone")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The condition reference data
 * @throws Error if condition is not found
 */
export function getCondition(name: string, source: string = "XPHB"): Reference {
  const data = loadData<ConditionsData>("conditionsdiseases.json");

  const condition = data.condition.find((c) => c.name.toLowerCase() === name.toLowerCase() && c.source === source);

  if (!condition) {
    const available = data.condition
      .filter((c) => c.source === source)
      .map((c) => c.name)
      .join(", ");
    throw new Error(`Condition "${name}" from source "${source}" not found. Available: ${available}`);
  }

  return {
    ...condition,
    byline: "Condition",
  };
}
