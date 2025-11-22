import type { DiceString } from "../common/DiceString";

// Single damage option for a specific level
export type DamageOptionData = {
  level: number;
  damage: DiceString;
};

// Multiple damage options for different levels
export type DamageOptionsData = {
  options: DamageOptionData[];
};

// Optional damage that can be toggled on/off
export type OptionalDamage = {
  optional: true;
  damage: DiceString;
};

// Damage that scales with character/spell level
export type DamageWithLevels = {
  base: DamageOptionData;
  increment: DiceString;
  step?: number;
};
