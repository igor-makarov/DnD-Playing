import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import type { SpellSlotsForLevel } from "@/js/character/CharacterTypes";
import { $spellSlotsSpent } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  spellSlots: SpellSlotsForLevel[];
  characterName?: string;
}

export default function SpellSlotsTable({ spellSlots }: Props) {
  const spellSlotsSpent = useStore($spellSlotsSpent);

  const currentSpellSlotsSpent = spellSlotsSpent ?? [];

  const handleChange = (levelIndex: number, newCount: number) => {
    // Update array with new counts
    const newSpellSlotsSpent = Array.from({ length: spellSlots.length }, (_, i) => {
      if (i === levelIndex) return newCount;
      return currentSpellSlotsSpent[i] || 0;
    });

    $spellSlotsSpent.set(newSpellSlotsSpent);
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
      </tbody>
    </table>
  );
}
