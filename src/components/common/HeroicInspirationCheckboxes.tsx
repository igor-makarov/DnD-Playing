import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import { $heroicInspiration } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

export default function HeroicInspirationCheckboxes() {
  const heroicInspiration = useStore($heroicInspiration);

  const currentAmount = heroicInspiration ?? 0;

  const handleChange = (newAmount: number) => {
    const clamped = Math.min(1, Math.max(0, newAmount));
    $heroicInspiration.set(clamped > 0 ? clamped : undefined);
  };

  return <CheckboxUsesRow maxUses={1} currentUsed={currentAmount} onChange={handleChange} />;
}
