import { type Dispatch, type SetStateAction } from "react";

import { useQueryState } from "./useQueryState";

// Generic type for state tuple with optional values
type StateWithSetter<T> = readonly [T | undefined, Dispatch<SetStateAction<T | undefined>>];

// Sub-hook for managing hit points
function useHitPoints(): StateWithSetter<number> {
  const [hitPointsStr, setHitPointsStr] = useQueryState("hit-points");

  const currentHP = hitPointsStr !== undefined ? parseInt(hitPointsStr, 10) : undefined;

  const setHP = (value: SetStateAction<number | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentHP) : value;
    setHitPointsStr(resolvedValue !== undefined ? resolvedValue.toString() : undefined);
  };

  return [currentHP, setHP];
}

// Sub-hook for managing spell slots spent
// Returns array of numbers where each index represents spell level and value is slots used
// Format: Stored in URL as hyphen-separated string (e.g., "1-2-0" means 1 slot used at level 1, 2 at level 2, 0 at level 3)
// - Empty/undefined query param = no slots spent (returns undefined)
// - Trailing zeros are automatically trimmed when saving (e.g., [1, 2, 0] -> "1-2")
// - Array indices correspond to spell levels (index 0 = level 1, index 1 = level 2, etc.)
function useSpellSlotsSpent(): StateWithSetter<number[]> {
  const [spellSlotsSpentStr, setSpellSlotsSpentStr] = useQueryState("spell-slots-spent");

  const currentArray = spellSlotsSpentStr ? spellSlotsSpentStr.split("-").map((n) => parseInt(n, 10) || 0) : undefined;

  const setSlots = (value: SetStateAction<number[] | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentArray) : value;

    if (resolvedValue === undefined) {
      setSpellSlotsSpentStr(undefined);
      return;
    }

    // Trim trailing zeros
    const trimmed = [...resolvedValue];
    while (trimmed.length > 0 && trimmed[trimmed.length - 1] === 0) {
      trimmed.pop();
    }

    setSpellSlotsSpentStr(trimmed.length > 0 ? trimmed.join("-") : undefined);
  };

  return [currentArray, setSlots];
}

// Sub-hook for managing channel divinity uses
function useChannelDivinityUsed(): StateWithSetter<number> {
  const [channelDivinityUsedStr, setChannelDivinityUsedStr] = useQueryState("channel-divinity-used");

  const currentUsed = channelDivinityUsedStr !== undefined ? parseInt(channelDivinityUsedStr, 10) : undefined;

  const setUsed = (value: SetStateAction<number | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentUsed) : value;
    setChannelDivinityUsedStr(resolvedValue !== undefined ? resolvedValue.toString() : undefined);
  };

  return [currentUsed, setUsed];
}

// Sub-hook for managing Lay on Hands points remaining
function useLayOnHands(): StateWithSetter<number> {
  const [layOnHandsStr, setLayOnHandsStr] = useQueryState("lay-on-hands");

  const currentPoints = layOnHandsStr !== undefined ? parseInt(layOnHandsStr, 10) : undefined;

  const setPoints = (value: SetStateAction<number | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentPoints) : value;
    setLayOnHandsStr(resolvedValue !== undefined ? resolvedValue.toString() : undefined);
  };

  return [currentPoints, setPoints];
}

// Centralized hook for managing all character dynamic state (HP, spell slots, etc.)
// Excludes roll mode which is managed separately via useRollMode

interface CharacterDynamicState {
  useHitPoints: StateWithSetter<number>;
  useSpellSlotsSpent: StateWithSetter<number[]>;
  useChannelDivinityUsed: StateWithSetter<number>;
  useLayOnHands: StateWithSetter<number>;
  finishShortRest: () => void;
  finishLongRest: () => void;
}

export function useCharacterDynamicState(): CharacterDynamicState {
  const [hitPoints, setHitPoints] = useHitPoints();
  const [spellSlotsSpent, setSpellSlotsSpent] = useSpellSlotsSpent();
  const [channelDivinityUsed, setChannelDivinityUsed] = useChannelDivinityUsed();
  const [layOnHands, setLayOnHands] = useLayOnHands();

  const finishShortRest = () => {
    setChannelDivinityUsed(undefined);
  };

  const finishLongRest = () => {
    setHitPoints(undefined);
    setSpellSlotsSpent(undefined);
    setChannelDivinityUsed(undefined);
    setLayOnHands(undefined);
  };

  return {
    useHitPoints: [hitPoints, setHitPoints],
    useSpellSlotsSpent: [spellSlotsSpent, setSpellSlotsSpent],
    useChannelDivinityUsed: [channelDivinityUsed, setChannelDivinityUsed],
    useLayOnHands: [layOnHands, setLayOnHands],
    finishShortRest,
    finishLongRest,
  };
}
