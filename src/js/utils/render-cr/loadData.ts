import fs from "node:fs";
import { parseString } from "xml2js";

import type { Character, MediaWikiExport, MediaWikiPage } from "./CRTypes";

// Cache for parsed XML data (persists for duration of build)
const cache = new Map<string, Character[]>();

/**
 * Parse a single MediaWiki page into a Character if it's a main player character.
 */
function parseCharacter(page: MediaWikiPage): Character | null {
  const title = page.title?.[0];
  if (!title) return null;

  const textNode = page.revision?.[0]?.text?.[0];
  const wikitext = typeof textNode === "string" ? textNode : (textNode?._ ?? "");
  if (!wikitext) return null;

  // Only include pages tagged as main player characters
  if (!wikitext.includes("[[Category:Main player characters]]")) {
    return null;
  }

  return {
    name: title,
    rawWikitext: wikitext,
  };
}

/**
 * Load and parse Critical Role character data from a MediaWiki XML export file.
 * Results are cached to avoid redundant parsing during build.
 *
 * @param xmlPath - Absolute path to the XML export file
 * @returns Array of main player characters
 * @throws Error if file is not found or XML is invalid
 */
export function loadData(xmlPath: string): Character[] {
  const cached = cache.get(xmlPath);
  if (cached) {
    return cached;
  }

  if (!fs.existsSync(xmlPath)) {
    throw new Error(`XML file not found: ${xmlPath}`);
  }

  const xmlContent = fs.readFileSync(xmlPath, "utf-8");

  let result: MediaWikiExport = {};
  parseString(xmlContent, { async: false }, (err, parsed) => {
    if (err) throw new Error(`Failed to parse XML: ${err.message}`);
    result = parsed;
  });

  const pages = result.mediawiki?.page ?? [];
  const characters: Character[] = [];

  for (const page of pages) {
    const character = parseCharacter(page);
    if (character) {
      characters.push(character);
    }
  }

  cache.set(xmlPath, characters);

  return characters;
}

/**
 * Get list of all character names from a MediaWiki XML export.
 *
 * @param xmlPath - Absolute path to the XML export file
 * @returns Array of character names
 */
export function getCharacterNames(xmlPath: string): string[] {
  return loadData(xmlPath).map((c) => c.name);
}
