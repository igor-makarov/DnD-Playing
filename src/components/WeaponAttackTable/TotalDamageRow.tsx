import React from "react";

import AttackDamageCell from "@/components/common/AttackDamageCell";
import type { DiceString } from "@/js/common/DiceString";

interface Props {
  totalDamage: DiceString | null;
}

export default function TotalDamageRow({ totalDamage }: Props) {
  return (
    <tr>
      <td>Total Damage</td>
      <td className="checkCell mono">{totalDamage && <AttackDamageCell dice={totalDamage} />}</td>
    </tr>
  );
}
