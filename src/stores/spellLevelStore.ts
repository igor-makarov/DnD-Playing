import { map } from "nanostores";

import type { DiceString } from "@/js/common/DiceString";

export interface SpellSelection {
  level: number;
  damageRoll: DiceString;
}

export const $spellLevelStore = map<Record<string, SpellSelection>>({});
