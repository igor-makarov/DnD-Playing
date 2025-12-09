import type { Character } from "./CRTypes";
import { loadData } from "./loadData";

/**
 * Get a character from a Critical Role MediaWiki XML export by name.
 *
 * @param xmlPath - Absolute path to the XML export file
 * @param name - Character name to search for (case-insensitive, supports partial match)
 * @returns The character data
 * @throws Error if character is not found
 */
export function getCharacter(xmlPath: string, name: string): Character {
  const characters = loadData(xmlPath);
  const nameLower = name.toLowerCase();

  // Try exact match first, then partial match
  const character = characters.find((c) => c.name.toLowerCase() === nameLower) || characters.find((c) => c.name.toLowerCase().includes(nameLower));

  if (!character) {
    const available = characters.map((c) => c.name).join(", ");
    throw new Error(`Character "${name}" not found. Available: ${available}`);
  }

  return character;
}
