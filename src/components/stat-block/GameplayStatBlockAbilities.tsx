import D20TestCell from "@/components/common/D20TestCell";
import type { GameplayStatBlock } from "@/js/character/GameplayStatBlockTypes";
import { D20Test } from "@/js/common/D20Test";

interface Props {
  statBlock: GameplayStatBlock;
}

export default function GameplayStatBlockAbilities({ statBlock }: Props) {
  return (
    <>
      {statBlock.abilities.map((ability) => (
        <div key={ability.ability} className="column ability-item">
          <span className="mono ability-name">{ability.ability}</span>
          <span className="mono ability-score">{ability.score}</span>
          <span className="checkCell">
            <D20TestCell roll={new D20Test("Ability Check", ability.ability, ability.checkBonus)} />
          </span>
        </div>
      ))}
    </>
  );
}
