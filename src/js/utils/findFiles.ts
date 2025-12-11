import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Recursively find all files with a given extension in a directory.
 * @param dir - The directory to search
 * @param extension - The file extension to match (default: ".tsx")
 */
export function findFiles(dir: string, extension = ".tsx"): string[] {
  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}
