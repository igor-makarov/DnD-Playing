import React, { useMemo, useReducer } from "react";

import { D20Test } from "../../js/D20Test";
import CheckCell from "../CheckCell";
import AddonRow from "./AddonRow";
import TotalDamageRow from "./TotalDamageRow";
import type { DamageAddonData, WeaponAttackData } from "./WeaponAttackData";
import WeaponSelector from "./WeaponSelector";
import { computeTotalDamage, weaponReducer } from "./weaponAttackReducer";

interface WeaponAttackProps {
  weaponAttacks: WeaponAttackData[];
  damageAddons: DamageAddonData[];
}

const WeaponAttackTable: React.FC<WeaponAttackProps> = ({ weaponAttacks, damageAddons }) => {
  const [state, dispatch] = useReducer(weaponReducer, {
    selectedWeaponName: weaponAttacks[0]?.weapon || "",
    selectedLevels: new Map(),
    enabledOptionals: new Map(),
  });

  const selectedWeapon = useMemo(() => {
    if (!state.selectedWeaponName) return null;
    return weaponAttacks.find((w) => w.weapon === state.selectedWeaponName) || null;
  }, [state.selectedWeaponName, weaponAttacks]);

  const handleWeaponChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SELECT_WEAPON", weaponName: event.target.value });
  };

  const totalDamage = useMemo(() => {
    return computeTotalDamage(selectedWeapon, damageAddons, state.selectedLevels, state.enabledOptionals);
  }, [selectedWeapon, damageAddons, state.selectedLevels, state.enabledOptionals]);

  return (
    <table>
      <tr>
        <th colSpan={2} style={{ textAlign: "center" }}>
          Weapon Attack
        </th>
      </tr>
      <tr>
        <td colSpan={2} style={{ textAlign: "center" }}>
          <WeaponSelector weapons={weaponAttacks} selectedWeaponName={state.selectedWeaponName} onWeaponChange={handleWeaponChange} />
        </td>
      </tr>
      <tr>
        <td>Attack Modifier</td>
        <td className="checkCell">
          {selectedWeapon && <CheckCell check={new D20Test("Attack Roll", selectedWeapon.ability, selectedWeapon.attackModifier)} />}
        </td>
      </tr>
      <tr>
        <td>Weapon Damage</td>
        <td className="checkCell">{selectedWeapon && <span className="mono">{selectedWeapon.damage.damageRoll}</span>}</td>
      </tr>
      {damageAddons.map((addon) => (
        <AddonRow key={addon.addon} addon={addon} state={state} dispatch={dispatch} />
      ))}
      <TotalDamageRow totalDamage={totalDamage} />
    </table>
  );
};

export default WeaponAttackTable;
