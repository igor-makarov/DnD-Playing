import type { OptionalDamage } from "@/js/character/DamageTypes";
import type { DamageAddonData } from "@/js/character/WeaponAttackTypes";

interface Props {
  addon: DamageAddonData & { damage: OptionalDamage };
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function OptionalDamageAddonRow({ addon, isEnabled, onToggle }: Props) {
  return (
    <tr>
      <td>
        {addon.name}
        &nbsp;
        <input type="checkbox" checked={isEnabled} onChange={(e) => onToggle(e.target.checked)} />
      </td>
      <td className="checkCell mono">{isEnabled && addon.damage.damage.toString()}</td>
    </tr>
  );
}
