import React from "react";

import { $hitPoints } from "@/js/character/dynamic-state/stores";
import type { DiceString } from "@/js/common/DiceString";
import { useLongRest } from "@/js/hooks/useLongRest";
import { useShortRest } from "@/js/hooks/useShortRest";
import { useStore } from "@/js/hooks/useStore";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

import PointsCountInput from "./common/PointsCountInput";

interface Props {
  hitPointMaximum: number;
  hitDiceByType: Array<{ die: DiceString; count: number }>;
}

export default withAutoRehydration(function HitPointsInput({ hitPointMaximum, hitDiceByType }: Props) {
  const hitPoints = useStore($hitPoints);
  const { finishShortRest } = useShortRest();
  const { finishLongRest } = useLongRest(hitDiceByType);

  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span className="mono" style={{ flex: 1 }}>
        <PointsCountInput maximum={hitPointMaximum} current={hitPoints} onChange={$hitPoints.set} />
        &nbsp;/&nbsp;
        {hitPointMaximum}
      </span>
      <span style={{ justifyContent: "flex-end" }}>
        <button onClick={finishShortRest}>Short Rest</button>
        <button onClick={finishLongRest}>Long Rest</button>
      </span>
    </span>
  );
});
