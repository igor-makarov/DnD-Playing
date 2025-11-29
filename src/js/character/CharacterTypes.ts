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

// prettier-ignore
export const PROFICIENCY_BONUS_BY_LEVEL: number[] = [
  2, 2, 2, 2, // Levels 1-4
  3, 3, 3, 3, // Levels 5-8
  4, 4, 4, 4, // Levels 9-12
  5, 5, 5, 5, // Levels 13-16
  6, 6, 6, 6, // Levels 17-20
];

// prettier-ignore
export const SPELL_SLOTS_BY_LEVEL: number[][] = [
  [2],                         // 1
  [3],                         // 2
  [4, 2],                      // 3
  [4, 3],                      // 4
  [4, 3, 2],                   // 5
  [4, 3, 3],                   // 6
  [4, 3, 3, 1],                // 7
  [4, 3, 3, 2],                // 8
  [4, 3, 3, 3, 1],             // 9
  [4, 3, 3, 3, 2],             // 10
  [4, 3, 3, 3, 2, 1],          // 11
  [4, 3, 3, 3, 2, 1],          // 12
  [4, 3, 3, 3, 2, 1, 1],       // 13
  [4, 3, 3, 3, 2, 1, 1],       // 14
  [4, 3, 3, 3, 2, 1, 1, 1],    // 15
  [4, 3, 3, 3, 2, 1, 1, 1],    // 16
  [4, 3, 3, 3, 2, 1, 1, 1, 1], // 17
  [4, 3, 3, 3, 3, 1, 1, 1, 1], // 18
  [4, 3, 3, 3, 3, 2, 1, 1, 1], // 19
  [4, 3, 3, 3, 3, 2, 2, 1, 1], // 20
];

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
