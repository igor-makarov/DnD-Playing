#!/usr/bin/env tsx

/**
 * Downloads character pages from Critical Role Miraheze wiki.
 *
 * Usage:
 *   npm run cr:download -- --campaign 4 --output critical-role/campaign-4-level-03.xml
 */

const WIKI_API = "https://criticalrole.miraheze.org/wiki/Special:Export";

const CAMPAIGNS: Record<number, string[]> = {
  4: [
    "Azune Nayar",
    "Bolaire Lathalia",
    "Halandil Fang",
    "Julien Davinos",
    "Kattigan Vale",
    "Murray Mag'Nesson",
    "Occtis Tachonis",
    "Teor Pridesire",
    "Thaisha Lloy",
    "Thimble",
    "Tyranny",
    "Vaelus",
    "Wicander Halovar",
  ].sort(),
};

async function downloadViaExport(characters: string[]): Promise<string> {
  const pages = characters.join("\n");

  const response = await fetch(WIKI_API, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      pages,
      curonly: "1",
    }),
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status}`);
  }

  return response.text();
}

function parseArgs(): { campaign: number; output: string } {
  const args = process.argv.slice(2);
  const campaignIndex = args.indexOf("--campaign");
  const outputIndex = args.indexOf("--output");

  if (campaignIndex === -1 || !args[campaignIndex + 1] || outputIndex === -1 || !args[outputIndex + 1]) {
    console.log("Usage: npm run cr:download -- --campaign <number> --output <file>");
    console.log();
    console.log("Options:");
    console.log("  --campaign <number>  Campaign number to download");
    console.log("  --output <file>      Output XML file path");
    console.log();
    console.log(`Available campaigns: ${Object.keys(CAMPAIGNS).join(", ")}`);
    process.exit(1);
  }

  const campaign = parseInt(args[campaignIndex + 1], 10);
  const output = args[outputIndex + 1];

  if (!CAMPAIGNS[campaign]) {
    console.error(`Unknown campaign: ${campaign}`);
    console.error(`Available campaigns: ${Object.keys(CAMPAIGNS).join(", ")}`);
    process.exit(1);
  }

  return { campaign, output };
}

async function main() {
  const { campaign, output } = parseArgs();
  const characters = CAMPAIGNS[campaign];

  console.log(`Downloading ${characters.length} Campaign ${campaign} characters...`);
  console.log(characters.map((c) => `  - ${c}`).join("\n"));
  console.log();

  try {
    const xml = await downloadViaExport(characters);

    const fs = await import("node:fs");
    fs.writeFileSync(output, xml);

    console.log(`Saved to ${output}`);

    const pageCount = (xml.match(/<page>/g) || []).length;
    console.log(`Downloaded ${pageCount} pages`);
  } catch (error) {
    console.error("Download failed:", (error as Error).message);
    process.exit(1);
  }
}

main();
