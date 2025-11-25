import type { Store } from "./createStore";
import { $searchParamsStore } from "./searchParamsStore";

type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

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
  serialize?: (value: S) => string;
  deserialize?: (value: string) => S;
  historyMode?: "pushState" | "replaceState";
}

/**
 * Creates a store for a single query parameter.
 * This is a convenience wrapper around createSearchParamsStore.
 */
export function createSearchParamStore<S>(paramName: string, defaultValue: S, options?: SearchParamStoreOptions<S>): Store<S> {
  const serialize = options?.serialize ?? ((v: S) => defaultSerialize(v));
  const deserialize = options?.deserialize ?? ((v: string) => defaultDeserialize(v, defaultValue));
  const historyMode = options?.historyMode;

  // Helper to extract value from params
  const extractValue = (params: URLSearchParams): S => {
    const value = params.get(paramName);
    return value !== null ? deserialize(value) : defaultValue;
  };

  const initialValue = extractValue($searchParamsStore.getInitialValue());
  let state = extractValue($searchParamsStore.get());

  function get(): S {
    return state;
  }

  function getInitialValue(): S {
    return initialValue;
  }

  function set(value: SetStateAction<S>): void {
    const newState = typeof value === "function" ? (value as (prevState: S) => S)(state) : value;
    state = newState;

    // Update the params store
    $searchParamsStore.set(
      (params) => {
        const newParams = new URLSearchParams(params);
        if (isEqual(newState, defaultValue)) {
          newParams.delete(paramName);
        } else {
          newParams.set(paramName, serialize(newState));
        }
        return newParams;
      },
      { historyMode },
    );
  }

  function subscribe(listener: (state: S) => void): () => void {
    return $searchParamsStore.subscribe((params) => {
      const newValue = extractValue(params);
      if (!isEqual(state, newValue)) {
        state = newValue;
        listener(state);
      }
    });
  }

  return { get, set: set as Dispatch<SetStateAction<S>>, subscribe, getInitialValue };
}
