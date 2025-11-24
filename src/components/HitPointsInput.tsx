import { useStore } from "@nanostores/react";

import React from "react";

import { finishLongRest, finishShortRest } from "@/js/character/dynamic-state/rests";
import { $hitPoints } from "@/js/character/dynamic-state/stores";

import PointsCountInput from "./common/PointsCountInput";

interface Props {
  hitPointMaximum: number;
}

export default function HitPointsInput({ hitPointMaximum }: Props) {
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
        <button onClick={finishLongRest}>Long Rest</button>
      </span>
    </span>
  );
}
