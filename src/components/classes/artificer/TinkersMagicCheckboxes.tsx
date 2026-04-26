import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import { $tinkersMagicUsed } from "@/js/character/dynamic-state/stores";
import { useStore } from "@/js/hooks/useStore";

interface Props {
  maxUses: number;
}

export default function TinkersMagicCheckboxes({ maxUses }: Props) {
  const used = useStore($tinkersMagicUsed);

  const currentUsed = used ?? 0;

  const handleChange = (newCount: number) => {
    $tinkersMagicUsed.set(newCount > 0 ? newCount : undefined);
  };

  return (
    <span>
      <CheckboxUsesRow maxUses={maxUses} currentUsed={currentUsed} onChange={handleChange} /> long rest
    </span>
  );
}
