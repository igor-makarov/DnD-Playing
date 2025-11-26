import { type Store, createStore } from "./createStore";

type SetStateAction<S> = S | ((prevState: S) => S);

export type HistoryMode = "pushState" | "replaceState";

function getURLSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

// Cache to store singleton instances per historyMode
const storeCache = new Map<HistoryMode, Store<URLSearchParams>>();

/**
 * Factory that creates a singleton store for URLSearchParams with a specific history mode.
 * Returns cached instances, so effectively there are two singletons (one per historyMode).
 */
export function createSearchParamsStore(historyMode: HistoryMode = "pushState"): Store<URLSearchParams> {
  // Return cached instance if it exists
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

  // Keep reference to original set
  const originalSet = store.set;

  // Override set to update URL with the fixed historyMode
  store.set = (value: SetStateAction<URLSearchParams>): void => {
    const newState = typeof value === "function" ? value(store.get()) : value;

    // Update URL and push history if changed (prevents double entries in Safari)
    if (typeof window !== "undefined") {
      const currentURL = window.location.pathname + window.location.search;
      const newURL = newState.toString() ? `${window.location.pathname}?${newState}` : window.location.pathname;
      if (newURL !== currentURL) {
        window.history[historyMode]({}, "", newURL);
      }
    }

    originalSet(newState);
  };

  // Cache the store instance
  storeCache.set(historyMode, store);

  return store;
}
