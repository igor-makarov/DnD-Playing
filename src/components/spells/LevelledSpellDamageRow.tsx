import InfoTooltip from "@/components/common/InfoTooltip";
import type { DamageKind, DamageLevel } from "@/js/character/DamageTypes";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

import LevelledSpellDamageCell from "./LevelledSpellDamageCell";
import LevelledSpellLevelSelector from "./LevelledSpellLevelSelector";

interface Props {
  name: string;
  damageOptions: DamageLevel[];
  damageKind: DamageKind;
  reference?: ReferenceRendered;
}

export default function LevelledSpellDamageRow({ name, damageOptions, damageKind, reference }: Props) {
  return (
    <tr>
      <td>
        {reference ? <InfoTooltip reference={reference}>{name}</InfoTooltip> : name}
        <LevelledSpellLevelSelector spellName={name} options={damageOptions} />
      </td>
      <td className="checkCell mono">
        <LevelledSpellDamageCell spellName={name} initialDamageRoll={damageOptions[0].damage} damageKind={damageKind} />
      </td>
    </tr>
  );
}
