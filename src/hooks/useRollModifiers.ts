import { useSyncExternalStore } from "react";

// Global state
let modifierState = { advantage: false, disadvantage: false };
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
  return { advantage: false, disadvantage: false };
}

// Initialize event listeners once
let initialized = false;

function initializeEventListeners() {
  if (initialized) return;
  initialized = true;

  const handleKeyDown = (e: KeyboardEvent) => {
    let changed = false;
    if (e.key === "a" || e.key === "A") {
      if (!modifierState.advantage) {
        modifierState = { ...modifierState, advantage: true };
        changed = true;
      }
    }
    if (e.key === "d" || e.key === "D") {
      if (!modifierState.disadvantage) {
        modifierState = { ...modifierState, disadvantage: true };
        changed = true;
      }
    }
    if (changed) notifyListeners();
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    let changed = false;
    if (e.key === "a" || e.key === "A") {
      if (modifierState.advantage) {
        modifierState = { ...modifierState, advantage: false };
        changed = true;
      }
    }
    if (e.key === "d" || e.key === "D") {
      if (modifierState.disadvantage) {
        modifierState = { ...modifierState, disadvantage: false };
        changed = true;
      }
    }
    if (changed) notifyListeners();
  };

  const handleFocus = () => {
    // Reset modifier state when page regains focus
    if (modifierState.advantage || modifierState.disadvantage) {
      modifierState = { advantage: false, disadvantage: false };
      notifyListeners();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("focus", handleFocus);
}

// Hook to use roll modifiers
export function useRollModifiers() {
  const modifiers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const resetModifiers = () => {
    modifierState = { advantage: false, disadvantage: false };
    notifyListeners();
  };

  return { modifiers, resetModifiers };
}
