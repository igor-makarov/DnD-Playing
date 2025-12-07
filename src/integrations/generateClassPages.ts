import type { AstroIntegration } from "astro";
import * as fs from "node:fs";
import * as path from "node:path";

import { getClass, getClassFeaturesFull } from "../js/utils/render-5etools/getClass";
import renderHTML from "../js/utils/render-5etools/renderHTML";

const CHARACTER_DIR = "src/js/characters";
const OUTPUT_DIR = "src/pages/classes";

/**
 * Extract class names from character files by parsing the classLevels array.
 */
function extractClassNamesFromFile(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const classNames: string[] = [];

  // Match classLevels array entries: { className: "ClassName", level: N }
  const classLevelRegex = /className:\s*["'](\w+)["']/g;
  let match;
  while ((match = classLevelRegex.exec(content)) !== null) {
    classNames.push(match[1]);
  }

  return classNames;
}

/**
 * Collect all unique class names from all character files.
 */
function collectAllClassNames(): Set<string> {
  const classNames = new Set<string>();
  const charactersPath = path.resolve(CHARACTER_DIR);

  if (!fs.existsSync(charactersPath)) {
    console.warn(`[generateClassPages] Characters directory not found: ${charactersPath}`);
    return classNames;
  }

  const files = fs.readdirSync(charactersPath).filter((f) => f.endsWith("Character.ts"));

  for (const file of files) {
    const filePath = path.join(charactersPath, file);
    const names = extractClassNamesFromFile(filePath);
    for (const name of names) {
      classNames.add(name);
    }
  }

  return classNames;
}

/**
 * Generate HTML for a D&D class using 5etools data, including all class features.
 */
function generateClassHTML(className: string): string {
  const classRef = getClass(className, "XPHB");

  // Add class features grouped by level
  const features = getClassFeaturesFull(className, "XPHB");
  const byLevel = new Map<number, typeof features>();
  for (const f of features) {
    if (!byLevel.has(f.level)) byLevel.set(f.level, []);
    byLevel.get(f.level)!.push(f);
  }

  for (const [level, levelFeatures] of byLevel) {
    for (const feature of levelFeatures) {
      classRef.entries.push({ type: "heading", name: `Level ${level}: ${feature.name}` });
      classRef.entries = [...classRef.entries, ...feature.entries];
    }
  }

  const { sanitizedHtml } = renderHTML(classRef);
  return sanitizedHtml;
}

/**
 * Generate all class pages based on characters.
 */
function generateAllClassPages(): void {
  console.log("[generateClassPages] Collecting class names from characters...");

  const classNames = collectAllClassNames();
  if (classNames.size === 0) {
    console.warn("[generateClassPages] No class names found in character files.");
    return;
  }

  console.log(`[generateClassPages] Found classes: ${[...classNames].join(", ")}`);

  // Ensure output directory exists
  const outputPath = path.resolve(OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Generate HTML file for each class
  for (const className of classNames) {
    try {
      const html = generateClassHTML(className);
      const frontmatter = `---
layout: ../../layouts/ReferenceLayout.astro
title: ${className}
---

`;
      const outputFile = path.join(outputPath, `${className.toLowerCase()}.md`);
      fs.writeFileSync(outputFile, frontmatter + html);
      console.log(`[generateClassPages] Generated: ${outputFile}`);
    } catch (error) {
      console.error(`[generateClassPages] Failed to generate ${className}:`, error);
    }
  }

  console.log("[generateClassPages] Done.");
}

/**
 * Astro integration that generates class pages before build.
 */
export default function generateClassPages(): AstroIntegration {
  return {
    name: "generate-class-pages",
    hooks: {
      "astro:config:setup": async () => {
        generateAllClassPages();
      },
      "astro:server:setup": async ({ server }) => {
        // Watch character files for changes during dev
        const charactersPath = path.resolve(CHARACTER_DIR);
        server.watcher.add(charactersPath);

        server.watcher.on("change", (changedPath) => {
          const isCharacterFile = changedPath.includes(CHARACTER_DIR) && changedPath.endsWith("Character.ts");

          if (isCharacterFile) {
            console.log(`[generateClassPages] File changed: ${path.basename(changedPath)}`);
            generateAllClassPages();
          }
        });

        console.log("[generateClassPages] Watching character files for changes...");
      },
    },
  };
}
