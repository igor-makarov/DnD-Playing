import React from "react";

import { useCharacterDynamicState } from "../../hooks/useCharacterDynamicState";
import type { SpellSlotsForLevel } from "../../js/character/CharacterTypes";

interface Props {
  spellSlots: SpellSlotsForLevel[];
  characterName?: string;
}

export default function SpellSlotsTable({ spellSlots }: Props) {
  const [spellSlotsSpent, setSpellSlotsSpent] = useCharacterDynamicState().useSpellSlotsSpent;

  const currentSpellSlotsSpent = spellSlotsSpent ?? [];

  const isSlotUsed = (levelIndex: number, slotIndex: number): boolean => {
    const count = currentSpellSlotsSpent[levelIndex] || 0;
    return slotIndex < count;
  };

  const toggleSlot = (levelIndex: number, slotIndex: number) => {
    const currentCount = currentSpellSlotsSpent[levelIndex] || 0;
    // If clicking on an unchecked slot (at or beyond current count), increment by 1
    // If clicking on a checked slot (before current count), decrement by 1
    const newCount = slotIndex < currentCount ? currentCount - 1 : currentCount + 1;

    // Update array with new counts
    const newSpellSlotsSpent = Array.from({ length: spellSlots.length }, (_, i) => {
      if (i === levelIndex) return newCount;
      return currentSpellSlotsSpent[i] || 0;
    });

    setSpellSlotsSpent(newSpellSlotsSpent);
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
