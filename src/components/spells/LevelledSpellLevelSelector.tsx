import React from "react";

import LevelDamageSelector from "@/components/common/LevelDamageSelector";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";
import { $spellLevelStore } from "@/stores/spellLevelStore";

interface LevelOption {
  level: number;
  damage: DiceString;
}

interface Props {
  spellName: string;
  options: LevelOption[];
  optional?: boolean;
}

export default withAutoRehydration(function LevelledSpellLevelSelector({ spellName, options, optional = false }: Props) {
  const spellData = useStore($spellLevelStore);

  // Initialize store with first option if spell not yet set
  if (!spellData[spellName] && options[0]) {
    $spellLevelStore.setKey(spellName, {
      level: options[0].level,
      damageRoll: options[0].damage,
    });
  }

  const selectedLevel = spellData[spellName]?.level ?? options[0]?.level ?? 1;

  const handleLevelChange = (level: number) => {
    const option = options.find((opt) => opt.level === level);
    if (option) {
      $spellLevelStore.setKey(spellName, { level, damageRoll: option.damage });
    }
  };

  return <LevelDamageSelector options={options} selectedLevel={selectedLevel} onLevelChange={handleLevelChange} optional={optional} />;
});
