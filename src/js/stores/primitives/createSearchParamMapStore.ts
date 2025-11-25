import { type Store, createStore } from "./createStore";
import { $searchParamsStore, type HistoryMode } from "./searchParamsStore";

type SetStateAction<S> = S | ((prevState: S) => S);

export interface MapStore<S extends Record<string, any>> extends Store<S> {
  setKey: <K extends keyof S>(key: K, value: S[K]) => void;
}

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

export interface SearchParamMapStoreOptions<S> {
  encode?: (value: S) => string | undefined;
  decode?: (value: string) => S;
  historyMode?: HistoryMode;
}

/**
 * Creates a map store for multiple query parameters with a common prefix.
 * Uses createStore with onMount lifecycle for URL synchronization.
 */
export function createSearchParamMapStore<S>(
  prefix: string,
  defaultValue: Record<string, S | undefined>,
  options?: SearchParamMapStoreOptions<S>,
): MapStore<Record<string, S | undefined>> {
  const encode = options?.encode ?? ((v: S) => defaultSerialize(v));
  const decode = options?.decode ?? ((v: string) => defaultDeserialize(v, {} as S));
  const historyMode = options?.historyMode ?? "pushState";

  // Helper to extract all values with the prefix from params
  const extractValues = (params: URLSearchParams): Record<string, S | undefined> => {
    const result: Record<string, S | undefined> = {};
    for (const [key, value] of params.entries()) {
      if (key.startsWith(prefix)) {
        const unprefixedKey = key.slice(prefix.length);
        result[unprefixedKey] = decode(value);
      }
    }
    return result;
  };

  let isRestoring = false;

  // Create base store with onMount lifecycle
  const baseStore = createStore<Record<string, S | undefined>>(defaultValue, {
    onMount: () => {
      // Restore values from URL when first subscriber is added
      const currentParams = $searchParamsStore.get();
      const urlValues = extractValues(currentParams);

      isRestoring = true;
      // Start with default values and merge URL values
      const mergedValues = { ...defaultValue };
      for (const key in urlValues) {
        mergedValues[key] = urlValues[key];
      }
      originalSet(mergedValues);
      isRestoring = false;

      // Subscribe to URL changes via searchParamsStore
      return $searchParamsStore.subscribe((params) => {
        const newValues = extractValues(params);
        const currentValue = baseStore.get();

        isRestoring = true;
        const updatedValues = { ...currentValue };
        let hasChanges = false;

        // Remove keys that are no longer in URL
        for (const key in currentValue) {
          if (!(key in newValues) && !(key in defaultValue)) {
            delete updatedValues[key];
            hasChanges = true;
          } else if (!(key in newValues) && key in defaultValue) {
            if (!isEqual(currentValue[key], defaultValue[key])) {
              updatedValues[key] = defaultValue[key];
              hasChanges = true;
            }
          }
        }

        // Update with new values from URL
        for (const key in newValues) {
          if (!isEqual(currentValue[key], newValues[key])) {
            updatedValues[key] = newValues[key];
            hasChanges = true;
          }
        }

        if (hasChanges) {
          originalSet(updatedValues);
        }
        isRestoring = false;
      });
    },
  });

  // Keep reference to original set
  const originalSet = baseStore.set;

  // Create setKey method
  const setKey = <K extends keyof Record<string, S | undefined>>(key: K, value: Record<string, S | undefined>[K]) => {
    // Update URL via searchParamsStore
    if (!isRestoring) {
      $searchParamsStore.set(
        (params) => {
          const newParams = new URLSearchParams(params);
          const prefixedKey = prefix + String(key);

          if (value === undefined || (key in defaultValue && isEqual(value, defaultValue[key as string]))) {
            newParams.delete(prefixedKey);
          } else {
            const encoded = encode(value as S);
            if (encoded === undefined) {
              newParams.delete(prefixedKey);
            } else {
              newParams.set(prefixedKey, encoded);
            }
          }
          return newParams;
        },
        { historyMode },
      );
    }

    // Update store
    const currentState = baseStore.get();
    const newState = { ...currentState, [key]: value };
    originalSet(newState);
  };

  // Override set to update URL for all keys
  const set = (value: SetStateAction<Record<string, S | undefined>>) => {
    const currentState = baseStore.get();
    const newState =
      typeof value === "function" ? (value as (prevState: Record<string, S | undefined>) => Record<string, S | undefined>)(currentState) : value;

    // Update URL via searchParamsStore
    if (!isRestoring) {
      $searchParamsStore.set(
        (params) => {
          const newParams = new URLSearchParams(params);

          // Set new values
          for (const key in newState) {
            const prefixedKey = prefix + key;
            const val = newState[key];

            if (val === undefined || (key in defaultValue && isEqual(val, defaultValue[key]))) {
              newParams.delete(prefixedKey);
            } else {
              const encoded = encode(val);
              if (encoded === undefined) {
                newParams.delete(prefixedKey);
              } else {
                newParams.set(prefixedKey, encoded);
              }
            }
          }

          // Remove old values that are not in newState
          for (const key in currentState) {
            if (!(key in newState)) {
              newParams.delete(prefix + key);
            }
          }

          return newParams;
        },
        { historyMode },
      );
    }

    // Update store
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
