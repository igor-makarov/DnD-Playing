import React from "react";

import { useHash } from "../hooks/useHash";
import { RollModifier, useRollModifiers } from "../hooks/useRollModifiers";
import { DiceString } from "../js/common/DiceString";
import { withAutoRehydration } from "../js/utils/rehydrate";
import { getRollUrl } from "../js/utils/rollOptions";

interface DamageCellProps {
  damageRoll: DiceString;
  critRoll: DiceString;
}

const DamageCell: React.FC<DamageCellProps> = withAutoRehydration(({ damageRoll, critRoll }) => {
  const hash = useHash();
  const { modifier } = useRollModifiers();

  const diceAppKey = hash?.substring(1) || "app";

  const rollUrls = {
    [RollModifier.REGULAR]: getRollUrl(damageRoll, diceAppKey),
    [RollModifier.CRITICAL]: getRollUrl(critRoll, diceAppKey),
  };

  const currentRoll = modifier === RollModifier.CRITICAL ? critRoll : damageRoll;
  const currentUrl = modifier === RollModifier.CRITICAL ? rollUrls[RollModifier.CRITICAL] : rollUrls[RollModifier.REGULAR];

  const mobileOptions = [
    { key: "damage", caption: damageRoll.toString(), url: rollUrls[RollModifier.REGULAR] },
    { key: "crit", caption: "CRIT", url: rollUrls[RollModifier.CRITICAL] },
  ];

  return (
    <span className="mono check-cell">
      {/* Desktop view: single clickable element */}
      <span className="check-cell-desktop">
        <a className="dice-roll" href={currentUrl} title="Hold C: critical">
          [{currentRoll.toString()}]
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
  );
});

export default DamageCell;
