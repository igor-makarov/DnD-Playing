"use client";
import React from "react";

import LevelDamageSelector from "@/components/common/LevelDamageSelector";
import { useStore } from "@/js/hooks/useStore";
import { $spellLevelStore } from "@/stores/spellLevelStore";

import type { Props } from "./LevelledSpellLevelSelector";

export default function LevelledSpellLevelSelectorClient({ spellName, options, optional = false }: Props) {
  const spellData = useStore($spellLevelStore);

  const selectedLevel = spellData[spellName]?.level ?? options[0]?.level ?? 1;

  const handleLevelChange = (level: number) => {
    const option = options.find((opt) => opt.level === level);
    if (option) {
      $spellLevelStore.set((prev) => ({
        ...prev,
        [spellName]: { level, damageRoll: option.damage },
      }));
    }
  };

  return <LevelDamageSelector options={options} selectedLevel={selectedLevel} onLevelChange={handleLevelChange} optional={optional} />;
}
