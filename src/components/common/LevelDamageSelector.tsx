import React from "react";

import type { DiceString } from "../../js/common/DiceString";

interface LevelOption {
  level: number;
  damageRoll: DiceString;
}

interface Props {
  options: LevelOption[];
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  optional?: boolean;
}

export default function LevelDamageSelector({ options, selectedLevel, onLevelChange, optional = false }: Props) {
  return (
    <select value={selectedLevel} onChange={(e) => onLevelChange(parseInt(e.target.value))}>
      {optional && <option value={-1}>-</option>}
      {options.map((opt) => (
        <option key={opt.level} value={opt.level}>
          Level {opt.level}
        </option>
      ))}
    </select>
  );
}
