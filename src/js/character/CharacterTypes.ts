import { D20Test } from "../common/D20Test";
import { DiceString } from "../common/DiceString";
import type { DamageWithLevels, OptionalDamage } from "./DamageTypes";

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

export const SKILL_TO_DEFAULT_ABILITIY: Record<Skill, Ability> = {
  Acrobatics: "Dex",
  "Animal Handling": "Wis",
  Arcana: "Int",
  Athletics: "Str",
  Deception: "Cha",
  History: "Int",
  Insight: "Wis",
  Intimidation: "Cha",
  Investigation: "Int",
  Medicine: "Wis",
  Nature: "Int",
  Perception: "Wis",
  Performance: "Cha",
  Persuasion: "Cha",
  Religion: "Int",
  "Sleight of Hand": "Dex",
  Stealth: "Dex",
  Survival: "Wis",
};

export type AbilityScores = {
  [K in Ability]: number;
};

export type SkillProficiency = {
  skill: Skill;
  multiplier?: number;
};

export type SavingThrowProficiency = {
  save: Ability;
};

export type ProficiencySymbol = " " | "P" | "E";

export type Proficiency = {
  symbol: ProficiencySymbol;
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

export type AttackAddon = {
  addon: string;
  damage: DiceString | DamageWithLevels | OptionalDamage;
};

export type SpellSlotsForLevel = {
  level: number;
  slots: number;
};
