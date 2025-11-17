import React from "react";

import { RollModifier } from "../../hooks/useRollModifiers";
import { getRollUrl } from "../../js/rollOptions";

interface TotalDamageRowProps {
  totalDamage: { damageRoll: string; critRoll: string } | null;
  modifier: RollModifier;
  diceAppKey: string;
}

const TotalDamageRow: React.FC<TotalDamageRowProps> = ({ totalDamage, modifier, diceAppKey }) => {
  if (!totalDamage) {
    return (
      <tr>
        <td>Total Damage</td>
        <td className="checkCell mono"></td>
      </tr>
    );
  }

  const rollUrls = {
    [RollModifier.REGULAR]: getRollUrl(totalDamage.damageRoll, diceAppKey),
    [RollModifier.CRITICAL]: getRollUrl(totalDamage.critRoll, diceAppKey),
  };

  const currentRoll = modifier === RollModifier.CRITICAL ? totalDamage.critRoll : totalDamage.damageRoll;
  const currentUrl = modifier === RollModifier.CRITICAL ? rollUrls[RollModifier.CRITICAL] : rollUrls[RollModifier.REGULAR];

  const mobileOptions = [
    { key: "damage", caption: totalDamage.damageRoll, url: rollUrls[RollModifier.REGULAR] },
    { key: "crit", caption: "CRIT", url: rollUrls[RollModifier.CRITICAL] },
  ];

  return (
    <tr>
      <td>Total Damage</td>
      <td className="checkCell mono">
        <span>
          {/* Desktop view: single clickable element */}
          <span className="check-cell-desktop">
            <a className="dice-roll" href={currentUrl} title="Hold C: critical">
              [{currentRoll}]
            </a>
          </span>

          {/* Mobile view: multiple links */}
          <span className="check-cell-mobile">
            {mobileOptions.map((option, index) => (
              <React.Fragment key={option.key}>
                {index > 0 && <>&nbsp;</>}
                <a className="dice-roll" href={option.url}>
                  {option.caption}
                </a>
              </React.Fragment>
            ))}
          </span>
        </span>
      </td>
    </tr>
  );
};

export default TotalDamageRow;
