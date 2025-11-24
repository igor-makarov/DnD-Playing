import React from "react";

import type { LevelledDamage, OptionalDamage } from "@/js/character/DamageTypes";
import type { DamageAddonData } from "@/js/character/WeaponAttackTypes";
import type { DiceString } from "@/js/common/DiceString";

import AlwaysOnDamageAddonRow from "./AlwaysOnDamageAddonRow";
import LevelledDamageAddonRow from "./LevelledDamageAddonRow";
import OptionalDamageAddonRow from "./OptionalDamageAddonRow";
import type { WeaponAction, WeaponState } from "./weaponAttackReducer";

interface Props {
  addon: DamageAddonData;
  state: WeaponState;
  dispatch: React.Dispatch<WeaponAction>;
}

export default function AddonRow({ addon, state, dispatch }: Props) {
  if ("options" in addon.damage) {
    return (
      <LevelledDamageAddonRow
        addon={addon as DamageAddonData & { damage: LevelledDamage }}
        selectedLevel={state.selectedLevels.get(addon.name) ?? -1}
        onLevelChange={(level) => {
          dispatch({ type: "SET_ADDON_LEVEL", addon: addon.name, level });
        }}
      />
    );
  }

  if ("optional" in addon.damage) {
    return (
      <OptionalDamageAddonRow
        addon={addon as DamageAddonData & { damage: OptionalDamage }}
        isEnabled={state.enabledOptionals.get(addon.name) ?? false}
        onToggle={(enabled) => {
          dispatch({ type: "TOGGLE_OPTIONAL", addon: addon.name, enabled });
        }}
      />
    );
  }

  return <AlwaysOnDamageAddonRow addon={addon as DamageAddonData & { damage: DiceString }} />;
}
