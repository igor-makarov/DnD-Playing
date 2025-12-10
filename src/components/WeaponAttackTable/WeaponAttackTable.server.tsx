import React from "react";

import type { DamageAddonData, WeaponAttackData } from "@/js/character/WeaponAttackTypes";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";

import WeaponAttackTableClient from "./WeaponAttackTable.client";

export interface Props {
  weaponAttacks: WeaponAttackData[];
  damageAddons: DamageAddonData[];
}

const WeaponAttackTableServer: React.FC<Props> = withAutoRehydration(WeaponAttackTableClient);
export default WeaponAttackTableServer;
