import React from "react";

import { RollModifier } from "../../hooks/useRollModifiers";
import { getRollUrl } from "../../js/rollOptions";

interface TotalDamageRowProps {
  totalDamage: { damageRoll: string; critRoll: string } | null;
  modifier: RollModifier;
  diceAppKey: string;
}

const TotalDamageRow: React.FC<TotalDamageRowProps> = ({ totalDamage, modifier, diceAppKey }) => {
  return (
    <tr>
      <td>Total Damage</td>
      <td className="checkCell modifier">
        {totalDamage && (
          <span className="mono">
            {/* Desktop view: single clickable element */}
            <span className="check-cell-desktop">
              <a
                className="dice-roll"
                href={
                  modifier === RollModifier.CRITICAL ? getRollUrl(totalDamage.critRoll, diceAppKey) : getRollUrl(totalDamage.damageRoll, diceAppKey)
                }
                title="Hold C: critical"
              >
                [{modifier === RollModifier.CRITICAL ? totalDamage.critRoll : totalDamage.damageRoll}]
              </a>
            </span>

            {/* Mobile view: multiple links */}
            <span className="check-cell-mobile">
              <a className="dice-roll" href={getRollUrl(totalDamage.damageRoll, diceAppKey)}>
                {totalDamage.damageRoll}
              </a>
              &nbsp;
              <a className="dice-roll" href={getRollUrl(totalDamage.critRoll, diceAppKey)}>
                CRIT
              </a>
            </span>
          </span>
        )}
      </td>
    </tr>
  );
};

export default TotalDamageRow;
