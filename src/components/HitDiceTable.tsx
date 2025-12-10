import React from "react";

import type { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import HitDiceTableClient from "./HitDiceTable.client";

export interface Props {
  hitDice: Array<{ die: DiceString; count: number }>;
  conModifier: number;
}

const HitDiceTable: React.FC<Props> = withAutoRehydration(HitDiceTableClient);
export default HitDiceTable;
