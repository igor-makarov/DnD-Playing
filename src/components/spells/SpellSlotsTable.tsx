import React from "react";

import { useQueryState } from "../../hooks/useQueryState";
import type { SpellSlotsForLevel } from "../../js/character/CharacterTypes";

interface Props {
  spellSlots: SpellSlotsForLevel[];
  characterName?: string;
}

export default function SpellSlotsTable({ spellSlots }: Props) {
  const [usedSlotsData, setUsedSlotsData] = useQueryState("spell-slots");

  // Parse used slots from query state (format: hyphen-separated used slots per level)
  // Example: "1-1-1-0" means 1 first level used, 1 second level used, 1 third level used, 0 fourth level used
  const parseUsedSlots = (): number[] => {
    if (!usedSlotsData) {
      return [];
    }
    return usedSlotsData.split("-").map((n) => parseInt(n, 10) || 0);
  };

  const usedSlots = parseUsedSlots();

  const toggleSlot = (levelIndex: number, slotIndex: number) => {
    const currentUsed = usedSlots[levelIndex] || 0;
    const newUsed = slotIndex < currentUsed ? slotIndex : slotIndex + 1;

    // Create new array with proper length
    const newUsedSlots = Array.from({ length: spellSlots.length }, (_, i) => usedSlots[i] || 0);
    newUsedSlots[levelIndex] = newUsed;

    // Convert to hyphen-separated string, trimming trailing zeros
    let trimmedArray = [...newUsedSlots];
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
          const used = usedSlots[levelIndex] || 0;
          return (
            <tr key={level}>
              <td>Level {level}</td>
              <td className="checkCell">
                <span style={{ display: "flex", gap: "4px", justifyContent: "end", paddingInlineEnd: "5px" }}>
                  {Array.from({ length: slots }, (_, i) => (
                    <input key={i} type="checkbox" checked={i < used} onChange={() => toggleSlot(levelIndex, i)} style={{ cursor: "pointer" }} />
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
