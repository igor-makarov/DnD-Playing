import { type Dispatch, type SetStateAction, useMemo } from "react";

import { useQueryState } from "./useQueryState";

// Sub-hook for managing hit points
function useHitPoints(): readonly [number | undefined, Dispatch<SetStateAction<number | undefined>>] {
  const [hitPointsStr, setHitPointsStr] = useQueryState("hit-points");

  return useMemo(
    () => [
      hitPointsStr !== undefined ? parseInt(hitPointsStr, 10) : undefined,
      (value) => {
        const resolvedValue = typeof value === "function" ? value(hitPointsStr !== undefined ? parseInt(hitPointsStr, 10) : undefined) : value;
        setHitPointsStr(resolvedValue !== undefined ? resolvedValue.toString() : undefined);
      },
    ],
    [hitPointsStr, setHitPointsStr],
  );
}

// Sub-hook for managing spell slots spent
// Returns array of numbers where each index represents spell level and value is slots used
// Format: Stored in URL as hyphen-separated string (e.g., "1-2-0" means 1 slot used at level 1, 2 at level 2, 0 at level 3)
// - Empty/undefined query param = no slots spent (returns empty array [])
// - Trailing zeros are automatically trimmed when saving (e.g., [1, 2, 0] -> "1-2")
// - Array indices correspond to spell levels (index 0 = level 1, index 1 = level 2, etc.)
function useSpellSlotsSpent(): readonly [number[], Dispatch<SetStateAction<number[]>>] {
  const [spellSlotsSpentStr, setSpellSlotsSpentStr] = useQueryState("spell-slots-spent");

  return useMemo(
    () => [
      spellSlotsSpentStr ? spellSlotsSpentStr.split("-").map((n) => parseInt(n, 10) || 0) : [],
      (value) => {
        const currentArray = spellSlotsSpentStr ? spellSlotsSpentStr.split("-").map((n) => parseInt(n, 10) || 0) : [];
        const resolvedValue = typeof value === "function" ? value(currentArray) : value;

        // Trim trailing zeros
        const trimmed = [...resolvedValue];
        while (trimmed.length > 0 && trimmed[trimmed.length - 1] === 0) {
          trimmed.pop();
        }

        setSpellSlotsSpentStr(trimmed.length > 0 ? trimmed.join("-") : undefined);
      },
    ],
    [spellSlotsSpentStr, setSpellSlotsSpentStr],
  );
}

// Centralized hook for managing all character dynamic state (HP, spell slots, etc.)
// Excludes roll mode which is managed separately via useRollMode

interface CharacterDynamicState {
  hitPoints: readonly [number | undefined, Dispatch<SetStateAction<number | undefined>>];
  spellSlotsSpent: readonly [number[], Dispatch<SetStateAction<number[]>>];
  finishLongRest: () => void;
}

export function useCharacterDynamicState(): CharacterDynamicState {
  const hitPoints = useHitPoints();
  const spellSlotsSpent = useSpellSlotsSpent();

  const finishLongRest = useMemo(
    () => () => {
      hitPoints[1](undefined);
      spellSlotsSpent[1]([]);
    },
    [hitPoints, spellSlotsSpent],
  );

  return {
    hitPoints,
    spellSlotsSpent,
    finishLongRest,
  };
}
