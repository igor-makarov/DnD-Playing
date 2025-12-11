import type { Character } from "@/js/character/Character";

import D20TestCell from "./common/D20TestCell";

interface Props {
  character: Character;
}

export default function AbilitiesTable({ character }: Props) {
  return (
    <>
      {character.getAbilityChecks().map(({ ability, check }) => (
        <div key={ability} className="column ability-item">
          <span className="mono ability-name">{ability}</span>
          <span className="mono ability-score">{character.abilityScores[ability]}</span>
          <span className="checkCell">
            <D20TestCell roll={check} />
          </span>
        </div>
      ))}
    </>
  );
}
