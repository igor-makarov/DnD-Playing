import React from "react";

import type { SkillAbilityCheck } from "@/js/character/CharacterTypes";

import D20TestCell from "./common/D20TestCell";

interface Props {
  skill: SkillAbilityCheck;
  advantage?: boolean;
}

export default function SkillRow({ skill, advantage }: Props) {
  const check = skill.check;
  return (
    <tr>
      <td>
        <span className="mono">[{check.getProficiency().symbol}]</span> {skill.skill} ({check.getAbility()})
      </td>
      <td className="checkCell">
        <D20TestCell roll={check} advantage={advantage} />
      </td>
    </tr>
  );
}
