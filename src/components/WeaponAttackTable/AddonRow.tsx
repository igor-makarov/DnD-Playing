import React from "react";

import type { DamageAddonData, DamageData, DamageOptionsData, OptionalDamageData } from "../../js/character/WeaponAttackTypes";
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
        addon={addon as DamageAddonData & { damage: DamageOptionsData }}
        selectedLevel={state.selectedLevels.get(addon.addon) ?? -1}
        onLevelChange={(level) => {
          dispatch({ type: "SET_ADDON_LEVEL", addon: addon.addon, level });
        }}
      />
    );
  }

  if ("optional" in addon.damage) {
    return (
      <OptionalDamageAddonRow
        addon={addon as DamageAddonData & { damage: OptionalDamageData }}
        isEnabled={state.enabledOptionals.get(addon.addon) ?? false}
        onToggle={(enabled) => {
          dispatch({ type: "TOGGLE_OPTIONAL", addon: addon.addon, enabled });
        }}
      />
    );
  }

  return <AlwaysOnDamageAddonRow addon={addon as DamageAddonData & { damage: DamageData }} />;
}
