import React from "react";

import { DiceString } from "@/js/common/DiceString";
import { useRollModifiers } from "@/js/hooks/useRollModifiers";

import RollLink from "./RollLink";

export interface Props {
  dice: DiceString;
}

export default function AttackDamageCell({ dice }: Props) {
  const modifier = useRollModifiers();

  const isCritical = modifier === "CRITICAL";

  const mobileOptions = [
    { key: "damage", caption: dice.toString(), critical: false },
    { key: "crit", caption: "CRIT", critical: true },
  ];

  return (
    <span className="mono check-cell">
      {/* Desktop view: single clickable element */}
      <span className="check-cell-desktop">
        <RollLink dice={dice} critical={isCritical} title="Hold C: critical" />
      </span>

      {/* Mobile view: multiple links */}
      <span className="check-cell-mobile">
        {mobileOptions.map((option, index) => (
          <React.Fragment key={option.key}>
            {index > 0 && <>&nbsp;</>}
            <RollLink dice={dice} critical={option.critical}>
              {option.caption}
            </RollLink>
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}
