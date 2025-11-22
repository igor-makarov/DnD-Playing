import type { D20Test } from "../common/D20Test";
import type { DiceString } from "../common/DiceString";
import type { LevelledDamage, OptionalDamage } from "./DamageTypes";

export type DamageAddonData = {
  name: string;
  damage: DiceString | OptionalDamage | LevelledDamage;
};

export type WeaponAttackData = {
  weapon: string;
  attackRoll: D20Test;
  damage: DiceString;
};
