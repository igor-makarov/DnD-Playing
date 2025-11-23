import React from "react";

import { useCharacterDynamicState } from "../hooks/useCharacterDynamicState";
import PointsCountInput from "./common/PointsCountInput";

interface Props {
  hitPointMaximum: number;
}

export default function HitPointsInput({ hitPointMaximum }: Props) {
  const { useHitPoints, finishShortRest, finishLongRest } = useCharacterDynamicState();
  const [hitPoints, setHitPoints] = useHitPoints;

  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span className="mono" style={{ flex: 1 }}>
        <PointsCountInput maximum={hitPointMaximum} current={hitPoints} onChange={setHitPoints} />
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
