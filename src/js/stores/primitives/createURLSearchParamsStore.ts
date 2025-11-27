import type { SetStateAction } from "./StoreTypes";
import { type Store, createStore } from "./createStore";

export type HistoryMode = "pushState" | "replaceState";

function getURLSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

// Cache to store singleton instances per historyMode
const storeCache = new Map<HistoryMode, Store<URLSearchParams>>();

/**
 * Factory that creates a singleton store for URLSearchParams with a specific history mode.
 * Returns cached instances, so effectively there are N singletons (one per historyMode).
 */
export function createURLSearchParamsStore(historyMode: HistoryMode = "pushState"): Store<URLSearchParams> {
  if (storeCache.has(historyMode)) {
    return storeCache.get(historyMode)!;
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

  // Override set to update URL
  const originalSet = store.set;
  store.set = (value: SetStateAction<URLSearchParams>): void => {
    const newState = typeof value === "function" ? value(store.get()) : value;

    if (typeof window !== "undefined") {
      const currentURL = window.location.pathname + window.location.search;
      const newURL = newState.toString() ? `${window.location.pathname}?${newState}` : window.location.pathname;
      // Update URL with history mode IFF changed (prevents double entries in Safari)
      if (newURL !== currentURL) {
        window.history[historyMode]({}, "", newURL);
      }
    }

    originalSet(newState);
  };

  storeCache.set(historyMode, store);

  return store;
}
