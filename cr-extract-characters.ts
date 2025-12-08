#!/usr/bin/env tsx

/**
 * Extracts main player character wiki pages from Critical Role Campaign 4 MediaWiki XML export.
 *
 * Usage:
 *   npm run cr-extract <input-file> --names      - List character names only
 *   npm run cr-extract <input-file> --name <n>   - Output single character by name
 *
 * Parses pages tagged with [[Category:Main player characters]] and outputs raw wikitext.
 */
import * as fs from "fs";

interface Character {
  name: string;
  rawWikitext: string;
}

function parseCharacter(title: string, wikitext: string): Character | null {
  // Check if it's a main player character
  if (!wikitext.includes("[[Category:Main player characters]]")) {
    return null;
  }

  return {
    name: title,
    rawWikitext: wikitext,
  };
}

function parseXML(xmlContent: string): Character[] {
  const characters: Character[] = [];

  // Simple XML parsing - find all <page> elements
  const pageRegex = /<page>([\s\S]*?)<\/page>/g;
  let match;

  while ((match = pageRegex.exec(xmlContent)) !== null) {
    const pageContent = match[1];

    // Extract title
    const titleMatch = pageContent.match(/<title>([^<]+)<\/title>/);
    if (!titleMatch) continue;
    const title = titleMatch[1];

    // Extract wikitext content
    const textMatch = pageContent.match(/<text[^>]*>([\s\S]*?)<\/text>/);
    if (!textMatch) continue;

    // Decode XML entities
    let wikitext = textMatch[1];
    wikitext = wikitext.replace(/&lt;/g, "<");
    wikitext = wikitext.replace(/&gt;/g, ">");
    wikitext = wikitext.replace(/&amp;/g, "&");
    wikitext = wikitext.replace(/&quot;/g, '"');

    const character = parseCharacter(title, wikitext);
    if (character) {
      characters.push(character);
    }
  }

  return characters;
}

function formatCharacter(char: Character): string {
  return `# ${char.name}\n\n${char.rawWikitext}`;
}

function main() {
  const args = process.argv.slice(2);
  const listNames = args.includes("--names");
  const nameIndex = args.indexOf("--name");
  const filterName = nameIndex !== -1 ? args[nameIndex + 1] : undefined;
  const inputFile = args.find((arg, i) => !arg.startsWith("--") && args[i - 1] !== "--name");

  if (!inputFile) {
    console.error(`Usage: npm run cr-extract <input-file> (--names | --name <name>)`);
    process.exit(1);
  }

  if (!listNames && !filterName) {
    console.error(`Error: Either --names or --name <name> is required`);
    console.error(`Usage: npm run cr-extract <input-file> (--names | --name <name>)`);
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: File not found: ${inputFile}`);
    process.exit(1);
  }

  const xmlContent = fs.readFileSync(inputFile, "utf-8");
  const characters = parseXML(xmlContent);

  if (listNames) {
    console.log(`Found ${characters.length} main player characters:\n`);
    for (const char of characters) {
      console.log(`- ${char.name}`);
    }
    return;
  }

  if (filterName) {
    const char = characters.find((c) => c.name.toLowerCase() === filterName.toLowerCase() || c.name.toLowerCase().includes(filterName.toLowerCase()));
    if (!char) {
      console.error(`Character not found: ${filterName}`);
      console.error(`Available characters:`);
      for (const c of characters) {
        console.error(`  - ${c.name}`);
      }
      process.exit(1);
    }
    console.log(formatCharacter(char));
  }
}

main();
