import { type Store, createStore } from "./createStore";

type SetStateAction<S> = S | ((prevState: S) => S);

function defaultSerialize<S>(value: S): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function defaultDeserialize<S>(value: string, defaultValue: S): S {
  if (typeof defaultValue === "string") return value as S;
  if (typeof defaultValue === "number") return Number(value) as S;
  if (typeof defaultValue === "boolean") return (value === "true") as S;
  try {
    return JSON.parse(value) as S;
  } catch {
    return defaultValue;
  }
}

function isEqual<S>(a: S, b: S): boolean {
  if (a === b) return true;
  if (typeof a === "object" && typeof b === "object" && a !== null && b !== null) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return false;
}

// Subscribe to URL changes (popstate for back/forward, and custom events for programmatic changes)
function subscribeToQueryString(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("popstate", callback);
  window.addEventListener("pushstate", callback);
  window.addEventListener("replacestate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("pushstate", callback);
    window.removeEventListener("replacestate", callback);
  };
}

// Get current URLSearchParams
function getParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

// Helper to dispatch custom events when URL changes programmatically
function dispatchURLChangeEvent(type: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(type));
}

// Helper to update URL with new params
function updateURL(params: URLSearchParams, mode: "pushState" | "replaceState" = "pushState") {
  if (typeof window === "undefined") return;
  const newSearch = params.toString();
  const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;

  if (mode === "replaceState") {
    window.history.replaceState({}, "", newURL);
    dispatchURLChangeEvent("replacestate");
  } else {
    window.history.pushState({}, "", newURL);
    dispatchURLChangeEvent("pushstate");
  }
}

export interface SearchParamStoreOptions<S> {
  encode?: (value: S) => string | undefined;
  decode?: (value: string) => S;
  historyMode?: "pushState" | "replaceState";
}

/**
 * Creates a store for a single query parameter.
 * Uses createStore with onMount lifecycle for URL synchronization.
 */
export function createSearchParamStore<S>(paramName: string, defaultValue: S, options?: SearchParamStoreOptions<S>): Store<S> {
  const encode = options?.encode ?? ((v: S) => defaultSerialize(v));
  const decode = options?.decode ?? ((v: string) => defaultDeserialize(v, defaultValue));
  const historyMode = options?.historyMode ?? "pushState";

  // Helper to extract value from params
  const extractValue = (params: URLSearchParams): S => {
    const value = params.get(paramName);
    return value !== null ? decode(value) : defaultValue;
  };

  // Get initial value from URL
  const initialValue = extractValue(new URLSearchParams());

  // Create base store with onMount lifecycle
  const store = createStore<S>(initialValue, {
    onMount: () => {
      // Restore value from URL when first subscriber is added
      const currentParams = getParams();
      const currentValue = extractValue(currentParams);
      if (!isEqual(store.get(), currentValue)) {
        originalSet(currentValue);
      }

      // Subscribe to URL changes
      return subscribeToQueryString(() => {
        const params = getParams();
        const newValue = extractValue(params);
        if (!isEqual(store.get(), newValue)) {
          originalSet(newValue);
        }
      });
    },
  });

  // Keep reference to original set
  const originalSet = store.set;

  // Override set to update URL
  store.set = (value: SetStateAction<S>) => {
    const currentState = store.get();
    const newState = typeof value === "function" ? (value as (prevState: S) => S)(currentState) : value;

    // Update URL
    const params = getParams();
    if (isEqual(newState, defaultValue)) {
      params.delete(paramName);
    } else {
      const encoded = encode(newState);
      if (encoded === undefined) {
        params.delete(paramName);
      } else {
        params.set(paramName, encoded);
      }
    }
    updateURL(params, historyMode);

    // Update store
    originalSet(newState);
  };

  return store;
}
