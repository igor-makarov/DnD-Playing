import React from "react";

import type { Character } from "@/js/character/Character";
import type { SkillAbilityCheck } from "@/js/character/CharacterTypes";

import SkillRow from "./SkillRow";

interface Props {
  title: string;
  character: Character;
  skills?: SkillAbilityCheck[];
  advantage?: boolean;
}

export default function SkillsTable({ title, skills, advantage, character }: Props) {
  const finalSkills = skills ?? character.getSkillAbilityChecks();
  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2} style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: title }} />
        </tr>
        <tr>
          <th>Skill</th>
          <th className="modifier">Modifier</th>
        </tr>
        {finalSkills.map((skill) => (
          <SkillRow key={skill.skill} skill={skill} advantage={advantage} />
        ))}
      </tbody>
    </table>
  );
}
