import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Singleton DOMPurify instance for Node.js (reused for performance)
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Generic 5etools entry types (used by feats, spells, items, etc.)
export type EntryString = string;
export type EntryObject = {
  type: string;
  name?: string;
  entries?: Array<EntryString | EntryObject>;
  items?: Array<EntryString | EntryObject>;
};
export type Entry = EntryString | EntryObject;

/**
 * Generic interface for 5etools reference data (feat, spell, item, etc.)
 */
export interface Reference {
  name: string;
  source: string;
  entries: Array<Entry>;
}

/**
 * Generic interface for rendered 5etools reference data
 */
export interface ReferenceRendered {
  name: string;
  source: string;
  html: string;
}

/**
 * Renders 5etools tagged text (e.g., {@variantrule Initiative|XPHB})
 * Sanitizes input before processing to strip any malicious HTML from source data
 */
export function renderTags(text: string): string {
  // First: sanitize input to strip any existing HTML from 5etools data
  const safeText = purify.sanitize(text, { ALLOWED_TAGS: [] });

  // Then: add our own safe HTML tags
  return safeText
    .replace(/{@variantrule ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@condition ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@dice ([^}]+)}/g, "$1")
    .replace(/{@damage ([^}]+)}/g, "$1")
    .replace(/{@spell ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@item ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>");
}

/**
 * Recursively renders 5etools entry objects to HTML
 * Sanitizes entry names before processing
 */
export function renderEntry(entry: Entry): string {
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
 * Renders 5etools entries to HTML string with sanitization
 *
 * Defense-in-depth approach:
 * 1. Input sanitization in renderTags() and renderEntry() strips malicious HTML from source
 * 2. Final output sanitization here as a safety net
 *
 * @param reference - The reference data (feat, spell, item, etc.)
 * @returns Sanitized HTML string of the description
 */
export function renderReferenceHtml(reference: Reference): string {
  const html = reference.entries.map(renderEntry).join("<br/><br/>");

  // Final sanitization as safety net (reuses singleton purify instance)
  return purify.sanitize(html);
}
