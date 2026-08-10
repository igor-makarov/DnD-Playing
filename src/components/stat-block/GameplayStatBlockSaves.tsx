import D20TestCell from "@/components/common/D20TestCell";
import type { GameplayStatBlock } from "@/js/character/GameplayStatBlockTypes";
import { D20Test } from "@/js/common/D20Test";

interface Props {
  statBlock: GameplayStatBlock;
}

export default function GameplayStatBlockSaves({ statBlock }: Props) {
  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2} className="modifier">
            Saves
          </th>
        </tr>
        <tr>
          <th>Save</th>
          <th className="modifier">Modifier</th>
        </tr>
        {statBlock.abilities.map((ability) => (
          <tr key={ability.ability}>
            <td>
              <span className="mono">[P]</span> {ability.ability}
            </td>
            <td className="checkCell">
              <D20TestCell roll={new D20Test("Saving Throw", ability.ability, ability.saveBonus)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
