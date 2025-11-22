import { useStore } from "@nanostores/react";

import React from "react";

import { spellLevelStore } from "../../stores/spellLevelStore";
import DamageCell from "../common/DamageCell";

interface Props {
  spellName: string;
}

export default function LevelledSpellDamageCell({ spellName }: Props) {
  const spellData = useStore(spellLevelStore);
  const damageRoll = spellData[spellName]?.damageRoll;

  if (!damageRoll) {
    return null;
  }

  return <DamageCell damageRoll={damageRoll} />;
}
