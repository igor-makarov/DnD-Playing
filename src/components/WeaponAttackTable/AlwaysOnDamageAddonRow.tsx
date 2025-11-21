import React from "react";

import type { DamageAddonData, DamageData } from "../../js/character/WeaponAttackTypes";

interface AlwaysOnDamageAddonRowProps {
  addon: DamageAddonData & { damage: DamageData };
}

const AlwaysOnDamageAddonRow: React.FC<AlwaysOnDamageAddonRowProps> = ({ addon }) => {
  return (
    <tr>
      <td>{addon.addon}</td>
      <td className="checkCell mono">{addon.damage.damageRoll.toString()}</td>
    </tr>
  );
};

export default AlwaysOnDamageAddonRow;
