import * as fs from "node:fs";
import * as path from "node:path";

import { href } from "react-router";

import { findFiles } from "./findFiles";
import { loadData } from "./render-5etools/loadData";

const ROUTES_DIR = "src/app/routes";

export interface SubclassReferenceFromPage {
  className: string;
  classSource: string;
  subclassShortName: string;
  subclassSource: string;
}

interface SubclassData {
  shortName: string;
  source: string;
  className: string;
  classSource: string;
}

interface ClassFileData {
  subclass: SubclassData[];
}

/**
 * Look up the actual subclass source from 5etools data.
 * Uses the same preference logic as getSubclass() - prefers subclass source matching classSource.
 */
function getActualSubclassSource(className: string, subclassShortName: string, classSource: string): string | null {
  try {
    const classData = loadData<ClassFileData>(`class/class-${className.toLowerCase()}.json`);
    const matchingSubclasses = classData.subclass.filter(
      (s) => s.shortName === subclassShortName && s.className === className && s.classSource === classSource,
    );
    // Prefer subclass with source matching classSource (e.g., XPHB subclass for XPHB class)
    const subclass = matchingSubclasses.find((s) => s.source === classSource) || matchingSubclasses[0];
    return subclass?.source || null;
  } catch {
    return null;
  }
}

/**
 * Extract subclass references from a file by searching for getSubclass() patterns.
 */
function extractSubclassReferencesFromFile(filePath: string): SubclassReferenceFromPage[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const refs: SubclassReferenceFromPage[] = [];

  // Match getSubclass("ClassName", "SubclassShortName") or getSubclass("ClassName", "SubclassShortName", "Source") calls
  const getSubclassRegex = /getSubclass\(['"]([\w\s]+)['"],\s*['"]([\w\s]+)['"](?:,\s*['"](\w+)['"])?\)/g;
  let match;
  while ((match = getSubclassRegex.exec(content)) !== null) {
    const classSource = match[3] || "XPHB";
    const className = match[1];
    const subclassShortName = match[2];

    // Look up actual subclass source from 5etools data
    const actualSubclassSource = getActualSubclassSource(className, subclassShortName, classSource);
    if (actualSubclassSource) {
      refs.push({
        className,
        classSource,
        subclassShortName,
        subclassSource: actualSubclassSource,
      });
    }
  }

  return refs;
}

/**
 * Collect all unique subclass references from all route files by searching for getSubclass() calls.
 * Returns a unique list keyed by "ClassName|ClassSource|SubclassShortName|SubclassSource".
 */
export function collectAllSubclassReferences(): SubclassReferenceFromPage[] {
  const refMap = new Map<string, SubclassReferenceFromPage>();
  const routesPath = path.resolve(ROUTES_DIR);

  if (!fs.existsSync(routesPath)) {
    console.warn(`[subclasses] Routes directory not found: ${routesPath}`);
    return [];
  }

  const files = findFiles(routesPath);

  for (const filePath of files) {
    const refs = extractSubclassReferencesFromFile(filePath);
    for (const ref of refs) {
      const key = `${ref.className}|${ref.classSource}|${ref.subclassShortName}|${ref.subclassSource}`;
      if (!refMap.has(key)) {
        refMap.set(key, ref);
      }
    }
  }

  return [...refMap.values()];
}

/**
 * Build URL path for a subclass page.
 */
export function subclassRoute(ref: SubclassReferenceFromPage): string {
  return href("/subclasses/:subclass", { subclass: `${ref.className}-${ref.classSource}-${ref.subclassShortName}-${ref.subclassSource}` });
}

/**
 * Collect URL paths for dynamic subclass routes.
 */
export function collectSubclassRoutes(): string[] {
  return collectAllSubclassReferences().map(subclassRoute);
}
