import React from "react";

import { useCharacterDynamicState } from "../../hooks/useCharacterDynamicState";
import type { SpellSlotsForLevel } from "../../js/character/CharacterTypes";

interface Props {
  spellSlots: SpellSlotsForLevel[];
  characterName?: string;
}

export default function SpellSlotsTable({ spellSlots }: Props) {
  const { spellSlotsSpent } = useCharacterDynamicState();
  const [usedSlotsData, setUsedSlotsData] = spellSlotsSpent;

  // Parse used slots counts from query state (format: hyphen-separated counts per level)
  // Example: "1-2-0" means 1 slot used at level 1, 2 slots used at level 2, 0 at level 3
  const parseUsedCounts = (): number[] => {
    if (!usedSlotsData) {
      return [];
    }
    return usedSlotsData.split("-").map((n) => parseInt(n, 10) || 0);
  };

  const usedCounts = parseUsedCounts();

  const isSlotUsed = (levelIndex: number, slotIndex: number): boolean => {
    const count = usedCounts[levelIndex] || 0;
    return slotIndex < count;
  };

  const toggleSlot = (levelIndex: number, slotIndex: number) => {
    const currentCount = usedCounts[levelIndex] || 0;
    // If clicking on an unchecked slot (at or beyond current count), increment by 1
    // If clicking on a checked slot (before current count), decrement by 1
    const newCount = slotIndex < currentCount ? currentCount - 1 : currentCount + 1;

    // Update URL with counts
    const newUsedCounts = Array.from({ length: spellSlots.length }, (_, i) => {
      if (i === levelIndex) return newCount;
      return usedCounts[i] || 0;
    });

    // Convert to hyphen-separated string, trimming trailing zeros
    let trimmedArray = [...newUsedCounts];
    while (trimmedArray.length > 0 && trimmedArray[trimmedArray.length - 1] === 0) {
      trimmedArray.pop();
    }

    const dataString = trimmedArray.length > 0 ? trimmedArray.join("-") : undefined;
    setUsedSlotsData(dataString);
  };

  if (spellSlots.length === 0) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: "center" }} colSpan={2}>
            Spell Slots
          </th>
        </tr>
        <tr>
          <th>Level</th>
          <th className="modifier">Slots</th>
        </tr>
      </thead>
      <tbody>
        {spellSlots.map(({ level, slots }, levelIndex) => {
          return (
            <tr key={level}>
              <td>Level {level}</td>
              <td className="checkCell">
                <span style={{ display: "flex", gap: "4px", justifyContent: "end", paddingInlineEnd: "5px" }}>
                  {Array.from({ length: slots }, (_, i) => (
                    <input key={i} type="checkbox" checked={isSlotUsed(levelIndex, i)} onChange={() => toggleSlot(levelIndex, i)} />
                  ))}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
