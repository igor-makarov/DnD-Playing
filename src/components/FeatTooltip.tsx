import React, { useRef } from "react";

import type { Feat } from "@/js/utils/getFeat";

type EntryString = string;
type EntryObject = {
  type: string;
  name?: string;
  entries?: Array<EntryString | EntryObject>;
  items?: Array<EntryString | EntryObject>;
};
type Entry = EntryString | EntryObject;

interface Props {
  featName: string;
  featData: Feat;
  children: React.ReactNode;
}

/**
 * Renders 5etools tagged text (e.g., {@variantrule Initiative|XPHB})
 */
function renderTags(text: string): string {
  return text
    .replace(/{@variantrule ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@condition ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@dice ([^}]+)}/g, "$1")
    .replace(/{@spell ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>")
    .replace(/{@item ([^}|]+)(\|[^}]+)?}/g, "<em>$1</em>");
}

/**
 * Recursively renders 5etools entry objects
 */
function renderEntry(entry: Entry): string {
  if (typeof entry === "string") {
    return renderTags(entry);
  }

  if (entry.type === "entries" && entry.name) {
    const inner = entry.entries?.map(renderEntry).join(" ") || "";
    return `<strong>${entry.name}:</strong> ${inner}`;
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
 * Hybrid SSR/client component that renders a feat name as a clickable button.
 * - Build time: Feat data is passed as a prop and description is rendered to HTML
 * - Runtime: Click opens a dialog with the pre-rendered content
 *
 * Use with client:load in Astro to enable click interaction.
 * Feat data should be extracted in Astro frontmatter to avoid bundling entire feats.json.
 */
export default function FeatTooltip({ featName, featData, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Render entries at build time
  const descriptionHtml = featData.entries.map(renderEntry).join("<br/><br/>");

  // Runtime handlers
  const handleClick = () => {
    dialogRef.current?.showModal();
  };

  const handleClose = () => {
    dialogRef.current?.close();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Close dialog when clicking on the backdrop (outside the dialog content)
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  return (
    <>
      <button onClick={handleClick} className="info-tooltip-button">
        {children}
      </button>
      <dialog ref={dialogRef} onClick={handleBackdropClick} className="info-tooltip-dialog">
        <h2>{featName}</h2>
        <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        <button onClick={handleClose} className="close-button">
          Close
        </button>
      </dialog>
    </>
  );
}
