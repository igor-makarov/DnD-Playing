import React, { useState, useMemo } from 'react';
import CheckCell from './CheckCell';
import { Character, type WeaponAttack } from '../js/Character';

interface WeaponAttackProps {
  weaponAttacks: WeaponAttack[];
}

const WeaponAttack: React.FC<WeaponAttackProps> = ({ weaponAttacks }) => {
  // const weap
  const [selectedWeaponName, setSelectedWeaponName] = useState<string>('');

  const attackModifier = useMemo(() => {
    if (!selectedWeaponName) {
      return null;
    }
    const weapon = weaponAttacks.find(w => w.weapon === selectedWeaponName);
    if (!weapon) {
      return null;
    }
    // Sticking to Strength as per original component.
    return weapon.attackModifier
  }, [selectedWeaponName, weaponAttacks]);

  const handleWeaponChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeaponName(event.target.value);
  };

  return (
    <div>
      <div>
        <label htmlFor="weapon-select">Choose a weapon:</label>
        <select name="weapons" id="weapon-select" onChange={handleWeaponChange} value={selectedWeaponName}>
          <option value="" disabled>--Please choose a weapon--</option>
          {weaponAttacks.map(weapon => (
            <option key={weapon.weapon} value={weapon.weapon}>
              {weapon.weapon}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-6">
        {attackModifier !== null && <CheckCell bonus={attackModifier} />}
      </div>
    </div>
  );
};

export default WeaponAttack;
