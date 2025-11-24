import React from "react";

import type { DamageAddonData } from "@/js/character/WeaponAttackTypes";
import type { DiceString } from "@/js/common/DiceString";

interface Props {
  addon: DamageAddonData & { damage: DiceString };
}

export default function AlwaysOnDamageAddonRow({ addon }: Props) {
  return (
    <tr>
      <td>{addon.name}</td>
      <td className="checkCell mono">{addon.damage.toString()}</td>
    </tr>
  );
}
