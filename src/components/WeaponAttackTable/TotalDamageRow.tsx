import React from "react";

import type { DiceString } from "../../js/DiceString";
import DamageCell from "../DamageCell";

interface TotalDamageRowProps {
  totalDamage: { damageRoll: DiceString; critRoll: DiceString } | null;
}
const TotalDamageRow: React.FC<TotalDamageRowProps> = ({ totalDamage }) => {
  return (
    <tr>
      <td>Total Damage</td>
      <td className="checkCell mono">{totalDamage && <DamageCell damageRoll={totalDamage.damageRoll} critRoll={totalDamage.critRoll} />}</td>
    </tr>
  );
};

export default TotalDamageRow;
