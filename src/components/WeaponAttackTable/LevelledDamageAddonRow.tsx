import LevelDamageSelector from "@/components/common/LevelDamageSelector";
import type { LevelledDamage } from "@/js/character/DamageTypes";
import type { DamageAddonData } from "@/js/character/WeaponAttackTypes";
import type { DiceString } from "@/js/common/DiceString";

interface Props {
  addon: DamageAddonData & { damage: LevelledDamage };
  selectedLevel: number;
  onLevelChange: (level: number) => void;
}

export default function LevelledDamageAddonRow({ addon, selectedLevel, onLevelChange }: Props) {
  const getAddonDamage = (): DiceString | null => {
    if (selectedLevel === -1) {
      return null; // Off state
    }
    const option = addon.damage.options.find((opt) => opt.level === selectedLevel);
    return option ? option.damage : null;
  };

  const addonDamage = getAddonDamage();

  return (
    <tr>
      <td>
        {addon.name}
        &nbsp;
        <LevelDamageSelector options={addon.damage.options} selectedLevel={selectedLevel} onLevelChange={onLevelChange} optional={true} />
      </td>
      <td className="checkCell mono">{addonDamage && addonDamage.toString()}</td>
    </tr>
  );
}
