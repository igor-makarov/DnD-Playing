import { D20Test } from "./D20Test";
import { DiceString } from "./DiceString";

export type Ability = "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha";

export type Skill =
  | "Acrobatics"
  | "Animal Handling"
  | "Arcana"
  | "Athletics"
  | "Deception"
  | "History"
  | "Insight"
  | "Intimidation"
  | "Investigation"
  | "Medicine"
  | "Nature"
  | "Perception"
  | "Performance"
  | "Persuasion"
  | "Religion"
  | "Sleight of Hand"
  | "Stealth"
  | "Survival";

export type AbilityScores = {
  [K in Ability]: number;
};

export type SkillProficiency = {
  skill: Skill;
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

export type AbilityCheck = {
  ability: Ability;
  check: D20Test;
};

export type SkillAbilityCheck = {
  skill: Skill;
  ability: Ability;
  check: D20Test;
};

export type SavingThrow = {
  ability: Ability;
  check: D20Test;
};

export type Weapon = {
  weapon: string;
  ability: Ability;
  damage: DiceString;
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
