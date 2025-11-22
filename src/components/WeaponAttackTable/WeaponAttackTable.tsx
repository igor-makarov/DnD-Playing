import React, { useMemo, useReducer } from "react";

import type { DamageAddonData, WeaponAttackData } from "../../js/character/WeaponAttackTypes";
import { withAutoRehydration } from "../../js/utils/withAutoRehydration";
import D20TestCell from "../common/D20TestCell.tsx";
import AddonRow from "./AddonRow";
import TotalDamageRow from "./TotalDamageRow";
import WeaponSelector from "./WeaponSelector";
import { type WeaponState, computeTotalDamage, weaponReducer } from "./weaponAttackReducer";

interface Props {
  weaponAttacks: WeaponAttackData[];
  damageAddons: DamageAddonData[];
}

export default withAutoRehydration(function WeaponAttackTable({ weaponAttacks, damageAddons }: Props) {
  const [state, dispatch] = useReducer(weaponReducer, {
    selectedWeaponName: weaponAttacks[0]?.weapon || "",
    selectedLevels: new Map(),
    enabledOptionals: new Map(),
  } as WeaponState);

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
      <tbody>
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
          <td className="checkCell">{selectedWeapon && <D20TestCell roll={selectedWeapon.attackRoll} />}</td>
        </tr>
        <tr>
          <td>Weapon Damage</td>
          <td className="checkCell">{selectedWeapon && <span className="mono">{selectedWeapon.damage.toString()}</span>}</td>
        </tr>
        {damageAddons.map((addon) => (
          <AddonRow key={addon.addon} addon={addon} state={state} dispatch={dispatch} />
        ))}
        <TotalDamageRow totalDamage={totalDamage} />
      </tbody>
    </table>
  );
});
