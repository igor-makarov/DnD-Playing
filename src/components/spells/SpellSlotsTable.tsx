import React from "react";

import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import type { SpellSlotsForLevel } from "@/js/character/CharacterTypes";
import { $spellSlotsSpent, $warlockSpellSlotsUsed } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  spellSlots: SpellSlotsForLevel[];
  warlockSpellSlots?: SpellSlotsForLevel;
  characterName?: string;
}

export default function SpellSlotsTable({ spellSlots, warlockSpellSlots }: Props) {
  const spellSlotsSpent = useStore($spellSlotsSpent);
  const warlockSlotsUsed = useStore($warlockSpellSlotsUsed);

  const currentSpellSlotsSpent = spellSlotsSpent ?? [];
  const currentWarlockSlotsUsed = warlockSlotsUsed ?? 0;

  const handleChange = (levelIndex: number, newCount: number) => {
    // Update array with new counts
    const newSpellSlotsSpent = Array.from({ length: spellSlots.length }, (_, i) => {
      if (i === levelIndex) return newCount;
      return currentSpellSlotsSpent[i] || 0;
    });

    $spellSlotsSpent.set(newSpellSlotsSpent);
  };

  if (spellSlots.length === 0 && !warlockSpellSlots) {
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
                  <CheckboxUsesRow
                    maxUses={slots}
                    currentUsed={currentSpellSlotsSpent[levelIndex] || 0}
                    onChange={(newCount) => handleChange(levelIndex, newCount)}
                  />
                </span>
              </td>
            </tr>
          );
        })}
        {warlockSpellSlots && (
          <tr key="warlock">
            <td>[Warlock] Level {warlockSpellSlots.level}</td>
            <td className="checkCell">
              <span style={{ display: "flex", gap: "4px", justifyContent: "end", paddingInlineEnd: "5px" }}>
                <CheckboxUsesRow
                  maxUses={warlockSpellSlots.slots}
                  currentUsed={currentWarlockSlotsUsed}
                  onChange={(newCount) => $warlockSpellSlotsUsed.set(newCount)}
                />
              </span>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
