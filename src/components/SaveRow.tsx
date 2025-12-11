import React from "react";

import type { SavingThrow } from "@/js/character/CharacterTypes";

import D20TestCell from "./common/D20TestCell.server";

interface Props {
  savingThrow: SavingThrow;
  advantage?: boolean;
}

export default function SaveRow({ savingThrow, advantage }: Props) {
  const check = savingThrow.check;
  return (
    <tr>
      <td>
        <span className="mono">[{check.getProficiency().symbol}]</span> {check.getAbility()}
      </td>
      <td className="checkCell">
        <D20TestCell roll={check} advantage={advantage} />
      </td>
    </tr>
  );
}
