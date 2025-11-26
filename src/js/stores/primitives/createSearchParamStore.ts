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

export interface SearchParamStoreOptions<S> {
  encode?: (value: S) => string | undefined;
  decode?: (value: string) => S;
}

/**
 * Creates a store for a single query parameter.
 * Composes on top of a searchParamsStore for URL synchronization.
 */
export function createSearchParamStore<S>(
  searchParamsStore: Store<URLSearchParams>,
  paramName: string,
  defaultValue: S,
  options?: SearchParamStoreOptions<S>,
): Store<S> {
  const encode = options?.encode ?? ((v: S) => defaultSerialize(v));
  const decode = options?.decode ?? ((v: string) => defaultDeserialize(v, defaultValue));

  // Helper to extract value from params
  const extractValue = (params: URLSearchParams): S => {
    const value = params.get(paramName);
    return value !== null ? decode(value) : defaultValue;
  };

  // Start with default value, will be restored from URL in onMount
  const initialValue = defaultValue;

  // Create base store with onMount lifecycle
  const store = createStore<S>(initialValue, {
    onMount: () => {
      // Restore value from URL when first subscriber is added
      const currentParams = searchParamsStore.get();
      const currentValue = extractValue(currentParams);
      if (!isEqual(store.get(), currentValue)) {
        originalSet(currentValue);
      }

      // Subscribe to URL changes via searchParamsStore
      return searchParamsStore.subscribe((params: URLSearchParams) => {
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

    // Update URL via searchParamsStore
    searchParamsStore.set((params: URLSearchParams) => {
      const newParams = new URLSearchParams(params);
      if (isEqual(newState, defaultValue)) {
        newParams.delete(paramName);
      } else {
        const encoded = encode(newState);
        if (encoded === undefined) {
          newParams.delete(paramName);
        } else {
          newParams.set(paramName, encoded);
        }
      }
      return newParams;
    });

    // Update store
    originalSet(newState);
  };

  return store;
}
