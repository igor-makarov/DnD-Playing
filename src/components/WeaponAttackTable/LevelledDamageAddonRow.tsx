import React from "react";

import type { DamageAddonData, DamageData, DamageOptionsData } from "../../js/character/WeaponAttackTypes";

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
      return { damageRoll: option.damageRoll, critRoll: option.critRoll };
    }
    return null;
  };

  const addonDamage = getAddonDamage();

  return (
    <tr>
      <td>
        {addon.addon}
        &nbsp;
        <select value={selectedLevel} onChange={(e) => onLevelChange(parseInt(e.target.value))}>
          <option value={-1}>-</option>
          {addon.damage.options.map((opt) => (
            <option key={opt.level} value={opt.level}>
              Level {opt.level}
            </option>
          ))}
        </select>
      </td>
      <td className="checkCell mono">{addonDamage && addonDamage.damageRoll.toString()}</td>
    </tr>
  );
}
