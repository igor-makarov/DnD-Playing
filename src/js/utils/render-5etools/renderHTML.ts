import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import type { Entry, Reference, ReferenceHTML, ReferenceRendered } from "./ReferenceTypes";
import { getSourceName } from "./ReferenceTypes";

// Singleton DOMPurify instance for Node.js (reused for performance)
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Strips all HTML tags from a string
function sanitizeExternalString(text: string): string {
  return purify.sanitize(text, { ALLOWED_TAGS: [] });
}

// Recursively sanitizes all strings in a JSON value
function sanitizeExternalObject<T>(value: T): T {
  if (value === null) {
    return value;
  } else if (typeof value === "boolean") {
    return value;
  } else if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return sanitizeExternalString(value) as T;
  } else if (Array.isArray(value)) {
    return value.map(sanitizeExternalObject) as T;
  } else if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeExternalObject(val);
    }
    return result as T;
  } else {
    throw new Error(`Unexpected type in JSON data: ${typeof value}`);
  }
}

// Final sanitization that allows our custom elements
function sanitizeFinalHTML(html: string): string {
  return purify.sanitize(html, { ADD_TAGS: ["highlight-5e"] });
}

// Renders 5etools tagged text (e.g., {@variantrule Initiative|XPHB})
function renderTags(text: string): string {
  return text
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

// Recursively renders 5etools entry objects to HTML
function renderEntry(entry: Entry): string {
  if (typeof entry === "string") {
    return renderTags(entry);
  }

  // Handle properties entry (just data, no content)
  if (entry.type === "properties" && entry.data) {
    return entry.data.map(({ key, value }) => `<p class="property"><strong>${key}:</strong> ${value}</p>`).join("");
  }

  // Handle heading (standalone, no children)
  if (entry.type === "heading" && entry.name) {
    return `<h3>${entry.name}</h3>`;
  }

  // Handle section as wrapper (no heading, just groups content)
  if (entry.type === "section") {
    return entry.entries?.map(renderEntry).join("") || "";
  }

  if (entry.type === "entries" && entry.name) {
    const inner = entry.entries?.map(renderEntry).join(" ") || "";
    return `<p><strong>${entry.name}.</strong> ${inner}</p>`;
  }

  // Handle anonymous entries wrapper (no name) - render children as block elements
  if (entry.type === "entries" && !entry.name) {
    return entry.entries?.map(renderEntry).join("") || "";
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
 * Renders 5etools reference data to a complete ReferenceRendered object with HTML
 *
 * Defense-in-depth approach:
 * 1. Input sanitization via sanitizeExternalObject() strips all HTML from source data
 * 2. Final output sanitization via sanitizeFinalHTML() as a safety net
 *
 * @param reference - The reference data (feat, spell, item, etc.)
 * @returns Complete rendered reference with name, readable source, and sanitized HTML
 */
export default function renderHTML(reference: Reference): ReferenceRendered {
  // Sanitize all strings in the input upfront
  const safeReference = sanitizeExternalObject(reference);

  // Start with heading and source
  let html = `<h1>${safeReference.name} <span class="source">${getSourceName(safeReference.source)}</span></h1>`;

  // Add byline if present
  if (safeReference.byline) {
    html += `<p class="byline"><em>${safeReference.byline}</em></p>`;
  }

  // Render entries
  html += safeReference.entries
    .map((entry) => {
      // Properties, sections, and lists handle their own wrapping
      if (typeof entry !== "string" && (entry.type === "properties" || entry.type === "section" || entry.type === "list")) {
        return renderEntry(entry);
      }
      // Everything else gets wrapped in a paragraph
      return `<p>${renderEntry(entry)}</p>`;
    })
    .join("");

  // Add full link at the end if present
  if (safeReference.fullLink) {
    html += `<p><a href="${safeReference.fullLink}" target="_blank" rel="noopener noreferrer">Full reference</a></p>`;
  }

  // Final sanitization as safety net (reuses singleton purify instance)
  const sanitizedHtml = sanitizeFinalHTML(html) as ReferenceHTML;

  return { sanitizedHtml };
}
