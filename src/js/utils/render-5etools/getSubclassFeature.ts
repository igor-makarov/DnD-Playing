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
 * Get a subclass feature from the 5etools data.
 * This function should be called at build time or during server-side rendering.
 *
 * The class source defaults to XPHB. The subclass source defaults to the class
 * source and is also the feature source.
 */
export function getSubclassFeature(
  featureName: string,
  className: string,
  subclassName: string,
  classSource: string = "XPHB",
  subclassSource: string = classSource,
): Reference {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  const feature = classData.subclassFeature.find(
    (f) =>
      f.name.toLowerCase() === featureName.toLowerCase() &&
      f.className === className &&
      f.classSource === classSource &&
      f.subclassShortName === subclassName &&
      f.subclassSource === subclassSource &&
      f.source === subclassSource,
  );

  if (!feature) {
    throw new Error(`Subclass feature "${featureName}" for ${className} (${subclassName}) from source "${subclassSource}" not found in 5etools data`);
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
