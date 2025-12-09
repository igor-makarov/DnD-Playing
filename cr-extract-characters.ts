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
import { getCharacter } from "./src/js/utils/render-cr/getCharacter";
import { getCharacterNames } from "./src/js/utils/render-cr/loadData";
import renderMarkdown from "./src/js/utils/render-cr/renderMarkdown";

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

  if (listNames) {
    const names = getCharacterNames(inputFile);
    console.log(`Found ${names.length} main player characters:\n`);
    for (const name of names) {
      console.log(`- ${name}`);
    }
    return;
  }

  if (filterName) {
    try {
      const character = getCharacter(inputFile, filterName);
      console.log(renderMarkdown(character));
    } catch (error) {
      console.error((error as Error).message);
      const names = getCharacterNames(inputFile);
      console.error(`Available characters:`);
      for (const name of names) {
        console.error(`  - ${name}`);
      }
      process.exit(1);
    }
  }
}

main();
