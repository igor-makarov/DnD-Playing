import * as fs from "node:fs";
import * as path from "node:path";

const PAGES_DIR = "src/pages";

export interface ClassReference {
  name: string;
  source: string;
}

/**
 * Extract class references from a file by searching for getClass("ClassName", "Source") patterns.
 */
function extractClassReferencesFromFile(filePath: string): ClassReference[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const classRefs: ClassReference[] = [];

  // Match getClass("ClassName") or getClass("ClassName", "Source") calls
  const getClassRegex = /getClass\(["'](\w+)["'](?:\s*,\s*["'](\w+)["'])?\)/g;
  let match;
  while ((match = getClassRegex.exec(content)) !== null) {
    classRefs.push({
      name: match[1],
      source: match[2] || "XPHB", // Default to XPHB if no source specified
    });
  }

  return classRefs;
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
 * Collect all unique class references from all page files by searching for getClass() calls.
 * Returns a Map keyed by "ClassName|Source" for uniqueness.
 */
export function collectAllClassReferences(): ClassReference[] {
  const classMap = new Map<string, ClassReference>();
  const pagesPath = path.resolve(PAGES_DIR);

  if (!fs.existsSync(pagesPath)) {
    console.warn(`[classes] Pages directory not found: ${pagesPath}`);
    return [];
  }

  const files = findAstroFiles(pagesPath);

  for (const filePath of files) {
    const refs = extractClassReferencesFromFile(filePath);
    for (const ref of refs) {
      const key = `${ref.name}|${ref.source}`;
      if (!classMap.has(key)) {
        classMap.set(key, ref);
      }
    }
  }

  return [...classMap.values()];
}

/**
 * @deprecated Use collectAllClassReferences() instead
 * Collect all unique class names from all page files by searching for getClass() calls.
 */
export function collectAllClassNames(): Set<string> {
  const refs = collectAllClassReferences();
  return new Set(refs.map((r) => r.name));
}
