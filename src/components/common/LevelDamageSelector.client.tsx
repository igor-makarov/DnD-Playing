"use client";
import React from "react";

import type { Props } from "./LevelDamageSelector";
import TinyDropdown from "./TinyDropdown";

export default function LevelDamageSelectorClient({ options, selectedLevel, onLevelChange, optional = false }: Props) {
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
