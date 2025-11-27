import React from "react";

import PointsCountInput from "@/components/common/PointsCountInput";
import RollLink from "@/components/common/RollLink";
import { $hitDice } from "@/js/character/dynamic-state/stores";
import { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  die: DiceString;
  count: number;
  conModifier: number;
}

export default function HitDiceRow({ die, count, conModifier }: Props) {
  const hitDice = useStore($hitDice);
  const dieKey = die.toString();
  const available = hitDice[dieKey] ?? count;

  const dieWithModifier = new DiceString(die, conModifier);

  const handleChange = (newCount: number | undefined) => {
    $hitDice.setKey(dieKey, newCount);
  };

  const handleDiceClick = () => {
    if (available > 0) {
      handleChange(available - 1);
    }
  };

  return (
    <tr>
      <td>
        <span className="mono">
          <PointsCountInput maximum={count} current={available} onChange={handleChange} />
          &nbsp;/&nbsp;
          {count}
        </span>
      </td>
      <td className="checkCell">
        <span onClick={handleDiceClick} style={{ cursor: available > 0 ? "pointer" : "not-allowed" }}>
          <RollLink dice={dieWithModifier} />
        </span>
      </td>
    </tr>
  );
}
