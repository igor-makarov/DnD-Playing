import { DiceString } from "./DiceString";

export type Ability = "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha";

export type AbilityScores = {
  [K in Ability]: number;
};

export type SkillProficiency = {
  skill: string;
  ability: Ability;
  proficient?: boolean;
};

export type SavingThrowProficiency = {
  save: Ability;
  proficient?: boolean;
};

export type Proficiency = {
  symbol: string;
  bonus: number;
};

export type Skill = {
  skill: string;
  ability: Ability;
  proficiency: Proficiency;
  dice: DiceString;
};

export type SavingThrow = {
  ability: Ability;
  proficiency: Proficiency;
  dice: DiceString;
};

export type Weapon = {
  weapon: string;
  ability: Ability;
  damage: DiceString;
  bonus: number;
};

export type DamageWithLevels = [level: number, damage: DiceString][];

export type OptionalDamage = {
  optional: true;
  damage: DiceString;
};

export type AttackAddon = {
  addon: string;
  damage: DiceString | DamageWithLevels | OptionalDamage;
};
