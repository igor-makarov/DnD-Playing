import React from "react";

import { finishLongRest, finishShortRest } from "@/js/character/dynamic-state/rests";
import { $hitPoints } from "@/js/character/dynamic-state/stores";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

import PointsCountInput from "./common/PointsCountInput";

interface Props {
  hitPointMaximum: number;
  hitDiceByType: Array<{ die: DiceString; count: number }>;
}

export default withAutoRehydration(function HitPointsInput({ hitPointMaximum, hitDiceByType }: Props) {
  const hitPoints = useStore($hitPoints);

  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span className="mono" style={{ flex: 1 }}>
        <PointsCountInput maximum={hitPointMaximum} current={hitPoints} onChange={$hitPoints.set} />
        &nbsp;/&nbsp;
        {hitPointMaximum}
      </span>
      <span style={{ justifyContent: "flex-end" }}>
        <button onClick={finishShortRest}>Short Rest</button>
        <button onClick={() => finishLongRest(hitDiceByType)}>Long Rest</button>
      </span>
    </span>
  );
});
