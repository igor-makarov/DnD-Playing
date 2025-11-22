import React from "react";

import type { WeaponAttackData } from "../../js/character/WeaponAttackTypes";

interface Props {
  weapons: WeaponAttackData[];
  selectedWeaponName: string;
  onWeaponChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function WeaponSelector({ weapons, selectedWeaponName, onWeaponChange }: Props) {
  return (
    <select name="weapons" id="weapon-select" onChange={onWeaponChange} value={selectedWeaponName}>
      <option value="" disabled>
        --Please choose a weapon--
      </option>
      {weapons.map((weapon) => (
        <option key={weapon.weapon} value={weapon.weapon}>
          {weapon.weapon}
        </option>
      ))}
    </select>
  );
}
