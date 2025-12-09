import * as fs from "node:fs";
import * as path from "node:path";

import { collectAllClassReferences } from "./collectClassNames";
import { collectAllSubclassReferences } from "./collectSubclassNames";

const PAGES_DIR = "src/pages";

/**
 * Recursively find all .astro files and return their routes.
 * Excludes dynamic route files (those with [param] in the name).
 */
function collectStaticRoutes(dir: string, baseRoute: string = ""): string[] {
  const routes: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip directories that are dynamic routes
      if (entry.name.startsWith("[")) continue;
      routes.push(...collectStaticRoutes(fullPath, `${baseRoute}/${entry.name}`));
    } else if (entry.name.endsWith(".astro")) {
      // Skip dynamic route files
      if (entry.name.startsWith("[")) continue;

      if (entry.name === "index.astro") {
        // index.astro -> route is the directory path
        routes.push(baseRoute || "/");
      } else {
        // page.astro -> route is /directory/page
        const pageName = entry.name.replace(".astro", "");
        routes.push(`${baseRoute}/${pageName}`);
      }
    }
  }

  return routes;
}

/**
 * Collect routes from dynamic [class].astro pages.
 */
function collectClassRoutes(): string[] {
  return collectAllClassReferences().map((ref) => `/classes/${ref.name}-${ref.source}`);
}

/**
 * Collect routes from dynamic [subclass].astro pages.
 */
function collectSubclassRoutes(): string[] {
  return collectAllSubclassReferences().map(
    (ref) => `/subclasses/${ref.className}-${ref.classSource}-${ref.subclassShortName}-${ref.subclassSource}`,
  );
}

/**
 * Get all valid routes in the application.
 * Routes are normalized: start with /, no trailing slash.
 * Example: "/classes/Fighter-XPHB", "/characters/Azamat"
 */
export function getAllRoutes(): Set<string> {
  const pagesPath = path.resolve(PAGES_DIR);

  if (!fs.existsSync(pagesPath)) {
    console.warn(`[routes] Pages directory not found: ${pagesPath}`);
    return new Set();
  }

  const staticRoutes = collectStaticRoutes(pagesPath);
  const classRoutes = collectClassRoutes();
  const subclassRoutes = collectSubclassRoutes();

  return new Set([...staticRoutes, ...classRoutes, ...subclassRoutes]);
}
