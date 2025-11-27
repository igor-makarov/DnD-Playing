import React from "react";

import RollLink from "@/components/common/RollLink";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { withAutoRehydration } from "@/js/utils/withAutoRehydration";
import { $spellLevelStore } from "@/stores/spellLevelStore";

interface Props {
  spellName: string;
  initialDamageRoll?: DiceString;
}

export default withAutoRehydration(function LevelledSpellDamageCell({ spellName, initialDamageRoll }: Props) {
  const spellData = useStore($spellLevelStore);
  // Use store value if available, otherwise fall back to initial value
  // This ensures SSR and initial client render are consistent
  const damageRoll = spellData[spellName]?.damageRoll ?? initialDamageRoll;

  if (!damageRoll) {
    return null;
  }

  return (
    <span className="mono check-cell">
      <RollLink dice={damageRoll} />
    </span>
  );
});
