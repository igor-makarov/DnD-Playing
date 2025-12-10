import React from "react";

import type { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import LevelledSpellDamageCellClient from "./LevelledSpellDamageCell.client";

export interface Props {
  spellName: string;
  initialDamageRoll?: DiceString;
}

const LevelledSpellDamageCell: React.FC<Props> = withAutoRehydration(LevelledSpellDamageCellClient);
export default LevelledSpellDamageCell;
