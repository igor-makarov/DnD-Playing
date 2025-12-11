import LevelDamageSelector from "@/components/common/LevelDamageSelector";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { $spellLevelStore } from "@/stores/spellLevelStore";

interface LevelOption {
  level: number;
  damage: DiceString;
}

export interface Props {
  spellName: string;
  options: LevelOption[];
  optional?: boolean;
}

export default function LevelledSpellLevelSelector({ spellName, options, optional = false }: Props) {
  const spellData = useStore($spellLevelStore);

  const selectedLevel = spellData[spellName]?.level ?? options[0]?.level ?? 1;

  const handleLevelChange = (level: number) => {
    const option = options.find((opt) => opt.level === level);
    if (option) {
      $spellLevelStore.set((prev) => ({
        ...prev,
        [spellName]: { level, damageRoll: option.damage },
      }));
    }
  };

  return <LevelDamageSelector options={options} selectedLevel={selectedLevel} onLevelChange={handleLevelChange} optional={optional} />;
}
