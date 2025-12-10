import React from "react";

import type { Character } from "@/js/character/Character";

import WeaponAttackTableServer from "./WeaponAttackTable.server";

interface Props {
  character: Character;
}

export default function WeaponAttackTable({ character }: Props) {
  const weaponAttacks = character.getWeaponAttacks();
  const damageAddons = character.getWeaponAttackAddons();

  return <WeaponAttackTableServer weaponAttacks={weaponAttacks} damageAddons={damageAddons} />;
}
