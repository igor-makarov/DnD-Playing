import React from "react";

import type { DiceString } from "../../js/common/DiceString";
import { withAutoRehydration } from "../../js/utils/withAutoRehydration";

interface LevelOption {
  level: number;
  damage: DiceString;
}

interface Props {
  options: LevelOption[];
  selectedLevel: number;
  onLevelChange: (level: number) => void;
  optional?: boolean;
}

export default withAutoRehydration(function LevelDamageSelector({ options, selectedLevel, onLevelChange, optional = false }: Props) {
  return (
    <select value={selectedLevel} onChange={(e) => onLevelChange(parseInt(e.target.value))} style={{ maxWidth: "30pt" }}>
      {optional && <option value={-1}>-</option>}
      {options.map((opt) => {
        const average = opt.damage.average();
        return (
          <option key={opt.level} value={opt.level}>
            {opt.level} {opt.damage.toString()} ({average})
          </option>
        );
      })}
    </select>
  );
});
