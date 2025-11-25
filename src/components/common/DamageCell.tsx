import React from "react";

import { DiceString } from "@/js/common/DiceString";
import { useRollMode } from "@/js/hooks/useRollMode";
import { RollModifier, useRollModifiers } from "@/js/hooks/useRollModifiers";
import { getRollUrl } from "@/js/utils/rollOptions";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

interface Props {
  damageRoll: DiceString;
  attack?: boolean;
}

export default withAutoRehydration(function DamageCell({ damageRoll, attack }: Props) {
  const rollMode = useRollMode();
  const modifier = useRollModifiers();

  const critRoll = damageRoll.crit();

  const rollUrls = {
    [RollModifier.REGULAR]: getRollUrl(damageRoll, rollMode),
    [RollModifier.CRITICAL]: getRollUrl(critRoll, rollMode),
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
