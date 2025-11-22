import type { D20Test } from "../common/D20Test";
import type { DiceString } from "../common/DiceString";

export type DamageData = {
  damageRoll: DiceString;
};

export type DamageOptionData = {
  level: number;
  damageRoll: DiceString;
};

export type DamageOptionsData = {
  options: DamageOptionData[];
};

export type OptionalDamageData = {
  optional: true;
  damageRoll: DiceString;
};

export type DamageAddonData = {
  addon: string;
  damage: DamageData | DamageOptionsData | OptionalDamageData;
};

export type WeaponAttackData = {
  weapon: string;
  attackRoll: D20Test;
  damage: DamageData;
};
