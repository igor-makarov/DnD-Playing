import { useStore } from "@nanostores/react";

import { type Dispatch, type SetStateAction } from "react";

import { queryAtom } from "../stores/queryStores";

// Query atoms for character dynamic state
const $hitPoints = queryAtom<number | undefined>("hit-points", undefined, {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
});

const $spellSlotsSpent = queryAtom<number[] | undefined>("spell-slots-spent", undefined, {
  encode: (value) => {
    if (value === undefined) return undefined;
    // Trim trailing zeros
    const trimmed = [...value];
    while (trimmed.length > 0 && trimmed[trimmed.length - 1] === 0) {
      trimmed.pop();
    }
    return trimmed.length > 0 ? trimmed.join("-") : undefined;
  },
  decode: (str) => str.split("-").map((n: string) => parseInt(n, 10) || 0),
});

const $channelDivinityUsed = queryAtom<number | undefined>("channel-divinity-used", undefined, {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
});

const $layOnHands = queryAtom<number | undefined>("lay-on-hands", undefined, {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
});

// Generic type for state tuple with optional values
type StateWithSetter<T> = readonly [T | undefined, Dispatch<SetStateAction<T | undefined>>];

// Sub-hook for managing hit points
function useHitPoints(): StateWithSetter<number> {
  const currentHP = useStore($hitPoints);

  const setHP = (value: SetStateAction<number | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentHP) : value;
    $hitPoints.set(resolvedValue);
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
  const currentArray = useStore($spellSlotsSpent);

  const setSlots = (value: SetStateAction<number[] | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentArray) : value;
    $spellSlotsSpent.set(resolvedValue);
  };

  return [currentArray, setSlots];
}

// Sub-hook for managing channel divinity uses
function useChannelDivinityUsed(): StateWithSetter<number> {
  const currentUsed = useStore($channelDivinityUsed);

  const setUsed = (value: SetStateAction<number | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentUsed) : value;
    $channelDivinityUsed.set(resolvedValue);
  };

  return [currentUsed, setUsed];
}

// Sub-hook for managing Lay on Hands points remaining
function useLayOnHands(): StateWithSetter<number> {
  const currentPoints = useStore($layOnHands);

  const setPoints = (value: SetStateAction<number | undefined>) => {
    const resolvedValue = typeof value === "function" ? value(currentPoints) : value;
    $layOnHands.set(resolvedValue);
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
