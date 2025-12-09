import type { Entry, Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Subclass-specific interface
interface SubclassData {
  name: string;
  shortName: string;
  source: string;
  className: string;
  classSource: string;
  page?: number;
  subclassFeatures: string[];
  _copy?: {
    name: string;
    source: string;
    shortName: string;
    className: string;
    classSource: string;
  };
}

// Subclass feature entry
interface SubclassFeatureEntry {
  name: string;
  source: string;
  className: string;
  classSource: string;
  subclassShortName: string;
  subclassSource: string;
  level: number;
  entries?: Entry[];
  _copy?: {
    name: string;
    source: string;
    className: string;
    classSource: string;
    subclassShortName: string;
    subclassSource: string;
    level: number;
  };
}

// Structure of class data from 5etools JSON files
interface ClassData {
  class: Array<unknown>;
  classFeature: Array<unknown>;
  subclass: Array<SubclassData>;
  subclassFeature: Array<SubclassFeatureEntry>;
}

/**
 * Get a subclass from the 5etools data by name, class, and source.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param className - The class name (e.g., "Wizard", "Warlock")
 * @param subclassShortName - The subclass short name (e.g., "Necromancy", "Fiend")
 * @param classSource - The class source book (default: "XPHB" for 2024 PHB)
 * @returns The subclass reference data
 * @throws Error if subclass is not found
 */
export function getSubclass(className: string, subclassShortName: string, classSource: string = "XPHB"): Reference {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  // Find the subclass
  const subclass = classData.subclass.find((s) => s.shortName === subclassShortName && s.className === className && s.classSource === classSource);

  if (!subclass) {
    throw new Error(`Subclass "${subclassShortName}" for ${className} from source "${classSource}" not found in 5etools data`);
  }

  // Find the intro subclass feature (same name as subclass)
  let introFeature = classData.subclassFeature.find(
    (f) => f.name === subclass.name && f.className === className && f.classSource === classSource && f.subclassShortName === subclassShortName,
  );

  // If the intro feature has _copy, try to find the source
  if (introFeature?._copy) {
    const sourceFeature = classData.subclassFeature.find(
      (f) =>
        f.name === introFeature!._copy!.name &&
        f.source === introFeature!._copy!.source &&
        f.className === introFeature!._copy!.className &&
        f.classSource === introFeature!._copy!.classSource &&
        f.subclassShortName === introFeature!._copy!.subclassShortName &&
        f.subclassSource === introFeature!._copy!.subclassSource,
    );
    if (sourceFeature) {
      introFeature = sourceFeature;
    }
  }

  const byline = `${className} Subclass`;

  // Build entries array
  const entries: Entry[] = [];

  if (introFeature?.entries) {
    // Filter out refSubclassFeature entries and add just the description text
    for (const entry of introFeature.entries) {
      if (typeof entry === "string") {
        entries.push(entry);
      } else if (typeof entry === "object" && entry !== null && !("type" in entry && entry.type === "refSubclassFeature")) {
        entries.push(entry);
      }
    }
  }

  return {
    name: subclass.name,
    source: subclass.source,
    byline,
    entries,
  };
}
