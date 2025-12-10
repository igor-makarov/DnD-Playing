import React from "react";

import type { DiceString } from "@/js/common/DiceString";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import LevelDamageSelectorClient from "./LevelDamageSelector.client";

interface LevelOption {
  level: number;
  damage: DiceString;
}

export interface Props {
  options: LevelOption[];
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  optional?: boolean;
}

const LevelDamageSelector: React.FC<Props> = withAutoRehydration(LevelDamageSelectorClient);
export default LevelDamageSelector;
