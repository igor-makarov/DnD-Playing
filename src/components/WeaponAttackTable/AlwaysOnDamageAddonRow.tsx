import React from "react";

import type { DamageAddonData, DamageData } from "./WeaponAttackData";

interface AlwaysOnDamageAddonRowProps {
  addon: DamageAddonData & { damage: DamageData };
}

const AlwaysOnDamageAddonRow: React.FC<AlwaysOnDamageAddonRowProps> = ({ addon }) => {
  return (
    <tr>
      <td>{addon.addon}</td>
      <td className="checkCell modifier">
        <span className="mono">{addon.damage.damageRoll}</span>
      </td>
    </tr>
  );
};

export default AlwaysOnDamageAddonRow;
