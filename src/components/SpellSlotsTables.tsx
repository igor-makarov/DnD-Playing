import type { Character } from "@/js/character/Character";

import SpellSlotsTable from "./spells/SpellSlotsTable";
import WarlockSpellSlotsTable from "./spells/WarlockSpellSlotsTable";

interface Props {
  character: Character;
}

export default function SpellSlotsTables({ character }: Props) {
  const spellSlots = character.getSpellSlots();
  const warlockSpellSlots = character.getWarlockSpellSlots();

  return (
    <>
      <SpellSlotsTable spellSlots={spellSlots} />
      <WarlockSpellSlotsTable warlockSpellSlots={warlockSpellSlots} />
    </>
  );
}
