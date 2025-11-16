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

export type DamageAddonData = {
  addon: string;
  damage: DamageData | DamageOptionsData;
};

export type WeaponAttackData = {
  weapon: string;
  attackModifier: number;
  damage: DamageData;
};
