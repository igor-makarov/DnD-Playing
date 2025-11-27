import type { SearchParamStoreOptions, SetStateAction } from "./StoreTypes";
import { type Store, createStore } from "./createStore";

export type { SearchParamStoreOptions };

/**
 * Creates a store for a single query parameter.
 * Composes on top of a searchParamsStore for URL synchronization.
 */
export function createSearchParamStore<S>(
  searchParamsStore: Store<URLSearchParams>,
  paramName: string,
  defaultValue: S,
  options: SearchParamStoreOptions<S>,
): Store<S> {
  const encode = options.encode;
  const decode = options.decode;

  const store = createStore<S>(defaultValue, {
    onMount: () => {
      // Restore from URL on mount
      const value = searchParamsStore.get().get(paramName);
      if (value) originalSet(decode(value));

      // Subscribe to URL changes
      return searchParamsStore.subscribe((params) => {
        const value = params.get(paramName);
        originalSet(value ? decode(value) : defaultValue);
      });
    },
  });

  // Override set to sync with URL
  const originalSet = store.set;
  store.set = (value: SetStateAction<S>) => {
    const newState = typeof value === "function" ? (value as (prevState: S) => S)(store.get()) : value;

    searchParamsStore.set((params) => {
      const newParams = new URLSearchParams(params);
      const encoded = encode(newState);

      if (encoded === undefined || JSON.stringify(newState) === JSON.stringify(defaultValue)) {
        newParams.delete(paramName);
      } else {
        newParams.set(paramName, encoded);
      }

      return newParams;
    });

    originalSet(newState);
  };

  return store;
}
