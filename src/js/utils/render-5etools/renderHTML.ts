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
    .replace(/{@filter ([^}|]+)(\|[^}]+)?}/g, "<highlight-5e>$1</highlight-5e>")
    .replace(/{@i ([^}]+)}/g, "<em>$1</em>")
    .replace(/{@b ([^}]+)}/g, "<strong>$1</strong>");
}

function renderProperties(entry: Entry & { type: "properties"; data: Array<{ key: string; value: string }> }): string {
  return entry.data.map(({ key, value }) => `<p class="property"><strong>${key}:</strong> ${value}</p>`).join("");
}

function renderList(entry: Entry & { type: "list"; items: Entry[] }): string {
  const items = entry.items.map((item) => `<li>${renderEntry(item)}</li>`).join("");
  return `<ul>${items}</ul>`;
}

function renderTable(entry: Entry & { type: "table"; rows: Array<Array<string | Entry>>; caption?: string; colLabels?: string[] }): string {
  let html = "<table>";
  if (entry.caption) {
    html += `<caption>${renderTags(entry.caption)}</caption>`;
  }
  if (entry.colLabels) {
    html += "<thead><tr>";
    html += entry.colLabels.map((label) => `<th>${renderTags(label)}</th>`).join("");
    html += "</tr></thead>";
  }
  html += "<tbody>";
  for (const row of entry.rows) {
    html += "<tr>";
    if (Array.isArray(row)) {
      html += row.map((cell) => `<td>${typeof cell === "string" ? renderTags(cell) : renderEntry(cell)}</td>`).join("");
    }
    html += "</tr>";
  }
  html += "</tbody></table>";
  return html;
}

function renderEntries(entry: Entry & { type: "entries"; entries?: Entry[]; name?: string }): string {
  if (entry.name) {
    const inner = entry.entries?.map(renderEntry).join(" ") || "";
    return `<p><strong>${entry.name}.</strong> ${inner}</p>`;
  }
  // Anonymous entries wrapper - render children as block elements
  return entry.entries?.map(renderEntry).join("") || "";
}

// Recursively renders 5etools entry objects to HTML
function renderEntry(entry: Entry): string {
  if (typeof entry === "string") {
    return renderTags(entry);
  }

  switch (entry.type) {
    case "properties":
      if (entry.data) return renderProperties(entry as Entry & { type: "properties"; data: Array<{ key: string; value: string }> });
      break;
    case "heading":
      if (entry.name) return `<h3>${entry.name}</h3>`;
      break;
    case "section":
      return entry.entries?.map(renderEntry).join("") || "";
    case "entries":
      return renderEntries(entry as Entry & { type: "entries"; entries?: Entry[]; name?: string });
    case "list":
      if (entry.items) return renderList(entry as Entry & { type: "list"; items: Entry[] });
      break;
    case "table":
      if (entry.rows) return renderTable(entry as Entry & { type: "table"; rows: Array<Array<string | Entry>> });
      break;
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

  // Final sanitization as safety net (reuses singleton purify instance)
  const sanitizedHtml = sanitizeFinalHTML(html) as ReferenceHTML;

  const fullLink = safeReference.fullLink;

  return { sanitizedHtml, fullLink };
}
