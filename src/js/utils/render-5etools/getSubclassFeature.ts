import type { Entry, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Subclass feature-specific interface extending Reference
interface SubclassFeatureReference extends Reference {
  className: string;
  classSource: string;
  subclassShortName: string;
  subclassSource: string;
  level: number;
  page?: number;
}

// Structure of class data from 5etools JSON files
interface ClassData {
  class: Array<unknown>; // Not used here
  classFeature: Array<unknown>; // Not used here
  subclassFeature: Array<SubclassFeatureReference>;
}

/**
 * Get a subclass feature from the 5etools data by name, class, subclass, and source.
 * This function should be called at build time or during server-side rendering.
 *
 * @param featureName - The feature name (e.g., "Dark One's Blessing", "Divine Strike")
 * @param className - The class name (e.g., "Warlock", "Cleric")
 * @param subclassName - The subclass short name (e.g., "Fiend", "Life")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The subclass feature reference data
 * @throws Error if feature is not found
 */
export function getSubclassFeature(featureName: string, className: string, subclassName: string, source: string = "XPHB"): Reference {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  const feature = classData.subclassFeature.find(
    (f) =>
      f.name.toLowerCase() === featureName.toLowerCase() &&
      f.className === className &&
      f.classSource === source &&
      f.subclassShortName === subclassName &&
      f.subclassSource === source &&
      f.source === source,
  );

  if (!feature) {
    throw new Error(`Subclass feature "${featureName}" for ${className} (${subclassName}) from source "${source}" not found in 5etools data`);
  }

  const byline = `Level ${feature.level} ${className} (${subclassName}) Feature`;

  // Build entries array
  const entries: Entry[] = [...feature.entries];

  return {
    name: feature.name,
    source: feature.source,
    byline,
    entries,
  };
}
