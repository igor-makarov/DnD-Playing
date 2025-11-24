import React from "react";

import { $layOnHands } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

import PointsCountInput from "./common/PointsCountInput";

interface Props {
  layOnHandsMaximum: number;
}

export default function LayOnHandsInput({ layOnHandsMaximum }: Props) {
  const layOnHands = useStore($layOnHands);

  return (
    <span className="mono">
      <PointsCountInput maximum={layOnHandsMaximum} current={layOnHands} onChange={$layOnHands.set} />
      &nbsp;/&nbsp;
      {layOnHandsMaximum}
    </span>
  );
}
