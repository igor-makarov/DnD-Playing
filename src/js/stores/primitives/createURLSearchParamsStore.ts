import type { SetStateAction } from "./StoreTypes";
import { type Store, createStore } from "./createStore";

export type HistoryMode = "pushState" | "replaceState";

function getURLSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

// Internal singleton store (single source of truth)
const internalStore: Store<URLSearchParams> = createStore<URLSearchParams>(getURLSearchParams(), {
  onMount: () => {
    if (typeof window === "undefined") return;

    // Set up event listener for browser back/forward navigation
    const callback = () => internalStore.set(getURLSearchParams());
    window.addEventListener("popstate", callback);

    // Return cleanup function
    return () => window.removeEventListener("popstate", callback);
  },
});

// Global batching state
let isBatching = false;

// Pending history mode that escalates: null -> replaceState -> pushState
let pendingHistoryMode: HistoryMode | null = null;

/**
 * Escalates the pending history mode.
 * null < replaceState < pushState
 */
function escalateHistoryMode(newMode: HistoryMode): void {
  if (pendingHistoryMode === null) {
    pendingHistoryMode = newMode;
  } else if (pendingHistoryMode === "replaceState" && newMode === "pushState") {
    pendingHistoryMode = "pushState";
  }
  // If already "pushState", stay at "pushState"
}

/**
 * Flushes the pending URL update with the specified history mode.
 */
function flushPendingUpdate(historyMode: HistoryMode): void {
  const finalState = internalStore.get();

  if (typeof window !== "undefined") {
    const currentURL = window.location.pathname + window.location.search;
    const newURL = finalState.toString() ? `${window.location.pathname}?${finalState}` : window.location.pathname;

    // Only update if URL actually changed (prevents duplicate history entries)
    if (newURL !== currentURL) {
      window.history[historyMode]({}, "", newURL);
    }
  }
}

/**
 * Factory that creates a proxy store for URLSearchParams with a specific history mode.
 * All proxies delegate to a single internal store, ensuring one flush operation per batch.
 */
export function createURLSearchParamsStore(historyMode: HistoryMode = "pushState"): Store<URLSearchParams> {
  // Return proxy store that delegates to internal store
  return {
    get: () => internalStore.get(),
    set: (value: SetStateAction<URLSearchParams>): void => {
      const newState = typeof value === "function" ? value(internalStore.get()) : value;

      // Always update store state and notify listeners immediately
      internalStore.set(newState);

      // If not batching, flush URL update immediately
      if (!isBatching) {
        flushPendingUpdate(historyMode);
      } else {
        // During batching, escalate the history mode
        escalateHistoryMode(historyMode);
      }
    },
    subscribe: (callback) => internalStore.subscribe(callback),
    getInitialValue: () => internalStore.getInitialValue(),
  };
}

/**
 * Global batch updates function that batches all URL search params updates
 * across all store instances, resulting in a single history entry.
 */
export function batchUpdates(operation: () => void): void {
  if (isBatching) {
    // Already batching, just run the operation
    operation();
    return;
  }

  isBatching = true;
  pendingHistoryMode = null; // Reset before batch

  try {
    operation();
  } finally {
    isBatching = false;

    // After batching completes, flush once with the escalated history mode
    if (pendingHistoryMode !== null) {
      flushPendingUpdate(pendingHistoryMode);
      pendingHistoryMode = null;
    }
  }
}
