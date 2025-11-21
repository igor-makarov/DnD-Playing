import type { D20Test } from "../D20Test";

export type DamageData = {
  damageRoll: string;
  critRoll: string;
};

export type DamageOptionData = {
  level: number;
  damageRoll: string;
  critRoll: string;
};

export type DamageOptionsData = {
  options: DamageOptionData[];
};

export type OptionalDamageData = {
  optional: true;
  damageRoll: string;
  critRoll: string;
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
