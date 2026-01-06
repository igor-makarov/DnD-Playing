import type { Reference } from "./ReferenceTypes";
import { loadData } from "./loadData";

// Structure of background data from 5etools JSON files
interface BackgroundData {
  background: Array<Reference>;
}

/**
 * Get a background from the 5etools data by name and source.
 * This function should be called at build time or during server-side rendering.
 *
 * @param name - The background name (e.g., "Wayfarer")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The background reference data
 * @throws Error if background is not found
 */
export function getBackground(name: string, source: string = "XPHB"): Reference {
  const backgroundsData = loadData<BackgroundData>("backgrounds.json");
  const background = backgroundsData.background.find((b) => b.name.toLowerCase() === name.toLowerCase() && b.source === source);

  if (!background) {
    throw new Error(`Background "${name}" from source "${source}" not found in 5etools data`);
  }

  return background;
}
