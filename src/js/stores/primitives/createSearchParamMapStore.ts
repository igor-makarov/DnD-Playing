import type { SearchParamStoreOptions, SetStateAction } from "./StoreTypes";
import { type Store, createStore } from "./createStore";

export interface MapStore<S extends Record<string, any>> extends Store<S> {
  setKey: <K extends keyof S>(key: K, value: S[K]) => void;
}

/**
 * Creates a map store for multiple query parameters with a common prefix.
 * Composes on top of a searchParamsStore for URL synchronization.
 */
export function createSearchParamMapStore<S>(
  searchParamsStore: Store<URLSearchParams>,
  prefix: string,
  defaultValue: Record<string, S>,
  options: SearchParamStoreOptions<S>,
): MapStore<Record<string, S>> {
  const { encode, decode } = options;

  // Extract all prefixed params from URL
  const extractValues = (params: URLSearchParams): Record<string, S> => {
    const result: Record<string, S> = {};
    for (const [key, value] of params.entries()) {
      if (key.startsWith(prefix)) {
        result[key.slice(prefix.length)] = decode(value);
      }
    }
    return result;
  };

  let isRestoring = false;

  const baseStore = createStore<Record<string, S>>(defaultValue, {
    onMount: () => {
      // Restore from URL
      const urlValues = extractValues(searchParamsStore.get());
      isRestoring = true;
      originalSet({ ...defaultValue, ...urlValues });
      isRestoring = false;

      // Subscribe to URL changes
      return searchParamsStore.subscribe((params) => {
        const urlValues = extractValues(params);
        const newState: Record<string, S> = { ...defaultValue, ...urlValues };

        isRestoring = true;
        originalSet(newState);
        isRestoring = false;
      });
    },
  });

  const originalSet = baseStore.set;

  const setKey = (key: string, value: S) => {
    if (!isRestoring) {
      searchParamsStore.set((params) => {
        const newParams = new URLSearchParams(params);
        const encoded = encode(value);

        if (encoded === undefined || (key in defaultValue && value === defaultValue[key])) {
          newParams.delete(prefix + key);
        } else {
          newParams.set(prefix + key, encoded);
        }

        return newParams;
      });
    }

    originalSet({ ...baseStore.get(), [key]: value });
  };

  const set = (value: SetStateAction<Record<string, S>>) => {
    const newState = typeof value === "function" ? value(baseStore.get()) : value;

    if (!isRestoring) {
      searchParamsStore.set((params) => {
        const newParams = new URLSearchParams(params);

        // Clear all prefix params
        for (const key of Array.from(params.keys())) {
          if (key.startsWith(prefix)) newParams.delete(key);
        }

        // Set new params
        for (const key in newState) {
          const encoded = encode(newState[key]);
          if (encoded !== undefined && !(key in defaultValue && newState[key] === defaultValue[key])) {
            newParams.set(prefix + key, encoded);
          }
        }

        return newParams;
      });
    }

    originalSet(newState);
  };

  return {
    get: baseStore.get,
    set,
    setKey,
    subscribe: baseStore.subscribe,
    getInitialValue: baseStore.getInitialValue,
  };
}
