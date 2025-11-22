import React from "react";

import type { DamageAddonData, DamageData } from "../../js/character/WeaponAttackTypes";

interface Props {
  addon: DamageAddonData & { damage: DamageData };
}

export default function AlwaysOnDamageAddonRow({ addon }: Props) {
  return (
    <tr>
      <td>{addon.addon}</td>
      <td className="checkCell mono">{addon.damage.damageRoll.toString()}</td>
    </tr>
  );
}
