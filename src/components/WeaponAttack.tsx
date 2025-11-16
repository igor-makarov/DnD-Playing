import React, { useState, useMemo, useSyncExternalStore } from "react";
import CheckCell from "./CheckCell";
import { getRollUrl } from "../js/rollOptions";
import { DiceString } from "../js/DiceString";

// This function subscribes to the hashchange event
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

// This function gets the current value of the hash
function getSnapshot() {
  return window.location.hash;
}

// Since this is a client-only component, the server snapshot can be a dummy value.
const getServerSnapshot = () => "";

export type DamageData = {
  damageRoll: string;
  critRoll: string;
};

export type DamageAddonData = {
  addon: string;
  damage: DamageData;
};

export type WeaponAttackData = {
  weapon: string;
  attackModifier: number;
  damage: DamageData;
};

interface WeaponAttackProps {
  weaponAttacks: WeaponAttackData[];
  damageAddons: DamageAddonData[];
}

export const WeaponAttack: React.FC<WeaponAttackProps> = ({ weaponAttacks, damageAddons }) => {
  // const weap
  const [selectedWeaponName, setSelectedWeaponName] = useState<string>("");

  const selectedWeapon = useMemo(() => {
    if (!selectedWeaponName) {
      return null;
    }
    return weaponAttacks.find((w) => w.weapon === selectedWeaponName) || null;
  }, [selectedWeaponName, weaponAttacks]);

  const attackModifier = useMemo(() => {
    return selectedWeapon?.attackModifier ?? null;
  }, [selectedWeapon]);

  const handleWeaponChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeaponName(event.target.value);
  };

  // Subscribe to hash changes for dice app key
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const diceAppKey = hash?.substring(1) || "app";

  return (
    <table>
      <tr>
        <th colSpan={2} style={{ textAlign: "center" }}>
          Weapon Attack
        </th>
      </tr>
      <tr>
        <td colSpan={2} style={{ textAlign: "center" }}>
          <select name="weapons" id="weapon-select" onChange={handleWeaponChange} value={selectedWeaponName}>
            <option value="" disabled>
              --Please choose a weapon--
            </option>
            {weaponAttacks.map((weapon) => (
              <option key={weapon.weapon} value={weapon.weapon}>
                {weapon.weapon}
              </option>
            ))}
          </select>
        </td>
      </tr>
      <tr>
        <td>Attack</td>
        <td className="checkCell modifier">{attackModifier !== null && <CheckCell bonus={attackModifier} />}</td>
      </tr>
      <tr>
        <td>Weapon Damage</td>
        <td className="checkCell modifier">{selectedWeapon && <span className="mono">{selectedWeapon.damage.damageRoll}</span>}</td>
      </tr>
      {damageAddons.map((addon) => (
        <tr key={addon.addon}>
          <td>{addon.addon}</td>
          <td className="checkCell modifier">
            <span className="mono">{addon.damage.damageRoll}</span>
          </td>
        </tr>
      ))}
      <tr>
        <td>Damage</td>
        <td className="checkCell modifier">
          {selectedWeapon && (
            <span className="mono">
              <a
                className="regular-link"
                href={getRollUrl(
                  DiceString.sum([selectedWeapon.damage.damageRoll, ...damageAddons.map((a) => a.damage.damageRoll)]).toString(),
                  diceAppKey,
                )}
              >
                {DiceString.sum([selectedWeapon.damage.damageRoll, ...damageAddons.map((a) => a.damage.damageRoll)]).toString()}
              </a>
              &nbsp;
              <a
                className="regular-link"
                href={getRollUrl(
                  DiceString.sum([selectedWeapon.damage.critRoll, ...damageAddons.map((a) => a.damage.critRoll)]).toString(),
                  diceAppKey,
                )}
              >
                CRIT
              </a>
            </span>
          )}
        </td>
      </tr>
    </table>
  );
};
