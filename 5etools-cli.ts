#!/usr/bin/env tsx

import { getFeat } from "./src/js/utils/render-5etools/getFeat";
import { getSpecies } from "./src/js/utils/render-5etools/getSpecies";
import { getSpell } from "./src/js/utils/render-5etools/getSpell";
import renderMarkdown from "./src/js/utils/render-5etools/renderMarkdown";

function printUsage(): void {
  console.log(`Usage: 5etools <command> <name> [source]

Commands:
  spell <name> [source]    Get spell information (default source: XPHB)
  species <name> [source]  Get species/race information (default source: XPHB)
  feat <name> [source]     Get feat information (default source: XPHB)

Examples:
  5etools spell Fireball
  5etools spell "Magic Missile" XPHB
  5etools species Human
  5etools feat Alert

Common sources:
  XPHB  - Player's Handbook 2024
  PHB   - Player's Handbook 2014
  XGE   - Xanathar's Guide to Everything
  TCE   - Tasha's Cauldron of Everything
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printUsage();
    process.exit(0);
  }

  const command = args[0];
  const name = args[1];
  const source = args[2] || "XPHB";

  if (!name) {
    console.error(`Error: Missing name argument\n`);
    printUsage();
    process.exit(1);
  }

  try {
    let reference;

    switch (command) {
      case "spell":
        reference = getSpell(name, source);
        break;
      case "species":
        reference = getSpecies(name, source);
        break;
      case "feat":
        reference = getFeat(name, source);
        break;
      default:
        console.error(`Error: Unknown command "${command}"\n`);
        printUsage();
        process.exit(1);
    }

    const markdown = renderMarkdown(reference);
    console.log(markdown);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error(`Error: ${String(error)}`);
    }
    process.exit(1);
  }
}

main();
