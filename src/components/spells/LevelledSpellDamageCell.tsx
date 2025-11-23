import { useStore } from "@nanostores/react";

import React from "react";

import type { DiceString } from "../../js/common/DiceString";
import { withAutoRehydration } from "../../js/utils/withAutoRehydration";
import { spellLevelStore } from "../../stores/spellLevelStore";
import DamageCell from "../common/DamageCell";

interface Props {
  spellName: string;
  initialDamageRoll?: DiceString;
}

export default withAutoRehydration(function LevelledSpellDamageCell({ spellName, initialDamageRoll }: Props) {
  const spellData = useStore(spellLevelStore);
  // Use store value if available, otherwise fall back to initial value
  // This ensures SSR and initial client render are consistent
  const damageRoll = spellData[spellName]?.damageRoll ?? initialDamageRoll;

  if (!damageRoll) {
    return null;
  }

  return <DamageCell damageRoll={damageRoll} />;
});
