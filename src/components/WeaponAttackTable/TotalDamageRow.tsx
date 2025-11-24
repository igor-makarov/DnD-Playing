import React from "react";

import DamageCell from "@/components/common/DamageCell";
import type { DiceString } from "@/js/common/DiceString";

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
