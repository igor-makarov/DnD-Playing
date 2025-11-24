import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

// Enum for roll modifier types
export enum RollModifier {
  NONE = "NONE",
  ADVANTAGE = "ADVANTAGE",
  DISADVANTAGE = "DISADVANTAGE",
  REGULAR = "REGULAR",
  CRITICAL = "CRITICAL",
}

// Create the nanostore atom
export const rollModifierStore = atom<RollModifier>(RollModifier.NONE);

// Initialize event listeners once
let initialized = false;

function initializeEventListeners() {
  if (initialized) return;
  initialized = true;

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    let newState: RollModifier | null = null;

    if (key === "s") {
      newState = RollModifier.REGULAR;
    } else if (key === "a") {
      newState = RollModifier.ADVANTAGE;
    } else if (key === "d") {
      newState = RollModifier.DISADVANTAGE;
    } else if (key === "c") {
      newState = RollModifier.CRITICAL;
    }

    if (newState !== null && rollModifierStore.get() !== newState) {
      rollModifierStore.set(newState);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const currentState = rollModifierStore.get();
    const shouldReset =
      (key === "a" && currentState === RollModifier.ADVANTAGE) ||
      (key === "d" && currentState === RollModifier.DISADVANTAGE) ||
      (key === "s" && currentState === RollModifier.REGULAR) ||
      (key === "c" && currentState === RollModifier.CRITICAL);

    if (shouldReset) {
      rollModifierStore.set(RollModifier.NONE);
    }
  };

  const handleFocus = () => {
    // Reset modifier state when page regains focus
    if (rollModifierStore.get() !== RollModifier.NONE) {
      rollModifierStore.set(RollModifier.NONE);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("focus", handleFocus);
}

// Hook to use roll modifiers
export function useRollModifiers() {
  initializeEventListeners();
  const modifier = useStore(rollModifierStore);

  const resetModifiers = () => {
    rollModifierStore.set(RollModifier.NONE);
  };

  return { modifier, resetModifiers };
}
