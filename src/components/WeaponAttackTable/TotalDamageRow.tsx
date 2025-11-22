import React from "react";

import type { DiceString } from "../../js/common/DiceString";
import DamageCell from "../common/DamageCell";

interface Props {
  totalDamage: DiceString | null;
}

export default function TotalDamageRow({ totalDamage }: Props) {
  return (
    <tr>
      <td>Total Damage</td>
      <td className="checkCell mono">{totalDamage && <DamageCell damageRoll={totalDamage} attack />}</td>
    </tr>
  );
}
