import React, { useRef } from "react";

import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

interface Props {
  reference: ReferenceRendered;
  children: React.ReactNode;
}

/**
 * Hybrid SSR/client component that renders an info tooltip as a clickable button.
 * Works with any 5etools reference data (feats, spells, items, etc.)
 * - Build time: HTML content is passed as a prop
 * - Runtime: Click opens a dialog with the pre-rendered content
 *
 * Use with client:load in Astro to enable click interaction.
 */
export default function InfoTooltip({ reference, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
        <h2>
          <span>{reference.name} </span>
          <span className="source">{reference.source}</span>
        </h2>
        <div dangerouslySetInnerHTML={{ __html: reference.html }} />
        <div className="button-container">
          <button onClick={handleClose}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
