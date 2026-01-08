import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import { $humanHeroicInspirationUsed } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

export default function HeroicInspirationCheckboxes() {
  const used = useStore($humanHeroicInspirationUsed);

  const currentUsed = used ?? 0;

  const handleChange = (newCount: number) => {
    $humanHeroicInspirationUsed.set(newCount > 0 ? newCount : undefined);
  };

  return (
    <span>
      <CheckboxUsesRow maxUses={1} currentUsed={currentUsed} onChange={handleChange} /> long rest
    </span>
  );
}
