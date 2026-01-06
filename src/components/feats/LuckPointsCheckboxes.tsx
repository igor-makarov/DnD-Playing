import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import { $luckPointsUsed } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  maxLuckPoints: number;
}

export default function LuckPointsCheckboxes({ maxLuckPoints }: Props) {
  const used = useStore($luckPointsUsed);

  const currentUsed = used ?? 0;

  const handleChange = (newCount: number) => {
    $luckPointsUsed.set(newCount > 0 ? newCount : undefined);
  };

  return (
    <span>
      <CheckboxUsesRow maxUses={maxLuckPoints} currentUsed={currentUsed} onChange={handleChange} /> long rest
    </span>
  );
}
