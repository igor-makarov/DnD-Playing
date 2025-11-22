import React from "react";

import type { DiceString } from "../../js/common/DiceString";
import DamageCell from "../DamageCell";

interface Props {
  totalDamage: { damageRoll: DiceString; critRoll: DiceString } | null;
}

export default function TotalDamageRow({ totalDamage }: Props) {
  return (
    <tr>
      <td>Total Damage</td>
      <td className="checkCell mono">{totalDamage && <DamageCell damageRoll={totalDamage.damageRoll} critRoll={totalDamage.critRoll} />}</td>
    </tr>
  );
}
