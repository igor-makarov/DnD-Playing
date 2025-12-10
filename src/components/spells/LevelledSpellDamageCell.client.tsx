"use client";
import React from "react";

import RollLink from "@/components/common/RollLink";
import { useStore } from "@/js/hooks/useStore";
import { $spellLevelStore } from "@/stores/spellLevelStore";

import type { Props } from "./LevelledSpellDamageCell";

export default function LevelledSpellDamageCellClient({ spellName, initialDamageRoll }: Props) {
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
}
