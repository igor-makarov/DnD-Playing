import React from "react";

interface Props {
  maxUses: number;
  currentUsed: number;
  onChange: (currentUsed: number) => void;
}

export default function CheckboxUsesRow({ maxUses, currentUsed, onChange }: Props) {
  const isSlotUsed = (index: number): boolean => {
    return index < currentUsed;
  };

  return (
    <>
      {Array.from({ length: maxUses }, (_, i) => (
        <input
          key={i}
          type="checkbox"
          checked={isSlotUsed(i)}
          onChange={() => onChange(isSlotUsed(i) ? currentUsed - 1 : currentUsed + 1)}
          style={{ marginRight: i < maxUses - 1 ? "4px" : "0" }}
        />
      ))}
    </>
  );
}
