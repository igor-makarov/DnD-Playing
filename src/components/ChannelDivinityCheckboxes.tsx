import React from "react";

import { useCharacterDynamicState } from "../hooks/useCharacterDynamicState";

interface Props {
  maxUses: number;
}

export default function ChannelDivinityCheckboxes({ maxUses }: Props) {
  const { channelDivinityUsed } = useCharacterDynamicState();
  const [used, setUsed] = channelDivinityUsed;

  const isSlotUsed = (index: number): boolean => {
    return index < used;
  };

  const toggleSlot = (index: number) => {
    // If clicking on an unchecked slot (at or beyond current count), increment by 1
    // If clicking on a checked slot (before current count), decrement by 1
    const newCount = index < used ? used - 1 : used + 1;
    setUsed(newCount);
  };

  return (
    <span>
      {Array.from({ length: maxUses }, (_, i) => (
        <input
          key={i}
          type="checkbox"
          checked={isSlotUsed(i)}
          onChange={() => toggleSlot(i)}
          style={{ marginRight: i < maxUses - 1 ? "4px" : "0" }}
        />
      ))}{" "}
      short/long rest
    </span>
  );
}
