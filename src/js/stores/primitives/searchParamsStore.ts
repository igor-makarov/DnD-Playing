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

    // Dispatch custom event to notify subscribers
    dispatchURLChangeEvent(historyMode === "replaceState" ? "replacestate" : "pushstate");
  }
}

const listeners = new Set<() => void>();

function subscribe(listener: (state: URLSearchParams) => void): () => void {
  const wrappedListener = () => {
    const newParams = get();
    listener(newParams);
  };
  listeners.add(wrappedListener);
  return () => listeners.delete(wrappedListener);
}

const callback = () => {
  listeners.forEach((fn) => fn());
};

let initialized = false;

function initializeEventListeners() {
  if (initialized) return;
  initialized = true;
  window.addEventListener("popstate", callback);
  window.addEventListener("pushstate", callback);
  window.addEventListener("replacestate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("pushstate", callback);
    window.removeEventListener("replacestate", callback);
  };
}

if (typeof window !== "undefined") {
  initializeEventListeners();
}

/**
 * Singleton store that works with URLSearchParams directly.
 * This is the lower-level primitive that manages the entire query string.
 */
export const $searchParamsStore: SearchParamsStore = { get, set, subscribe, getInitialValue };
