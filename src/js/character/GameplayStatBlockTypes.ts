import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

import type { Ability } from "./CharacterTypes";

export interface GameplayAbility {
  ability: Ability;
  score: number;
  checkBonus: number;
  saveBonus: number;
}

export interface GameplayRoll {
  label: string;
  dice: string;
}

export interface GameplayAction {
  name: string;
  description: string;
  attackBonus?: number;
  rolls?: GameplayRoll[];
  uses?: number;
  /** Rendered full text of the action, for tooltip display. */
  reference?: ReferenceRendered;
}

/** Serializable, explicit contract between a stat-block adapter and gameplay UI. */
export interface GameplayStatBlock {
  id: string;
  name: string;
  proficiencyBonus?: number;
  armorClass: number;
  hitPointMaximum: number;
  hitDice: Array<{ die: string; count: number }>;
  initiativeBonus: number;
  abilities: GameplayAbility[];
  traits: GameplayAction[];
  actions: GameplayAction[];
  reactions: GameplayAction[];
}
