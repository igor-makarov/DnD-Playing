import { useSyncExternalStore } from "react";

// Enum for roll modifier types
export enum RollModifier {
  NONE = "NONE",
  ADVANTAGE = "ADVANTAGE",
  DISADVANTAGE = "DISADVANTAGE",
  REGULAR = "REGULAR",
  CRITICAL = "CRITICAL",
}

// Global state
let modifierState: RollModifier = RollModifier.NONE;
const listeners = new Set<() => void>();

// Subscribe function for useSyncExternalStore
function subscribe(callback: () => void) {
  initializeEventListeners();
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Notify all listeners
function notifyListeners() {
  listeners.forEach((listener) => listener());
}

// Get current state
function getSnapshot() {
  return modifierState;
}

// Server snapshot (for SSR)
function getServerSnapshot() {
  return RollModifier.NONE;
}

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

    if (newState !== null && modifierState !== newState) {
      modifierState = newState;
      notifyListeners();
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const shouldReset =
      (key === "a" && modifierState === RollModifier.ADVANTAGE) ||
      (key === "d" && modifierState === RollModifier.DISADVANTAGE) ||
      (key === "s" && modifierState === RollModifier.REGULAR) ||
      (key === "c" && modifierState === RollModifier.CRITICAL);

    if (shouldReset) {
      modifierState = RollModifier.NONE;
      notifyListeners();
    }
  };

  const handleFocus = () => {
    // Reset modifier state when page regains focus
    if (modifierState !== RollModifier.NONE) {
      modifierState = RollModifier.NONE;
      notifyListeners();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("focus", handleFocus);
}

// Hook to use roll modifiers
export function useRollModifiers() {
  const modifier = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const resetModifiers = () => {
    modifierState = RollModifier.NONE;
    notifyListeners();
  };

  return { modifier, resetModifiers };
}
