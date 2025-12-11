import type { DiceString } from "@/js/common/DiceString";

import TinyDropdown from "./TinyDropdown";

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

export default function LevelDamageSelector({ options, selectedLevel, onLevelChange, optional = false }: Props) {
  const displayText = selectedLevel === -1 ? "-" : `Level ${selectedLevel}`;

  return (
    <TinyDropdown value={selectedLevel} onChange={(value) => onLevelChange(parseInt(value))} displayText={displayText}>
      {optional && <option value={-1}>-</option>}
      {options.map((opt) => {
        const average = opt.damage.average();
        return (
          <option key={opt.level} value={opt.level}>
            Level {opt.level} - {opt.damage.toString()} ({average})
          </option>
        );
      })}
    </TinyDropdown>
  );
}
