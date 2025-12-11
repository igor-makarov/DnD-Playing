import { subclassRoute } from "../collectSubclasses";
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
  class: Array<{ name: string; source: string; subclassTitle?: string }>;
  classFeature: Array<unknown>;
  subclass: Array<SubclassData>;
  subclassFeature: Array<SubclassFeatureEntry>;
}

export interface SubclassReference {
  name: string;
  shortName: string;
  source: string;
  className: string;
  classSource: string;
}

export interface SubclassFeatureSummary {
  name: string;
  level: number;
}

export interface SubclassFeatureFull {
  name: string;
  level: number;
  entries: Entry[];
}

/**
 * Resolve _copy for a subclass feature by finding the source feature and merging entries.
 */
function resolveFeatureCopy(feature: SubclassFeatureEntry, allFeatures: SubclassFeatureEntry[]): SubclassFeatureEntry {
  if (!feature._copy) {
    return feature;
  }

  const sourceFeature = allFeatures.find(
    (f) =>
      f.name === feature._copy!.name &&
      f.source === feature._copy!.source &&
      f.className === feature._copy!.className &&
      f.classSource === feature._copy!.classSource &&
      f.subclassShortName === feature._copy!.subclassShortName &&
      f.subclassSource === feature._copy!.subclassSource &&
      f.level === feature._copy!.level,
  );

  if (sourceFeature) {
    // Recursively resolve if source also has _copy
    const resolvedSource = resolveFeatureCopy(sourceFeature, allFeatures);
    return {
      ...feature,
      entries: feature.entries || resolvedSource.entries,
    };
  }

  return feature;
}

interface ParsedFeatureRef {
  name: string;
  className: string;
  classSource: string;
  subclassShortName: string;
  subclassSource: string;
  level: number;
}

/**
 * Parse a subclassFeatures string entry.
 * Format: "Name|ClassName|ClassSource|SubclassShortName|SubclassSource|Level"
 * Empty segments default to the subclass's values.
 */
function parseSubclassFeatureRef(
  ref: string,
  defaultClassName: string,
  defaultClassSource: string,
  defaultSubclassShortName: string,
  defaultSubclassSource: string,
): ParsedFeatureRef | null {
  const parts = ref.split("|");
  if (parts.length < 6) return null;

  return {
    name: parts[0],
    className: parts[1] || defaultClassName,
    classSource: parts[2] || defaultClassSource,
    subclassShortName: parts[3] || defaultSubclassShortName,
    subclassSource: parts[4] || defaultSubclassSource,
    level: parseInt(parts[5], 10),
  };
}

/**
 * Extract refSubclassFeature references from entries.
 */
function extractRefSubclassFeatures(
  entries: Entry[],
  defaultClassName: string,
  defaultClassSource: string,
  defaultSubclassShortName: string,
  defaultSubclassSource: string,
): ParsedFeatureRef[] {
  const refs: ParsedFeatureRef[] = [];
  for (const entry of entries) {
    if (typeof entry === "object" && entry !== null && "type" in entry && entry.type === "refSubclassFeature" && "subclassFeature" in entry) {
      const parsed = parseSubclassFeatureRef(
        entry.subclassFeature as string,
        defaultClassName,
        defaultClassSource,
        defaultSubclassShortName,
        defaultSubclassSource,
      );
      if (parsed) refs.push(parsed);
    }
  }
  return refs;
}

/**
 * Get a subclass from the 5etools data by name, class, and source.
 * This function should be called at build time or during server-side rendering.
 *
 * @param className - The class name (e.g., "Wizard", "Warlock")
 * @param subclassShortName - The subclass short name (e.g., "Necromancy", "Fiend")
 * @param classSource - The class source book (default: "XPHB" for 2024 PHB)
 * @returns The subclass reference data
 * @throws Error if subclass is not found
 */
export function getSubclass(className: string, subclassShortName: string, classSource: string = "XPHB"): Reference {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  // Find the subclass - prefer subclass source matching classSource (2024 native versions)
  const matchingSubclasses = classData.subclass.filter(
    (s) => s.shortName === subclassShortName && s.className === className && s.classSource === classSource,
  );
  // Prefer subclass with source matching classSource (e.g., XPHB subclass for XPHB class)
  const subclass = matchingSubclasses.find((s) => s.source === classSource) || matchingSubclasses[0];

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

  // Build entries array - filter out refSubclassFeature (shown in full page with level headings)
  const entries: Entry[] = [];

  if (introFeature?.entries) {
    for (const entry of introFeature.entries) {
      if (typeof entry === "string") {
        entries.push(entry);
      } else if (typeof entry === "object" && entry !== null) {
        // Skip refSubclassFeature entries - they appear in the full page with level headings
        if ("type" in entry && entry.type === "refSubclassFeature") {
          continue;
        }
        entries.push(entry);
      }
    }
  }

  return {
    name: subclass.name,
    source: subclass.source,
    byline,
    entries,
    fullLink: subclassRoute({ className, classSource, subclassShortName, subclassSource: subclass.source }),
  };
}

