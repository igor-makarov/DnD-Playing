import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import type { SpellSlotsForLevel } from "@/js/character/CharacterTypes";
import { $warlockSpellSlotsUsed } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  warlockSpellSlots?: SpellSlotsForLevel;
}

export default function WarlockSpellSlotsTable({ warlockSpellSlots }: Props) {
  const warlockSlotsUsed = useStore($warlockSpellSlotsUsed);
  const currentWarlockSlotsUsed = warlockSlotsUsed ?? 0;

  if (!warlockSpellSlots) {
    return null;
  }

  const handleChange = (newCount: number) => {
    $warlockSpellSlotsUsed.set(newCount > 0 ? newCount : undefined);
  };

  return (
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: "center" }} colSpan={2}>
            Warlock Spell Slots
          </th>
        </tr>
        <tr>
          <th>Level</th>
          <th className="modifier">Slots</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Level {warlockSpellSlots.level}</td>
          <td className="checkCell">
            <span style={{ display: "flex", gap: "4px", justifyContent: "end", paddingInlineEnd: "5px" }}>
              <CheckboxUsesRow maxUses={warlockSpellSlots.slots} currentUsed={currentWarlockSlotsUsed} onChange={handleChange} />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
