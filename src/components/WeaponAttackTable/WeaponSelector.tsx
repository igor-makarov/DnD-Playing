import React from "react";

import type { WeaponAttackData } from "../../js/character/WeaponAttackTypes";

interface WeaponSelectorProps {
  weapons: WeaponAttackData[];
  selectedWeaponName: string;
  onWeaponChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const WeaponSelector: React.FC<WeaponSelectorProps> = ({ weapons, selectedWeaponName, onWeaponChange }) => {
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
};

export default WeaponSelector;
