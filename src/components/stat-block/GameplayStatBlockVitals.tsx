import HitPointsInput from "@/components/HitPointsInput";
import D20TestCell from "@/components/common/D20TestCell";
import type { GameplayStatBlock } from "@/js/character/GameplayStatBlockTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

interface Props {
  statBlock: GameplayStatBlock;
}

export default function GameplayStatBlockVitals({ statBlock }: Props) {
  const proficiencyBonus = statBlock.proficiencyBonus;

  return (
    <>
      <div className="column">
        <table>
          <tbody>
            <tr>
              <th className="modifier">Proficiency Bonus</th>
            </tr>
            <tr>
              <td className="modifier mono">{proficiencyBonus === undefined ? "—" : `${proficiencyBonus >= 0 ? "+" : ""}${proficiencyBonus}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="column">
        <table>
          <tbody>
            <tr>
              <th className="modifier">AC</th>
            </tr>
            <tr>
              <td className="modifier mono">{statBlock.armorClass}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="column">
        <table>
          <tbody>
            <tr>
              <th className="modifier">HP</th>
            </tr>
            <tr>
              <td className="modifier">
                <HitPointsInput
                  hitPointMaximum={statBlock.hitPointMaximum}
                  hitDiceByType={statBlock.hitDice.map(({ die, count }) => ({ die: new DiceString(die), count }))}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="column">
        <table>
          <tbody>
            <tr>
              <th className="modifier">Initiative</th>
            </tr>
            <tr>
              <td className="modifier">
                <D20TestCell roll={new D20Test("Ability Check", "Dex", statBlock.initiativeBonus)} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
