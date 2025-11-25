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

function get(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

const initialValue = get();

function getInitialValue(): URLSearchParams {
  return initialValue;
}

function set(value: SetStateAction<URLSearchParams>, options?: SearchParamsSetOptions): void {
  const historyMode = options?.historyMode ?? "pushState";
  const state = get();
  const newState = typeof value === "function" ? (value as (prevState: URLSearchParams) => URLSearchParams)(state) : value;

  // Update URL
  if (typeof window !== "undefined") {
    const newSearch = newState.toString();
    const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
    window.history[historyMode]({}, "", newURL);
  }
}

function subscribe(listener: (state: URLSearchParams) => void): () => void {
  const callback = () => {
    const newParams = get();
    listener(newParams);
  };
  window.addEventListener("popstate", callback);
  window.addEventListener("pushstate", callback);
  window.addEventListener("replacestate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("pushstate", callback);
    window.removeEventListener("replacestate", callback);
  };
}

/**
 * Singleton store that works with URLSearchParams directly.
 * This is the lower-level primitive that manages the entire query string.
 */
export const $searchParamsStore: SearchParamsStore = { get, set, subscribe, getInitialValue };
