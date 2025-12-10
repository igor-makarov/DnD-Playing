import React from "react";

import { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";

import AttackDamageCellClient from "./AttackDamageCell.client";

export interface Props {
  dice: DiceString;
}

export default withAutoRehydration(AttackDamageCellClient);
