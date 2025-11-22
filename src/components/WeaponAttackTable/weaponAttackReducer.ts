import type { DamageAddonData, WeaponAttackData } from "../../js/character/WeaponAttackTypes";
import { DiceString } from "../../js/common/DiceString";

// State type
export type WeaponState = {
  selectedWeaponName: string;
  selectedLevels: Map<string, number>;
  enabledOptionals: Map<string, boolean>;
};

// Action types
export type WeaponAction =
  | { type: "SELECT_WEAPON"; weaponName: string }
  | { type: "SET_ADDON_LEVEL"; addon: string; level: number }
  | { type: "TOGGLE_OPTIONAL"; addon: string; enabled: boolean };

// Pure function: Get damage for an addon based on state
export function getAddonDamage(
  addon: DamageAddonData,
  selectedLevels: Map<string, number>,
  enabledOptionals: Map<string, boolean>,
): DiceString | null {
  if ("options" in addon.damage) {
    const selectedLevel = selectedLevels.get(addon.addon) ?? -1;
    if (selectedLevel === -1) return null;
    const option = addon.damage.options.find((opt) => opt.level === selectedLevel);
    return option ? option.damage : null;
  } else if ("optional" in addon.damage) {
    const isEnabled = enabledOptionals.get(addon.addon) ?? false;
    if (!isEnabled) return null;
    return addon.damage.damage;
  } else {
    return addon.damage;
  }
}

// Pure function: Compute total damage
export function computeTotalDamage(
  weapon: WeaponAttackData | null,
  damageAddons: DamageAddonData[],
  selectedLevels: Map<string, number>,
  enabledOptionals: Map<string, boolean>,
): DiceString | null {
  if (!weapon) return null;

  const damageRolls = [weapon.damage];

  for (const addon of damageAddons) {
    const addonDamage = getAddonDamage(addon, selectedLevels, enabledOptionals);
    if (addonDamage) {
      damageRolls.push(addonDamage);
    }
  }

  return DiceString.sum(damageRolls);
}

// Reducer
export function weaponReducer(state: WeaponState, action: WeaponAction): WeaponState {
  switch (action.type) {
    case "SELECT_WEAPON":
      return { ...state, selectedWeaponName: action.weaponName };

    case "SET_ADDON_LEVEL": {
      const newLevels = new Map(state.selectedLevels);
      newLevels.set(action.addon, action.level);
      return { ...state, selectedLevels: newLevels };
    }

    case "TOGGLE_OPTIONAL": {
      const newOptionals = new Map(state.enabledOptionals);
      newOptionals.set(action.addon, action.enabled);
      return { ...state, enabledOptionals: newOptionals };
    }

    default:
      return state;
  }
}
