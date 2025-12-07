import barbarianJson from "@5etools/data/class/class-barbarian.json";
import bardJson from "@5etools/data/class/class-bard.json";
import clericJson from "@5etools/data/class/class-cleric.json";
import druidJson from "@5etools/data/class/class-druid.json";
import fighterJson from "@5etools/data/class/class-fighter.json";
import monkJson from "@5etools/data/class/class-monk.json";
import paladinJson from "@5etools/data/class/class-paladin.json";
import rangerJson from "@5etools/data/class/class-ranger.json";
import rogueJson from "@5etools/data/class/class-rogue.json";
import sorcererJson from "@5etools/data/class/class-sorcerer.json";
import warlockJson from "@5etools/data/class/class-warlock.json";
import wizardJson from "@5etools/data/class/class-wizard.json";

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

// Map of class names to class feature data
const CLASS_FEATURE_DATA_BY_NAME: Record<string, ClassFeatureData> = {
  Barbarian: barbarianJson,
  Bard: bardJson,
  Cleric: clericJson,
  Druid: druidJson,
  Fighter: fighterJson,
  Monk: monkJson,
  Paladin: paladinJson,
  Ranger: rangerJson,
  Rogue: rogueJson,
  Sorcerer: sorcererJson,
  Warlock: warlockJson,
  Wizard: wizardJson,
};

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
  const featureData = CLASS_FEATURE_DATA_BY_NAME[className];

  if (!featureData) {
    throw new Error(`Class "${className}" not supported. Available classes: ${Object.keys(CLASS_FEATURE_DATA_BY_NAME).join(", ")}`);
  }

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
