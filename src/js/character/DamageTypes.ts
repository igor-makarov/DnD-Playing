import type { DiceString } from "../common/DiceString";

// Optional damage that can be toggled on/off
export type OptionalDamage = {
  optional: true;
  damage: DiceString;
};

// Single damage option for a specific level
export type DamageLevel = {
  level: number;
  damage: DiceString;
};

// Damage that scales with character/spell level
export type LevelledDamageDefinition = {
  base: DamageLevel;
  increment: DiceString;
  step?: number;
};

// Multiple damage options for different levels
export type LevelledDamage = {
  options: DamageLevel[];
};
