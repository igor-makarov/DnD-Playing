import type { DiceString } from "@/js/common/DiceString";
import { createStore } from "@/js/stores/primitives/createStore";

export interface SpellSelection {
  level: number;
  damageRoll: DiceString;
}

export const $spellLevelStore = createStore<Record<string, SpellSelection>>({});
