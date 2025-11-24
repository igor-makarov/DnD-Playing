import React from "react";

import { useCharacterDynamicState } from "../js/hooks/useCharacterDynamicState";
import PointsCountInput from "./common/PointsCountInput";

interface Props {
  layOnHandsMaximum: number;
}

export default function LayOnHandsInput({ layOnHandsMaximum }: Props) {
  const { useLayOnHands } = useCharacterDynamicState();
  const [layOnHands, setLayOnHands] = useLayOnHands;

  return (
    <span className="mono">
      <PointsCountInput maximum={layOnHandsMaximum} current={layOnHands} onChange={setLayOnHands} />
      &nbsp;/&nbsp;
      {layOnHandsMaximum}
    </span>
  );
}
