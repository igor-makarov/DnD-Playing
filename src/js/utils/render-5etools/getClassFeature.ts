import fs from "node:fs";
import path from "node:path";

import type { Reference } from "./ReferenceTypes";

// Class feature-specific interface extending Reference
interface ClassFeatureReference extends Reference {
  className: string;
  classSource: string;
  level: number;
  page?: number;
}

// Structure of class feature data from 5etools JSON files
interface ClassFeatureData {
  class: Array<unknown>; // Not used here
  classFeature: Array<ClassFeatureReference>;
}

// Base path to 5etools class data (resolved at build time)
const CLASS_DATA_DIR = path.resolve("5etools/data/class");

function loadClassFeatureData(className: string): ClassFeatureData {
  const fileName = `class-${className.toLowerCase()}.json`;
  const filePath = path.join(CLASS_DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Class "${className}" not found in 5etools data`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as ClassFeatureData;
}

/**
 * Get a class feature from the 5etools data by name, class, and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param featureName - The feature name (e.g., "Second Wind", "Action Surge")
 * @param className - The class name (e.g., "Fighter", "Wizard")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The class feature reference data
 * @throws Error if class or feature is not found
 */
export function getClassFeature(featureName: string, className: string, source: string = "XPHB"): Reference {
  const featureData = loadClassFeatureData(className);

  const feature = featureData.classFeature.find(
    (f) => f.name.toLowerCase() === featureName.toLowerCase() && f.className === className && f.classSource === source && f.source === source,
  );

  if (!feature) {
    throw new Error(`Feature "${featureName}" for class "${className}" from source "${source}" not found in 5etools data`);
  }

  const byline = `Level ${feature.level} ${className} Feature`;

  const classFeatureReference: ClassFeatureReference = {
    ...feature,
    byline,
  };

  return classFeatureReference;
}
