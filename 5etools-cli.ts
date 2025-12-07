#!/usr/bin/env tsx

import { getClass } from "./src/js/utils/render-5etools/getClass";
import { getClassFeature } from "./src/js/utils/render-5etools/getClassFeature";
import { getFeat } from "./src/js/utils/render-5etools/getFeat";
import { getSpecies } from "./src/js/utils/render-5etools/getSpecies";
import { getSpell } from "./src/js/utils/render-5etools/getSpell";
import { getWeaponMastery } from "./src/js/utils/render-5etools/getWeaponMastery";
import renderMarkdown from "./src/js/utils/render-5etools/renderMarkdown";

function printUsage(): void {
  console.log(`Usage: 5etools <command> <name> [class] [source]

Commands:
  spell <name> [source]              Get spell information (default source: XPHB)
  species <name> [source]            Get species/race information (default source: XPHB)
  feat <name> [source]               Get feat information (default source: XPHB)
  class <name> [source]              Get class information (default source: XPHB)
  feature <name> <class> [source]    Get class feature information (default source: XPHB)
  mastery <name> [source]            Get weapon mastery information (default source: XPHB)

Examples:
  5etools spell Fireball
  5etools spell "Magic Missile" XPHB
  5etools species Human
  5etools feat Alert
  5etools class Fighter
  5etools class Wizard XPHB
  5etools feature "Second Wind" Fighter
  5etools feature "Action Surge" Fighter XPHB
  5etools mastery Vex
  5etools mastery Topple XPHB

Available classes:
  Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard

Available weapon masteries:
  Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex

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

  if (!name) {
    console.error(`Error: Missing name argument\n`);
    printUsage();
    process.exit(1);
  }

  try {
    let reference;

    switch (command) {
      case "spell":
        {
          const source = args[2] || "XPHB";
          reference = getSpell(name, source);
        }
        break;
      case "species":
        {
          const source = args[2] || "XPHB";
          reference = getSpecies(name, source);
        }
        break;
      case "feat":
        {
          const source = args[2] || "XPHB";
          reference = getFeat(name, source);
        }
        break;
      case "class":
        {
          const source = args[2] || "XPHB";
          reference = getClass(name, source);
        }
        break;
      case "feature":
        {
          const className = args[2];
          const source = args[3] || "XPHB";
          if (!className) {
            console.error(`Error: Missing class name for feature command\n`);
            printUsage();
            process.exit(1);
          }
          reference = getClassFeature(name, className, source);
        }
        break;
      case "mastery":
        {
          const source = args[2] || "XPHB";
          reference = getWeaponMastery(name, source);
        }
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
