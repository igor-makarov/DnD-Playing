import fs from "node:fs";
import path from "node:path";

// Base path to 5etools data (resolved at build time)
const DATA_DIR = path.resolve("5etools/data");

// Cache for loaded data (persists for duration of build)
const cache = new Map<string, unknown>();

/**
 * Load JSON data from a file in the 5etools data directory.
 * Results are cached to avoid redundant file reads during build.
 *
 * @param relativePath - Path relative to 5etools/data (e.g., "feats.json" or "spells/spells-xphb.json")
 * @returns The parsed JSON data
 * @throws Error if file is not found
 */
export function loadData<T>(relativePath: string): T {
  const cached = cache.get(relativePath);
  if (cached) {
    return cached as T;
  }

  const filePath = path.join(DATA_DIR, relativePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file "${relativePath}" not found in 5etools data`);
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContent) as T;

  cache.set(relativePath, data);

  return data;
}
