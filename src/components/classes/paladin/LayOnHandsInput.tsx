"use client";
import React from "react";

import PointsCountInput from "@/components/common/PointsCountInput";
import { $layOnHands } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  layOnHandsMaximum: number;
}

export default function LayOnHandsInput({ layOnHandsMaximum }: Props) {
  const layOnHands = useStore($layOnHands);

  return (
    <span>
      <PointsCountInput current={layOnHands} defaultValue={layOnHandsMaximum} maximum={layOnHandsMaximum} onChange={$layOnHands.set} />
      &nbsp;/&nbsp;
      <span className="mono">{layOnHandsMaximum}</span>
    </span>
  );
}