/**
 * Find a subclass feature by its parsed reference, with fallback matching.
 */
function findFeatureByRef(
  ref: { name: string; className: string; classSource: string; subclassShortName: string; subclassSource: string; level: number },
  allFeatures: SubclassFeatureEntry[],
): SubclassFeatureEntry | undefined {
  // Try exact match first
  let feature = allFeatures.find(
    (f) =>
      f.name === ref.name &&
      f.className === ref.className &&
      f.classSource === ref.classSource &&
      f.subclassShortName === ref.subclassShortName &&
      f.level === ref.level,
  );

  // If not found, try matching without classSource (for cross-source references)
  if (!feature) {
    feature = allFeatures.find(
      (f) => f.name === ref.name && f.className === ref.className && f.subclassShortName === ref.subclassShortName && f.level === ref.level,
    );
  }

  return feature;
}

/**
 * Get list of subclass features with their levels.
 */
export function getSubclassFeatures(
  className: string,
  subclassShortName: string,
  classSource: string = "XPHB",
  subclassSource: string = "XPHB",
): SubclassFeatureSummary[] {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  // Find the subclass - prefer subclass source matching classSource (2024 native versions)
  const matchingSubclasses = classData.subclass.filter(
    (s) => s.shortName === subclassShortName && s.className === className && s.classSource === classSource,
  );
  const subclass = matchingSubclasses.find((s) => s.source === classSource) || matchingSubclasses[0];

  if (!subclass) {
    throw new Error(`Subclass "${subclassShortName}" for ${className} from source "${classSource}" not found`);
  }

  const results: SubclassFeatureSummary[] = [];

  for (const featureRef of subclass.subclassFeatures) {
    const parsed = parseSubclassFeatureRef(featureRef, className, classSource, subclassShortName, subclassSource);
    if (parsed) {
      results.push({ name: parsed.name, level: parsed.level });
    }
  }

  // Sort by level only, preserve original order within same level
  return results.sort((a, b) => a.level - b.level);
}

/**
 * Get full subclass features with entries, resolving _copy references.
 * Also expands refSubclassFeature entries from the intro feature.
 */
export function getSubclassFeaturesFull(
  className: string,
  subclassShortName: string,
  classSource: string = "XPHB",
  subclassSource: string = "XPHB",
): SubclassFeatureFull[] {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  // Find the subclass - prefer subclass source matching classSource (2024 native versions)
  const matchingSubclasses = classData.subclass.filter(
    (s) => s.shortName === subclassShortName && s.className === className && s.classSource === classSource,
  );
  const subclass = matchingSubclasses.find((s) => s.source === classSource) || matchingSubclasses[0];

  if (!subclass) {
    throw new Error(`Subclass "${subclassShortName}" for ${className} from source "${classSource}" not found`);
  }

  const results: SubclassFeatureFull[] = [];
  const addedFeatures = new Set<string>(); // Track added features by "name|level" to avoid duplicates

  for (const featureRef of subclass.subclassFeatures) {
    const parsed = parseSubclassFeatureRef(featureRef, className, classSource, subclassShortName, subclassSource);
    if (!parsed) continue;

    const feature = findFeatureByRef(parsed, classData.subclassFeature);
    if (!feature) continue;

    // Resolve _copy if present
    const resolved = resolveFeatureCopy(feature, classData.subclassFeature);
    const resolvedEntries = resolved.entries || [];

    // Check for refSubclassFeature entries and expand them
    const embeddedRefs = extractRefSubclassFeatures(resolvedEntries, className, classSource, subclassShortName, subclassSource);

    for (const embeddedRef of embeddedRefs) {
      const embeddedFeature = findFeatureByRef(embeddedRef, classData.subclassFeature);
      if (embeddedFeature) {
        const resolvedEmbedded = resolveFeatureCopy(embeddedFeature, classData.subclassFeature);
        const key = `${resolvedEmbedded.name}|${parsed.level}`;
        if (!addedFeatures.has(key)) {
          addedFeatures.add(key);
          results.push({
            name: resolvedEmbedded.name,
            level: parsed.level, // Use the parent feature's level
            entries: resolvedEmbedded.entries || [],
          });
        }
      }
    }

    // Add the main feature itself
    const mainKey = `${resolved.name}|${parsed.level}`;
    if (!addedFeatures.has(mainKey)) {
      addedFeatures.add(mainKey);
      results.push({
        name: resolved.name,
        level: parsed.level,
        entries: resolvedEntries,
      });
    }
  }

  // Sort by level only, preserve original order within same level
  return results.sort((a, b) => a.level - b.level);
}

/**
 * Get all subclasses from a class file.
 */
export function getAllSubclassesFromClass(className: string): SubclassReference[] {
  const classData = loadData<ClassData>(`class/class-${className.toLowerCase()}.json`);

  return classData.subclass.map((s) => ({
    name: s.name,
    shortName: s.shortName,
    source: s.source,
    className: s.className,
    classSource: s.classSource,
  }));
}
