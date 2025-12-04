import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import type { Entry, Reference, ReferenceHTML, ReferenceRendered } from "./ReferenceTypes";
import { getSourceName } from "./ReferenceTypes";

// Singleton DOMPurify instance for Node.js (reused for performance)
const window = new JSDOM("").window;
const purify = DOMPurify(window);

/**
 * Renders 5etools tagged text (e.g., {@variantrule Initiative|XPHB})
 * Sanitizes input before processing to strip any malicious HTML from source data
 */
function renderTags(text: string): string {
  // First: sanitize input to strip any existing HTML from 5etools data
  const safeText = purify.sanitize(text, { ALLOWED_TAGS: [] });

  // Then: add our own safe HTML tags
  return safeText
    .replace(/{@variantrule ([^}|]+)\|([^}|]+)\|([^}]+)}/g, "<em>$3</em>") // Use third part when available
    .replace(/{@variantrule ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>") // Fallback to first part
    .replace(/{@condition ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@dice ([^}]+)}/g, "$1")
    .replace(/{@damage ([^}]+)}/g, "$1")
    .replace(/{@spell ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@item ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@hazard ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>");
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
 * Renders 5etools reference data to a complete ReferenceRendered object
 *
 * Defense-in-depth approach:
 * 1. Input sanitization in renderTags() and renderEntry() strips malicious HTML from source
 * 2. Final output sanitization here as a safety net
 *
 * @param reference - The reference data (feat, spell, item, etc.)
 * @returns Complete rendered reference with name, readable source, and sanitized HTML
 */
export default function renderReference(reference: Reference): ReferenceRendered {
  let html = "";

  // Add byline if present
  if (reference.byline) {
    html += `<p><em>${reference.byline}</em></p>`;
  }

  // Add properties if present (e.g., spell casting time, range, components, duration)
  if (reference.properties) {
    const propertyLines = Object.entries(reference.properties)
      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
      .join("<br/>");
    html += `<p>${propertyLines}</p>`;
  }

  // Render entries
  html += reference.entries.map(renderEntry).join("<br/><br/>");

  // Final sanitization as safety net (reuses singleton purify instance)
  const sanitizedHtml = purify.sanitize(html) as ReferenceHTML;

  return {
    name: reference.name,
    source: getSourceName(reference.source),
    html: sanitizedHtml,
  };
}
