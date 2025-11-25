import { createSearchParamStore } from "./primitives/createSearchParamStore";
import { closedStringCodec } from "./primitives/queryCodecs";

export type RollMode = "app" | "site";

export const rollModeStore = createSearchParamStore<RollMode>("roll", "app", closedStringCodec(["app", "site"]));

// Initialize keydown event listener once
let initialized = false;

function initializeEventListeners() {
  if (initialized) return;
  initialized = true;

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    if (key === "r" && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const target = e.target as HTMLElement;
      // Skip if typing in input, textarea, or contenteditable
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      e.preventDefault();

      // Toggle between "app" and "site"
      const current = rollModeStore.get();
      if (current === "site") {
        rollModeStore.set("app");
      } else {
        rollModeStore.set("site");
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
}

// Initialize when the module loads (client-side only)
if (typeof window !== "undefined") {
  initializeEventListeners();
}
