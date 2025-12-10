import React from "react";

import HitDiceRow from "@/components/HitDiceRow";
import type { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

interface Props {
  hitDice: Array<{ die: DiceString; count: number }>;
  conModifier: number;
}

export default withAutoRehydration(function HitDiceTable({ hitDice, conModifier }: Props) {
  if (hitDice.length === 0) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          <th style={{ textAlign: "center" }} colSpan={2}>
            Hit Dice
          </th>
        </tr>
        <tr>
          <th>Used</th>
          <th className="modifier">Die</th>
        </tr>
      </thead>
      <tbody>
        {hitDice.map(({ die, count }) => (
          <HitDiceRow key={die.toString()} die={die} count={count} conModifier={conModifier} />
        ))}
      </tbody>
    </table>
  );
});
