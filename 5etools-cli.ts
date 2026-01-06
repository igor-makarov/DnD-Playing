#!/usr/bin/env tsx

import { getBackground } from "./src/js/utils/render-5etools/getBackground";
import { getClass, getClassFeaturesFull } from "./src/js/utils/render-5etools/getClass";
import { getClassFeature } from "./src/js/utils/render-5etools/getClassFeature";
import { getFeat } from "./src/js/utils/render-5etools/getFeat";
import { getSpecies } from "./src/js/utils/render-5etools/getSpecies";
import { getSpell } from "./src/js/utils/render-5etools/getSpell";
import { getWeaponMastery } from "./src/js/utils/render-5etools/getWeaponMastery";
import renderHTML from "./src/js/utils/render-5etools/renderHTML";
import renderMarkdown from "./src/js/utils/render-5etools/renderMarkdown";

function printUsage(): void {
  console.log(`Usage: 5etools <command> <name> [class] [source] [--html]

Commands:
  spell <name> [source]              Get spell information (default source: XPHB)
  species <name> [source]            Get species/race information (default source: XPHB)
  background <name> [source]         Get background information (default source: XPHB)
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
  5etools class Fighter --features
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

Options:
  --html      Output as HTML instead of Markdown
  --features  (class only) List class features by level
`);
}

async function main() {
  const args = process.argv.slice(2);
  const useHtml = args.includes("--html");
  const showFeatures = args.includes("--features");
  const filteredArgs = args.filter((arg) => arg !== "--html" && arg !== "--features");

  if (filteredArgs.length === 0 || filteredArgs[0] === "--help" || filteredArgs[0] === "-h") {
    printUsage();
    process.exit(0);
  }

  const command = filteredArgs[0];
  const name = filteredArgs[1];

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
          const source = filteredArgs[2] || "XPHB";
          reference = getSpell(name, source);
        }
        break;
      case "species":
        {
          const source = filteredArgs[2] || "XPHB";
          reference = getSpecies(name, source);
        }
        break;
      case "background":
        {
          const source = filteredArgs[2] || "XPHB";
          reference = getBackground(name, source);
        }
        break;
      case "feat":
        {
          const source = filteredArgs[2] || "XPHB";
          reference = getFeat(name, source);
        }
        break;
      case "class":
        {
          const source = filteredArgs[2] || "XPHB";
          reference = getClass(name, source);
          if (showFeatures) {
            const features = getClassFeaturesFull(name, source);
            // Group features by level
            const byLevel = new Map<number, typeof features>();
            for (const f of features) {
              if (!byLevel.has(f.level)) byLevel.set(f.level, []);
              byLevel.get(f.level)!.push(f);
            }
            // Add features as entries
            for (const [level, levelFeatures] of byLevel) {
              reference.entries.push({ type: "heading", name: `Level ${level}` });
              for (const feature of levelFeatures) {
                reference.entries.push({
                  type: "entries",
                  name: feature.name,
                  entries: feature.entries,
                });
              }
            }
          }
        }
        break;
      case "feature":
        {
          const className = filteredArgs[2];
          const source = filteredArgs[3] || "XPHB";
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
          const source = filteredArgs[2] || "XPHB";
          reference = getWeaponMastery(name, source);
        }
        break;
      default:
        console.error(`Error: Unknown command "${command}"\n`);
        printUsage();
        process.exit(1);
    }

    if (useHtml) {
      const { sanitizedHtml } = renderHTML(reference);
      console.log(sanitizedHtml);
    } else {
      const markdown = renderMarkdown(reference);
      console.log(markdown);
    }
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
