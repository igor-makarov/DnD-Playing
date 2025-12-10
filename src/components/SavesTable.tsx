import React from "react";

import type { Character } from "@/js/character/Character";
import type { SavingThrow } from "@/js/character/CharacterTypes";

import SaveRow from "./SaveRow";

interface Props {
  title: string;
  character: Character;
  savingThrows?: SavingThrow[];
  advantage?: boolean;
}

export default function SavesTable({ title, advantage, character, savingThrows }: Props) {
  const savingThrowsFinal = savingThrows ?? character.getSavingThrows();
  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2} style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: title }} />
        </tr>
        <tr>
          <th>Save</th>
          <th className="modifier">Modifier</th>
        </tr>
        {savingThrowsFinal.map((savingThrow) => (
          <SaveRow key={savingThrow.ability} savingThrow={savingThrow} advantage={advantage} />
        ))}
      </tbody>
    </table>
  );
}
