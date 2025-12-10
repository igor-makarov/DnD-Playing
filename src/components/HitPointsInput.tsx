import React from "react";

import type { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import HitPointsInputClient from "./HitPointsInput.client";

export interface Props {
  hitPointMaximum: number;
  hitDiceByType: Array<{ die: DiceString; count: number }>;
}

const HitPointsInput: React.FC<Props> = withAutoRehydration(HitPointsInputClient);
export default HitPointsInput;
