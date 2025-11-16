import React, { useState, useMemo } from 'react';
import CheckCell from './CheckCell';
import { Character, type WeaponAttack } from '../js/Character';
import { getRollUrl } from '../js/rollOptions';

interface WeaponAttackProps {
  weaponAttacks: WeaponAttack[];
}

const WeaponAttack: React.FC<WeaponAttackProps> = ({ weaponAttacks }) => {
  // const weap
  const [selectedWeaponName, setSelectedWeaponName] = useState<string>('');

  const selectedWeapon = useMemo(() => {
    if (!selectedWeaponName) {
      return null;
    }
    return weaponAttacks.find(w => w.weapon === selectedWeaponName) || null;
  }, [selectedWeaponName, weaponAttacks]);

  const attackModifier = useMemo(() => {
    return selectedWeapon?.attackModifier ?? null;
  }, [selectedWeapon]);

  const handleWeaponChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeaponName(event.target.value);
  };

  // Subscribe to hash changes for dice app key
  const [diceAppKey, setDiceAppKey] = React.useState('app');

  React.useEffect(() => {
    const updateDiceAppKey = () => {
      setDiceAppKey(window.location.hash?.substring(1) || 'app');
    };
    updateDiceAppKey();
    window.addEventListener('hashchange', updateDiceAppKey);
    return () => window.removeEventListener('hashchange', updateDiceAppKey);
  }, []);

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
      <tr>
        <td>Damage</td>
        <td className="checkCell modifier">
          {selectedWeapon && (
            <span className="mono">
              <a className="regular-link" href={getRollUrl(selectedWeapon.damageRoll, diceAppKey)}>
                {selectedWeapon.damageRoll}
              </a>
              &nbsp;
              <a className="regular-link" href={getRollUrl(selectedWeapon.critRoll, diceAppKey)}>
                CRIT
              </a>
            </span>
          )}
        </td>
      </tr>
    </table>
  );
};

export default WeaponAttack;
