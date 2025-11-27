import type { SetStateAction } from "./StoreTypes";
import { type Store, createStore } from "./createStore";

export type HistoryMode = "pushState" | "replaceState";

interface URLSearchParamsStore extends Store<URLSearchParams> {
  flushPendingUpdate: () => void;
}

// Cache to store singleton instances per historyMode
const storeCache = new Map<HistoryMode, URLSearchParamsStore>();

// Global batching state
let isBatching = false;

/**
 * Factory that creates a singleton store for URLSearchParams with a specific history mode.
 * Returns cached instances, so effectively there are N singletons (one per historyMode).
 */
export function createURLSearchParamsStore(historyMode: HistoryMode = "pushState"): URLSearchParamsStore {
  if (storeCache.has(historyMode)) {
    return storeCache.get(historyMode)!;
  }

  function getURLSearchParams(): URLSearchParams {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }

  // Create the base store using createStore
  const store = createStore<URLSearchParams>(getURLSearchParams(), {
    onMount: () => {
      if (typeof window === "undefined") return;

      // Set up event listener for browser back/forward navigation
      const callback = () => originalSet(getURLSearchParams());
      window.addEventListener("popstate", callback);

      // Return cleanup function
      return () => window.removeEventListener("popstate", callback);
    },
  });

  // Create store with batching state
  const storeWithBatch: URLSearchParamsStore = {
    ...store,
    flushPendingUpdate: () => {
      // Get current state from base store
      const finalState = store.get();

      if (typeof window !== "undefined") {
        const currentURL = window.location.pathname + window.location.search;
        const newURL = finalState.toString() ? `${window.location.pathname}?${finalState}` : window.location.pathname;

        // Only update if URL actually changed (prevents duplicate history entries)
        if (newURL !== currentURL) {
          window.history[historyMode]({}, "", newURL);
        }
      }
    },
  };

  // Override set to update URL
  const originalSet = store.set;
  storeWithBatch.set = (value: SetStateAction<URLSearchParams>): void => {
    const newState = typeof value === "function" ? value(store.get()) : value;

    // Always update store state and notify listeners immediately
    originalSet(newState);

    // If not batching, flush URL update immediately
    if (!isBatching) {
      storeWithBatch.flushPendingUpdate();
    }
  };

  storeCache.set(historyMode, storeWithBatch);

  return storeWithBatch;
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

  try {
    operation();
  } finally {
    isBatching = false;

    // After batching completes, flush pending updates from all stores
    storeCache.forEach((store) => {
      store.flushPendingUpdate();
    });
  }
}
