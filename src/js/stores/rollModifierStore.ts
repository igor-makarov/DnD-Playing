import { createStore } from "@/js/stores/primitives/createStore";

export type RollModifier = "NONE" | "ADVANTAGE" | "DISADVANTAGE" | "REGULAR" | "CRITICAL";

// Create the store
export const $rollModifierStore = createStore<RollModifier>("NONE");

// Initialize event listeners once
let initialized = false;

function initializeEventListeners() {
  if (initialized) return;
  initialized = true;

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    let newState: RollModifier | null = null;

    if (key === "s") {
      newState = "REGULAR";
    } else if (key === "a") {
      newState = "ADVANTAGE";
    } else if (key === "d") {
      newState = "DISADVANTAGE";
    } else if (key === "c") {
      newState = "CRITICAL";
    }

    if (newState !== null && $rollModifierStore.get() !== newState) {
      $rollModifierStore.set(newState);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const currentState = $rollModifierStore.get();
    const shouldReset =
      (key === "a" && currentState === "ADVANTAGE") ||
      (key === "d" && currentState === "DISADVANTAGE") ||
      (key === "s" && currentState === "REGULAR") ||
      (key === "c" && currentState === "CRITICAL");

    if (shouldReset) {
      $rollModifierStore.set("NONE");
    }
  };

  const handleFocus = () => {
    // Reset modifier state when page regains focus
    if ($rollModifierStore.get() !== "NONE") {
      $rollModifierStore.set("NONE");
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("focus", handleFocus);
}

// Initialize when the module loads (client-side only)
if (typeof window !== "undefined") {
  initializeEventListeners();
}
