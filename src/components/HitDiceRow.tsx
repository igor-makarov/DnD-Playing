import React from "react";

import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import DamageCell from "@/components/common/DamageCell";
import { $hitDiceUsed } from "@/js/character/dynamic-state/stores";
import { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

interface Props {
  die: DiceString;
  count: number;
  conModifier: number;
}

export default function HitDiceRow({ die, count, conModifier }: Props) {
  const hitDiceUsed = useStore($hitDiceUsed);
  const dieKey = die.toString();
  const currentUsed = hitDiceUsed[dieKey] || 0;

  const dieWithModifier = new DiceString(die, conModifier);

  const handleChange = (newCount: number) => {
    $hitDiceUsed.setKey(dieKey, newCount > 0 ? newCount : undefined);
  };

  return (
    <tr>
      <td>
        <DamageCell damageRoll={dieWithModifier} attack={false} /> ({count})
      </td>
      <td className="checkCell">
        <span style={{ display: "flex", gap: "4px", justifyContent: "end", paddingInlineEnd: "5px" }}>
          <CheckboxUsesRow maxUses={count} currentUsed={currentUsed} onChange={handleChange} />
        </span>
      </td>
    </tr>
  );
}
