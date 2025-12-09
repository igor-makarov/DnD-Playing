import * as fs from "node:fs";
import * as path from "node:path";

const PAGES_DIR = "src/pages";

/**
 * Extract class names from a file by searching for getClass("ClassName") patterns.
 */
function extractClassNamesFromFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const classNames: string[] = [];

  // Match getClass("ClassName") calls
  const getClassRegex = /getClass\(["'](\w+)["']\)/g;
  let match;
  while ((match = getClassRegex.exec(content)) !== null) {
    classNames.push(match[1]);
  }

  return classNames;
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
 * Collect all unique class names from all page files by searching for getClass() calls.
 */
export function collectAllClassNames(): Set<string> {
  const classNames = new Set<string>();
  const pagesPath = path.resolve(PAGES_DIR);

  if (!fs.existsSync(pagesPath)) {
    console.warn(`[classes] Pages directory not found: ${pagesPath}`);
    return classNames;
  }

  const files = findAstroFiles(pagesPath);

  for (const filePath of files) {
    const names = extractClassNamesFromFile(filePath);
    for (const name of names) {
      classNames.add(name);
    }
  }

  return classNames;
}
