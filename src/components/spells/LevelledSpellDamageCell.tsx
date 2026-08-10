import AttackDamageCell from "@/components/common/AttackDamageCell";
import RollLink from "@/components/common/RollLink";
import type { DamageKind } from "@/js/character/DamageTypes";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { $spellLevelStore } from "@/stores/spellLevelStore";

export interface Props {
  spellName: string;
  initialDamageRoll: DiceString;
  damageKind: DamageKind;
}

export default function LevelledSpellDamageCell({ spellName, initialDamageRoll, damageKind }: Props) {
  const spellData = useStore($spellLevelStore);
  // Use store value if available, otherwise fall back to initial value
  // This ensures SSR and initial client render are consistent
  const damageRoll = spellData[spellName]?.damageRoll ?? initialDamageRoll;

  switch (damageKind) {
    case "attack":
      return <AttackDamageCell dice={damageRoll} />;
    case "regular":
      return (
        <span className="mono check-cell">
          <RollLink dice={damageRoll} />
        </span>
      );
  }
}
