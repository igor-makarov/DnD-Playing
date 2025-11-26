import { createStore } from "./createStore";

type SetStateAction<S> = S | ((prevState: S) => S);

export type HistoryMode = "pushState" | "replaceState";

export interface SearchParamsSetOptions {
  historyMode?: HistoryMode;
}

export interface SearchParamsStore {
  get: () => URLSearchParams;
  set: (value: SetStateAction<URLSearchParams>, options?: SearchParamsSetOptions) => void;
  subscribe: (listener: (state: URLSearchParams) => void) => () => void;
  getInitialValue: () => URLSearchParams;
}

// Helper to dispatch custom events when URL changes programmatically
function dispatchURLChangeEvent(type: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(type));
}

function getURLSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
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

// Override set to update URL
function set(value: SetStateAction<URLSearchParams>, options?: SearchParamsSetOptions): void {
  const historyMode = options?.historyMode ?? "pushState";
  const state = store.get();
  const newState = typeof value === "function" ? (value as (prevState: URLSearchParams) => URLSearchParams)(state) : value;

  // Update URL
  if (typeof window !== "undefined") {
    const newSearch = newState.toString();
    const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
    window.history[historyMode]({}, "", newURL);

    // Dispatch custom event to notify subscribers
    dispatchURLChangeEvent(historyMode === "replaceState" ? "replacestate" : "pushstate");
  }

  // Update store
  originalSet(newState);
}

/**
 * Singleton store that works with URLSearchParams directly.
 * This is the lower-level primitive that manages the entire query string.
 */
export const $searchParamsStore: SearchParamsStore = {
  get: store.get,
  set,
  subscribe: store.subscribe,
  getInitialValue: store.getInitialValue,
};
