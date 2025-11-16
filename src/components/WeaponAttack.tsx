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
    <table>
      <tr>
        <th colSpan={2} style={{ textAlign: 'center' }}>Weapon Attack</th>
      </tr>
      <tr>
        <td colSpan={2} style={{ textAlign: 'center' }}>
          <select name="weapons" id="weapon-select" onChange={handleWeaponChange} value={selectedWeaponName}>
            <option value="" disabled>--Please choose a weapon--</option>
            {weaponAttacks.map(weapon => (
              <option key={weapon.weapon} value={weapon.weapon}>
                {weapon.weapon}
              </option>
            ))}
          </select>
        </td>
      </tr>
      <tr>
        <td>Attack</td>
        <td className="checkCell modifier">
          {attackModifier !== null && <CheckCell bonus={attackModifier} />}
        </td>
      </tr>
    </table>
  );
};

export default WeaponAttack;
