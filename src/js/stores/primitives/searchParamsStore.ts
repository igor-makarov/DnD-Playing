type SetStateAction<S> = S | ((prevState: S) => S);

export interface SearchParamsSetOptions {
  historyMode?: "pushState" | "replaceState";
}

export interface SearchParamsStore {
  get: () => URLSearchParams;
  set: (value: SetStateAction<URLSearchParams>, options?: SearchParamsSetOptions) => void;
  subscribe: (listener: (state: URLSearchParams) => void) => () => void;
  getInitialValue: () => URLSearchParams;
}

/**
 * Singleton store that works with URLSearchParams directly.
 * This is the lower-level primitive that manages the entire query string.
 */
function createSearchParamsStoreInstance(): SearchParamsStore {
  // Read initial value from URL
  const getURLParams = (): URLSearchParams => {
    if (typeof window === "undefined") return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  };

  const initialValue = getURLParams();
  let state = getURLParams();
  const listeners = new Set<(state: URLSearchParams) => void>();

  function get(): URLSearchParams {
    return state;
  }

  function getInitialValue(): URLSearchParams {
    return initialValue;
  }

  function set(value: SetStateAction<URLSearchParams>, options?: SearchParamsSetOptions): void {
    const historyMode = options?.historyMode ?? "pushState";
    const newState = typeof value === "function" ? (value as (prevState: URLSearchParams) => URLSearchParams)(state) : value;
    state = newState;

    // Update URL
    if (typeof window !== "undefined") {
      const newSearch = state.toString();
      const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
      window.history[historyMode]({}, "", newURL);
    }

    listeners.forEach((fn) => fn(state));
  }

  function subscribe(listener: (state: URLSearchParams) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  // Listen to popstate for browser back/forward
  if (typeof window !== "undefined") {
    const handlePopState = () => {
      const newParams = getURLParams();
      if (newParams.toString() !== state.toString()) {
        state = newParams;
        listeners.forEach((fn) => fn(state));
      }
    };
    window.addEventListener("popstate", handlePopState);
  }

  return { get, set, subscribe, getInitialValue };
}

// Create and export the singleton instance
export const $searchParamsStore = createSearchParamsStoreInstance();
