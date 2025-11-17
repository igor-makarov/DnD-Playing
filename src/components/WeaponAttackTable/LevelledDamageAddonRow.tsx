import React from "react";

import type { DamageAddonData, DamageData, DamageOptionsData } from "./WeaponAttackData";

interface LevelledDamageAddonRowProps {
  addon: DamageAddonData & { damage: DamageOptionsData };
  selectedLevel: number;
  onLevelChange: (level: number) => void;
}

const LevelledDamageAddonRow: React.FC<LevelledDamageAddonRowProps> = ({ addon, selectedLevel, onLevelChange }) => {
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
      <td className="checkCell mono">{addonDamage && addonDamage.damageRoll}</td>
    </tr>
  );
};

export default LevelledDamageAddonRow;
