import { D20Test } from "../common/D20Test";
import { DiceString } from "../common/DiceString";
import type { LevelledDamageDefinition, OptionalDamage } from "./DamageTypes";

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

export const PROFICIENCY_BONUS_BY_LEVEL: number[] = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6];

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
  name: string;
  damage: DiceString | OptionalDamage | LevelledDamageDefinition;
};

export type SpellSlotsForLevel = {
  level: number;
  slots: number;
};

export type HitPointRoll = {
  level: number;
  die: DiceString;
  roll: number; // HP rolled/taken at this level (before any modifiers)
};

export type ClassLevel = {
  className: string;
  level: number;
};
