import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import type { Entry, Reference, ReferenceHTML, ReferenceRendered } from "./ReferenceTypes";
import { getSourceName } from "./ReferenceTypes";

// Singleton DOMPurify instance for Node.js (reused for performance)
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Strips all HTML tags from external input text
function sanitizeExternal(text: string): string {
  return purify.sanitize(text, { ALLOWED_TAGS: [] });
}

// Final sanitization that allows our custom elements
function sanitizeFinal(html: string): string {
  return purify.sanitize(html, { ADD_TAGS: ["highlight-5e"] });
}

// Renders 5etools tagged text (e.g., {@variantrule Initiative|XPHB}) - sanitizes input before processing
function renderTags(text: string): string {
  // First: sanitize input to strip any existing HTML from 5etools data
  const safeText = sanitizeExternal(text);

  // Then: add our own safe HTML tags
  return safeText
    .replace(/{@variantrule ([^}|]+)\|([^}|]+)\|([^}]+)}/g, "<highlight-5e>$3</highlight-5e>") // Use third part when available
    .replace(/{@variantrule ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>") // Fallback to first part
    .replace(/{@condition ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@action ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@scaledamage [^}|]+\|[^}|]+\|([^}]+)}/g, "<highlight-5e>$1</highlight-5e>") // Show increment only
    .replace(/{@dice ([^}]+)}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@damage ([^}]+)}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@spell ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@item ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@hazard ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@filter ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>");
}

// Recursively renders 5etools entry objects to HTML - sanitizes entry names before processing
function renderEntry(entry: Entry): string {
  if (typeof entry === "string") {
    return renderTags(entry);
  }

  if (entry.type === "entries" && entry.name) {
    // Sanitize entry name to strip any HTML
    const safeName = sanitizeExternal(entry.name);
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
    const safeByline = sanitizeExternal(reference.byline);
    html += `<p><em>${safeByline}</em></p>`;
  }

  // Add properties if present (e.g., spell casting time, range, components, duration)
  if (reference.properties) {
    const propertyLines = Object.entries(reference.properties)
      .map(([key, value]) => `<strong>${sanitizeExternal(key)}:</strong> ${sanitizeExternal(value)}`)
      .join("<br/>");
    html += `<p>${propertyLines}</p>`;
  }

  // Render entries
  html += reference.entries.map(renderEntry).join("<br/><br/>");

  // Final sanitization as safety net (reuses singleton purify instance)
  const sanitizedHtml = sanitizeFinal(html) as ReferenceHTML;

  return {
    name: reference.name,
    source: getSourceName(reference.source),
    html: sanitizedHtml,
  };
}
