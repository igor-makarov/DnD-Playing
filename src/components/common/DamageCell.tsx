import React from "react";

import { useHash } from "../../hooks/useHash";
import { RollModifier, useRollModifiers } from "../../hooks/useRollModifiers";
import { DiceString } from "../../js/common/DiceString";
import { getRollUrl } from "../../js/utils/rollOptions";
import { withAutoRehydration } from "../../js/utils/withAutoRehydration";

interface Props {
  damageRoll: DiceString;
  attack?: boolean;
}

export default withAutoRehydration(function DamageCell({ damageRoll, attack }: Props) {
  const hash = useHash();
  const { modifier } = useRollModifiers();

  const diceAppKey = hash?.substring(1) || "app";

  const critRoll = damageRoll.crit();

  const rollUrls = {
    [RollModifier.REGULAR]: getRollUrl(damageRoll, diceAppKey),
    [RollModifier.CRITICAL]: getRollUrl(critRoll, diceAppKey),
  };

  const currentRoll = attack && modifier === RollModifier.CRITICAL ? critRoll : damageRoll;
  const currentUrl = attack && modifier === RollModifier.CRITICAL ? rollUrls[RollModifier.CRITICAL] : rollUrls[RollModifier.REGULAR];

  const mobileOptions = [
    { key: "damage", caption: damageRoll.toString(), url: rollUrls[RollModifier.REGULAR] },
    ...(attack ? [{ key: "crit", caption: "CRIT", url: rollUrls[RollModifier.CRITICAL] }] : []),
  ];

  return (
    <span className="mono check-cell">
      {/* Desktop view: single clickable element */}
      <span className="check-cell-desktop">
        <a className="dice-roll" href={currentUrl} title={attack ? "Hold C: critical" : undefined}>
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
