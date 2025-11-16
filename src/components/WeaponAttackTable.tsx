import React, { useState, useMemo } from "react";
import CheckCell from "./CheckCell";
import { getRollUrl } from "../js/rollOptions";
import { DiceString } from "../js/DiceString";
import AlwaysOnDamageAddonRow from "./AlwaysOnDamageAddonRow";
import LevelledDamageAddonRow from "./LevelledDamageAddonRow";
import OptionalDamageAddonRow from "./OptionalDamageAddonRow";
import type { DamageData, DamageAddonData, DamageOptionsData, OptionalDamageData, WeaponAttackData } from "./WeaponAttackData";
import { useHash } from "../hooks/useHash";

interface WeaponAttackProps {
  weaponAttacks: WeaponAttackData[];
  damageAddons: DamageAddonData[];
}

const WeaponAttackTable: React.FC<WeaponAttackProps> = ({ weaponAttacks, damageAddons }) => {
  const [selectedWeaponName, setSelectedWeaponName] = useState<string>(() => weaponAttacks[0]?.weapon || "");
  const [selectedLevels, setSelectedLevels] = useState<Map<string, number>>(new Map());
  const [enabledOptionals, setEnabledOptionals] = useState<Map<string, boolean>>(new Map());

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
  const hash = useHash();
  const diceAppKey = hash?.substring(1) || "app";

  // Helper to get damage for an addon based on selected level or enabled state
  const getAddonDamage = (addon: DamageAddonData): DamageData | null => {
    if ("options" in addon.damage) {
      const selectedLevel = selectedLevels.get(addon.addon) ?? -1; // Default to -1 (off)
      if (selectedLevel === -1) {
        return null; // Off state
      }
      const option = addon.damage.options.find((opt) => opt.level === selectedLevel);
      if (option) {
        return { damageRoll: option.damageRoll, critRoll: option.critRoll };
      }
      return null;
    } else if ("optional" in addon.damage) {
      const isEnabled = enabledOptionals.get(addon.addon) ?? false;
      if (!isEnabled) {
        return null; // Disabled state
      }
      return { damageRoll: addon.damage.damageRoll, critRoll: addon.damage.critRoll };
    } else {
      return addon.damage;
    }
  };

  // Compute total damage (weapon + addons)
  const totalDamage = useMemo(() => {
    if (!selectedWeapon) {
      return null;
    }
    const damageRolls = [selectedWeapon.damage.damageRoll];
    const critRolls = [selectedWeapon.damage.critRoll];

    for (const addon of damageAddons) {
      const addonDamage = getAddonDamage(addon);
      if (addonDamage) {
        damageRolls.push(addonDamage.damageRoll);
        critRolls.push(addonDamage.critRoll);
      }
    }

    return {
      damageRoll: DiceString.sum(...damageRolls).toString(),
      critRoll: DiceString.sum(...critRolls).toString(),
    };
  }, [selectedWeapon, damageAddons, selectedLevels, enabledOptionals]);

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
        <td>Attack Modifier</td>
        <td className="checkCell modifier">{attackModifier !== null && <CheckCell bonus={attackModifier} />}</td>
      </tr>
      <tr>
        <td>Weapon Damage</td>
        <td className="checkCell modifier">{selectedWeapon && <span className="mono">{selectedWeapon.damage.damageRoll}</span>}</td>
      </tr>
      {damageAddons.map((addon) => {
        if ("options" in addon.damage) {
          return (
            <LevelledDamageAddonRow
              key={addon.addon}
              addon={addon as DamageAddonData & { damage: DamageOptionsData }}
              selectedLevel={selectedLevels.get(addon.addon) ?? -1}
              onLevelChange={(level) => {
                const newMap = new Map(selectedLevels);
                newMap.set(addon.addon, level);
                setSelectedLevels(newMap);
              }}
            />
          );
        }

        if ("optional" in addon.damage) {
          return (
            <OptionalDamageAddonRow
              key={addon.addon}
              addon={addon as DamageAddonData & { damage: OptionalDamageData }}
              isEnabled={enabledOptionals.get(addon.addon) ?? false}
              onToggle={(enabled) => {
                const newMap = new Map(enabledOptionals);
                newMap.set(addon.addon, enabled);
                setEnabledOptionals(newMap);
              }}
            />
          );
        }

        return <AlwaysOnDamageAddonRow key={addon.addon} addon={addon as DamageAddonData & { damage: DamageData }} />;
      })}
      <tr>
        <td>Total Damage</td>
        <td className="checkCell modifier">
          {totalDamage && (
            <span className="mono">
              <a className="regular-link" href={getRollUrl(totalDamage.damageRoll, diceAppKey)}>
                {totalDamage.damageRoll}
              </a>
              &nbsp;
              <a className="regular-link" href={getRollUrl(totalDamage.critRoll, diceAppKey)}>
                CRIT
              </a>
            </span>
          )}
        </td>
      </tr>
    </table>
  );
};

export default WeaponAttackTable;
