"use client";
import React from "react";

import { $hitPoints, $temporaryHitPoints } from "@/js/character/dynamic-state/stores";
import type { DiceString } from "@/js/common/DiceString";
import { useLongRest } from "@/js/hooks/useLongRest";
import { useShortRest } from "@/js/hooks/useShortRest";
import { useStore } from "@/js/hooks/useStore";

import PointsCountInput from "./common/PointsCountInput";

export interface Props {
  hitPointMaximum: number;
  hitDiceByType: Array<{ die: DiceString; count: number }>;
}

export default function HitPointsInput({ hitPointMaximum, hitDiceByType }: Props) {
  const hitPoints = useStore($hitPoints);
  const temporaryHitPoints = useStore($temporaryHitPoints);
  const { finishShortRest } = useShortRest();
  const { finishLongRest } = useLongRest(hitDiceByType);

  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      <span className=" short-input" style={{ flex: 1 }}>
        <PointsCountInput current={temporaryHitPoints} defaultValue={0} onChange={$temporaryHitPoints.set} data-testid="temp-hp-input" />
        &nbsp;(temp)&nbsp;
        <PointsCountInput
          current={hitPoints}
          defaultValue={hitPointMaximum}
          maximum={hitPointMaximum}
          onChange={$hitPoints.set}
          data-testid="hp-input"
        />
        &nbsp;/&nbsp;
        <span className="mono">{hitPointMaximum}</span>
        &nbsp;
      </span>
      <span style={{ justifyContent: "flex-end" }}>
        <button onClick={finishShortRest}>Short Rest</button>
        <button onClick={finishLongRest}>Long Rest</button>
      </span>
    </span>
  );
}
