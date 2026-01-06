import type { Entry, Reference } from "./ReferenceTypes";
import { getSourceName } from "./ReferenceTypes";

// Renders 5etools tagged text to markdown (similar to renderTags in renderReference.ts)
function renderTags(text: string): string {
  return text
    .replace(/{@variantrule ([^}|]+)\|([^}|]+)\|([^}]+)}/g, "**$3**") // Use third part when available
    .replace(/{@variantrule ([^}|]+)(\|[^}]+)?}/g, "**$1**") // Fallback to first part
    .replace(/{@condition ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@action ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@scaledamage [^}|]+\|[^}|]+\|([^}]+)}/g, "**$1**") // Show increment only
    .replace(/{@dice ([^}]+)}/g, "**$1**")
    .replace(/{@damage ([^}]+)}/g, "**$1**")
    .replace(/{@spell ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@item ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@hazard ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@filter ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@skill ([^}|]+)(\|[^}]+)?}/g, "**$1**")
    .replace(/{@feat ([^}|]+)(\|[^}]+)?}/g, "**$1**");
}

// Renders property data (key-value pairs) to markdown
function renderData(data: Array<{ key: string; value: string }>): string {
  return data.map(({ key, value }) => `**${key}:** ${value}`).join("\n");
}

// Recursively renders 5etools entry objects to markdown
function renderEntry(entry: Entry, indent: number = 0): string {
  if (typeof entry === "string") {
    return renderTags(entry);
  }

  // Handle properties entry (just data, no content)
  if (entry.type === "properties" && entry.data) {
    return renderData(entry.data);
  }

  // Handle heading (standalone, no children)
  if (entry.type === "heading" && entry.name) {
    return `## ${entry.name}`;
  }

  // Handle section as wrapper (no heading, just groups content)
  if (entry.type === "section") {
    return entry.entries?.map((e) => renderEntry(e, indent)).join("\n\n") || "";
  }

  if (entry.type === "entries" && entry.name) {
    const inner = entry.entries?.map((e) => renderEntry(e, indent)).join(" ") || "";
    return `**${entry.name}.** ${inner}`;
  }

  if (entry.type === "list" && entry.items) {
    const items = entry.items
      .map((item) => {
        const content = renderEntry(item, indent + 1);
        const prefix = "  ".repeat(indent);
        return `${prefix}- ${content}`;
      })
      .join("\n");
    return items;
  }

  // Handle "item" type with name and entry (singular) - used in backgrounds, etc.
  if (entry.type === "item" && entry.name && entry.entry) {
    return `**${entry.name}** ${renderTags(entry.entry)}`;
  }

  // Fallback for other types
  if (entry.entries) {
    return entry.entries.map((e) => renderEntry(e, indent)).join(" ");
  }

  return "";
}

/**
 * Renders 5etools reference data to markdown
 *
 * @param reference - The reference data (feat, spell, item, etc.)
 * @returns Markdown-formatted string
 */
export default function renderMarkdown(reference: Reference): string {
  let markdown = `# ${reference.name}\n`;
  markdown += `*Source: ${getSourceName(reference.source)}*\n\n`;

  // Add byline if present
  if (reference.byline) {
    markdown += `*${reference.byline}*\n\n`;
  }

  // Render entries
  const entryMarkdown = reference.entries.map((entry) => renderEntry(entry)).join("\n\n");

  markdown += entryMarkdown;

  return markdown;
}
