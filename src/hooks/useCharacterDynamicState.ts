import { useQueryState } from "./useQueryState";

// Centralized hook for managing all character dynamic state (HP, spell slots, etc.)
// Excludes roll mode which is managed separately via useRollMode

interface CharacterDynamicState {
  hitPointsSpent: readonly [string | undefined, (value: string | undefined) => void];
  spellSlotsSpent: readonly [string | undefined, (value: string | undefined) => void];
  finishLongRest: () => void;
}

export function useCharacterDynamicState(): CharacterDynamicState {
  const hitPointsSpent = useQueryState("hit-points-spent");
  const spellSlotsSpent = useQueryState("spell-slots-spent");

  const finishLongRest = () => {
    hitPointsSpent[1](undefined);
    spellSlotsSpent[1](undefined);
  };

  return {
    hitPointsSpent,
    spellSlotsSpent,
    finishLongRest,
  };
}
