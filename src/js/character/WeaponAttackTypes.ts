import type { D20Test } from "../common/D20Test";
import type { DiceString } from "../common/DiceString";
import type { DamageOptionsData, OptionalDamage } from "./DamageTypes";

export type DamageAddonData = {
  addon: string;
  damage: DiceString | DamageOptionsData | OptionalDamage;
};

export type WeaponAttackData = {
  weapon: string;
  attackRoll: D20Test;
  damage: DiceString;
};
