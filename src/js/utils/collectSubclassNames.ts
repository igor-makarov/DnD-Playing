import * as fs from "node:fs";
import * as path from "node:path";

import { loadData } from "./render-5etools/loadData";

const PAGES_DIR = "src/pages";

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
 */
function getActualSubclassSource(className: string, subclassShortName: string, classSource: string): string | null {
  try {
    const classData = loadData<ClassFileData>(`class/class-${className.toLowerCase()}.json`);
    const subclass = classData.subclass.find((s) => s.shortName === subclassShortName && s.className === className && s.classSource === classSource);
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
 * Recursively find all .astro files in a directory.
 */
function findAstroFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findAstroFiles(fullPath));
    } else if (entry.name.endsWith(".astro")) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Collect all unique subclass references from all page files by searching for getSubclass() calls.
 * Returns a unique list keyed by "ClassName|ClassSource|SubclassShortName|SubclassSource".
 */
export function collectAllSubclassReferences(): SubclassReferenceFromPage[] {
  const refMap = new Map<string, SubclassReferenceFromPage>();
  const pagesPath = path.resolve(PAGES_DIR);

  if (!fs.existsSync(pagesPath)) {
    console.warn(`[subclasses] Pages directory not found: ${pagesPath}`);
    return [];
  }

  const files = findAstroFiles(pagesPath);

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
