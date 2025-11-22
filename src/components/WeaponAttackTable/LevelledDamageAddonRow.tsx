import React from "react";

import type { DamageAddonData, DamageData, DamageOptionsData } from "../../js/character/WeaponAttackTypes";
import LevelDamageSelector from "../common/LevelDamageSelector";

interface Props {
  addon: DamageAddonData & { damage: DamageOptionsData };
  selectedLevel: number;
  onLevelChange: (level: number) => void;
}

export default function LevelledDamageAddonRow({ addon, selectedLevel, onLevelChange }: Props) {
  const getAddonDamage = (): DamageData | null => {
    if (selectedLevel === -1) {
      return null; // Off state
    }
    const option = addon.damage.options.find((opt) => opt.level === selectedLevel);
    if (option) {
      return { damage: option.damage };
    }
    return null;
  };

  const addonDamage = getAddonDamage();

  return (
    <tr>
      <td>
        {addon.addon}
        &nbsp;
        <LevelDamageSelector options={addon.damage.options} selectedLevel={selectedLevel} onLevelChange={onLevelChange} optional={true} />
      </td>
      <td className="checkCell mono">{addonDamage && addonDamage.damage.toString()}</td>
    </tr>
  );
}
