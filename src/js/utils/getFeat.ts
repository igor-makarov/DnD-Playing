import featsData from "@5etools/data/feats.json";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Singleton DOMPurify instance for Node.js (reused for performance)
const window = new JSDOM("").window;
const purify = DOMPurify(window);

type EntryString = string;
type EntryObject = {
  type: string;
  name?: string;
  entries?: Array<EntryString | EntryObject>;
  items?: Array<EntryString | EntryObject>;
};
type Entry = EntryString | EntryObject;

export interface Feat {
  name: string;
  source: string;
  entries: Array<Entry>;
}

export interface FeatRendered {
  name: string;
  source: string;
  html: string;
}

/**
 * Get a feat from the 5etools data by name and source, with rendered HTML.
 * This function should be called at build time in Astro frontmatter.
 *
 * @param name - The feat name (e.g., "Alert")
 * @param source - The source book (default: "XPHB" for 2024 PHB)
 * @returns The feat data with rendered HTML
 * @throws Error if feat is not found
 */
export function getFeat(name: string, source: string = "XPHB"): FeatRendered {
  const feat = featsData.feat.find((f: any) => f.name === name && f.source === source);

  if (!feat) {
    throw new Error(`Feat "${name}" from source "${source}" not found in 5etools data`);
  }

  const featData = feat as Feat;

  return {
    name: featData.name,
    source: featData.source,
    html: renderFeatHtml(featData),
  };
}

/**
 * Renders 5etools tagged text (e.g., {@variantrule Initiative|XPHB})
 * Sanitizes input before processing to strip any malicious HTML from source data
 */
function renderTags(text: string): string {
  // First: sanitize input to strip any existing HTML from 5etools data
  const safeText = purify.sanitize(text, { ALLOWED_TAGS: [] });

  // Then: add our own safe HTML tags
  return safeText
    .replace(/{@variantrule ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@condition ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@dice ([^}]+)}/g, "$1")
    .replace(/{@spell ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@item ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>");
}

/**
 * Recursively renders 5etools entry objects to HTML
 * Sanitizes entry names before processing
 */
function renderEntry(entry: Entry): string {
  if (typeof entry === "string") {
    return renderTags(entry);
  }

  if (entry.type === "entries" && entry.name) {
    // Sanitize entry name to strip any HTML
    const safeName = purify.sanitize(entry.name, { ALLOWED_TAGS: [] });
    const inner = entry.entries?.map(renderEntry).join(" ") || "";
    return `<strong>${safeName}.</strong> ${inner}`;
  }

  if (entry.type === "list" && entry.items) {
    const items = entry.items.map((item) => `<li>${renderEntry(item)}</li>`).join("");
    return `<ul>${items}</ul>`;
  }

  // Fallback for other types
  if (entry.entries) {
    return entry.entries.map(renderEntry).join(" ");
  }

  return "";
}

/**
 * Renders feat entries to HTML string with sanitization
 *
 * Defense-in-depth approach:
 * 1. Input sanitization in renderTags() and renderEntry() strips malicious HTML from source
 * 2. Final output sanitization here as a safety net
 *
 * @param feat - The feat data
 * @returns Sanitized HTML string of the feat description
 */
export function renderFeatHtml(feat: Feat): string {
  const html = feat.entries.map(renderEntry).join("<br/><br/>");

  // Final sanitization as safety net (reuses singleton purify instance)
  return purify.sanitize(html);
}
