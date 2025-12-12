import * as fs from "node:fs";
import * as path from "node:path";

import { href } from "react-router";

import { findFiles } from "./findFiles";

const ROUTES_DIR = "src/app/routes";

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
 * Collect all unique class references from all route files by searching for getClass() calls.
 * Returns a Map keyed by "ClassName|Source" for uniqueness.
 */
export function collectAllClassReferences(): ClassReference[] {
  const classMap = new Map<string, ClassReference>();
  const routesPath = path.resolve(ROUTES_DIR);

  if (!fs.existsSync(routesPath)) {
    console.warn(`[classes] Routes directory not found: ${routesPath}`);
    return [];
  }

  const files = findFiles(routesPath);

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

/**
 * Build URL path for a class page.
 */
export function classRoute(ref: ClassReference): string {
  return href("/classes/:class", { class: `${ref.name}-${ref.source}` });
}

/**
 * Collect URL paths for dynamic class routes.
 */
export function collectClassRoutes(): string[] {
  return collectAllClassReferences().map(classRoute);
}
