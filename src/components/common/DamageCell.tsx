import React from "react";

import { DiceString } from "@/js/common/DiceString";
import { RollModifier, useRollModifiers } from "@/js/hooks/useRollModifiers";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

import RollLink from "./RollLink";

interface Props {
  damageRoll: DiceString;
  attack?: boolean;
}

export default withAutoRehydration(function DamageCell({ damageRoll, attack }: Props) {
  const modifier = useRollModifiers();

  const isCritical = attack && modifier === RollModifier.CRITICAL;
  const currentRoll = isCritical ? damageRoll.crit() : damageRoll;

  const mobileOptions = [
    { key: "damage", caption: damageRoll.toString(), critical: false },
    ...(attack ? [{ key: "crit", caption: "CRIT", critical: true }] : []),
  ];

  return (
    <span className="mono check-cell">
      {/* Desktop view: single clickable element */}
      <span className="check-cell-desktop">
        <RollLink dice={damageRoll} critical={isCritical} title={attack ? "Hold C: critical" : undefined} />
      </span>

      {/* Mobile view: multiple links */}
      <span className="check-cell-mobile">
        {mobileOptions.map((option, index) => (
          <React.Fragment key={option.key}>
            {index > 0 && <>&nbsp;</>}
            <RollLink dice={damageRoll} critical={option.critical}>
              {option.caption}
            </RollLink>
          </React.Fragment>
        ))}
      </span>
    </span>
  );
});
