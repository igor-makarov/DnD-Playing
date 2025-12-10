import React from "react";

import type { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import LevelledSpellLevelSelectorClient from "./LevelledSpellLevelSelector.client";

interface LevelOption {
  level: number;
  damage: DiceString;
}

export interface Props {
  spellName: string;
  options: LevelOption[];
  optional?: boolean;
}

const LevelledSpellLevelSelector: React.FC<Props> = withAutoRehydration(LevelledSpellLevelSelectorClient);
export default LevelledSpellLevelSelector;
