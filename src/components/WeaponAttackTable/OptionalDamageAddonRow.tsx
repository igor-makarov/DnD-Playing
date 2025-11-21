import React from "react";

import type { DamageAddonData, OptionalDamageData } from "../../js/character/WeaponAttackTypes";

interface OptionalDamageAddonRowProps {
  addon: DamageAddonData & { damage: OptionalDamageData };
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const OptionalDamageAddonRow: React.FC<OptionalDamageAddonRowProps> = ({ addon, isEnabled, onToggle }) => {
  return (
    <tr>
      <td>
        {addon.addon}
        &nbsp;
        <input type="checkbox" checked={isEnabled} onChange={(e) => onToggle(e.target.checked)} />
      </td>
      <td className="checkCell mono">{isEnabled && addon.damage.damageRoll.toString()}</td>
    </tr>
  );
};

export default OptionalDamageAddonRow;
