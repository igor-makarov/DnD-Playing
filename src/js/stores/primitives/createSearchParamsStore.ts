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

      // Set up event listeners when first subscriber is added
      const callback = () => {
        const newParams = getURLSearchParams();
        originalSet(newParams);
      };

      window.addEventListener("popstate", callback);
      window.addEventListener("pushstate", callback);
      window.addEventListener("replacestate", callback);

      // Return cleanup function
      return () => {
        window.removeEventListener("popstate", callback);
        window.removeEventListener("pushstate", callback);
        window.removeEventListener("replacestate", callback);
      };
    },
  });

  // Keep reference to original set
  const originalSet = store.set;

  // Override set to update URL with the fixed historyMode
  function set(value: SetStateAction<URLSearchParams>): void {
    const state = store.get();
    const newState = typeof value === "function" ? (value as (prevState: URLSearchParams) => URLSearchParams)(state) : value;

    // Update URL
    if (typeof window !== "undefined") {
      const newSearch = newState.toString();
      const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
      const currentURL = window.location.pathname + window.location.search;

      // Only push history if URL actually changed (prevents double entries in Safari)
      if (newURL !== currentURL) {
        window.history[historyMode]({}, "", newURL);
      }
    }

    // Update store
    originalSet(newState);
  }

  const wrappedStore: Store<URLSearchParams> = {
    get: store.get,
    set,
    subscribe: store.subscribe,
    getInitialValue: store.getInitialValue,
  };

  // Cache the store instance
  storeCache.set(historyMode, wrappedStore);

  return wrappedStore;
}
