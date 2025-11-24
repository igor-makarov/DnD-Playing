import { atom, map, onMount } from "nanostores";

let identity = <T>(a: T): T => a;

// Subscribe to URL changes (popstate for back/forward, and custom event for programmatic changes)
export function subscribeToQueryString(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("pushstate", callback);
  window.addEventListener("replacestate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("pushstate", callback);
    window.removeEventListener("replacestate", callback);
  };
}

// Get current query string
function getSnapshot() {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

// Helper to dispatch custom events when URL changes programmatically
function dispatchURLChangeEvent(type: string) {
  window.dispatchEvent(new Event(type));
}

// Helper to get URLSearchParams
function getParams(): URLSearchParams {
  return new URLSearchParams(getSnapshot());
}

// Helper to update URL with new params
function updateURL(params: URLSearchParams) {
  if (typeof window === "undefined") return;
  const newSearch = params.toString();
  const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
  window.history.pushState({}, "", newURL);
  dispatchURLChangeEvent("pushstate");
}

export interface QueryAtomOptions<T, S = string> {
  encode?: (value: T) => S | undefined;
  decode?: (value: S) => T;
  listen?: boolean;
}

export function queryAtom<T>(name: string, initial: T, opts: QueryAtomOptions<T> = {}) {
  let encode = opts.encode || (identity as (value: T) => string | undefined);
  let decode = opts.decode || (identity as (value: string) => T);

  let store = atom(initial);

  let set = store.set;
  store.set = (newValue: T) => {
    let params = getParams();
    let converted = encode(newValue);
    if (typeof converted === "undefined") {
      params.delete(name);
    } else {
      params.set(name, converted);
    }
    updateURL(params);
    set(newValue);
  };

  function listener() {
    let params = getParams();
    let value = params.get(name);
    if (value === null) {
      set(initial);
    } else {
      set(decode(value));
    }
  }

  function restore() {
    let params = getParams();
    let value = params.get(name);
    store.set(value !== null ? decode(value) : initial);
  }

  onMount(store, () => {
    restore();
    if (opts.listen !== false) {
      return subscribeToQueryString(listener);
    }
  });

  return store;
}

export interface QueryMapOptions<T, S = string> {
  encode?: (value: T) => S;
  decode?: (value: S) => T;
  listen?: boolean;
}

export function queryMap<T>(prefix: string, initial: Record<string, T> = {}, opts: QueryMapOptions<T> = {}) {
  let encode = opts.encode || (identity as (value: T) => string);
  let decode = opts.decode || (identity as (value: string) => T);

  let store = map<Record<string, T>>();

  let setKey = store.setKey;
  let storeKey = (key: string, newValue: T | undefined) => {
    let params = getParams();
    if (typeof newValue === "undefined") {
      params.delete(prefix + key);
    } else {
      params.set(prefix + key, encode(newValue));
    }
    updateURL(params);
  };

  store.setKey = (key: string, newValue: T | undefined) => {
    storeKey(key, newValue);
    setKey(key, newValue);
  };

  let set = store.set;
  store.set = function (newObject: Record<string, T>) {
    let params = getParams();

    // Set new values
    for (let key in newObject) {
      params.set(prefix + key, encode(newObject[key]));
    }

    // Remove old values
    for (let key in store.value) {
      if (!(key in newObject)) {
        params.delete(prefix + key);
      }
    }

    updateURL(params);
    set(newObject);
  };

  function listener() {
    let params = getParams();
    let data: Record<string, T> = {};

    for (let [key, value] of params.entries()) {
      if (key.startsWith(prefix)) {
        data[key.slice(prefix.length)] = decode(value);
      }
    }

    // Check for removed keys
    for (let key in store.value) {
      if (!(key in data)) {
        setKey(key, undefined);
      }
    }

    // Update with new data
    for (let key in data) {
      setKey(key, data[key]);
    }
  }

  function restore() {
    let params = getParams();
    let data: Record<string, T> = { ...initial };

    for (let [key, value] of params.entries()) {
      if (key.startsWith(prefix)) {
        data[key.slice(prefix.length)] = decode(value);
      }
    }

    for (let key in data) {
      store.setKey(key, data[key]);
    }
  }

  onMount(store, () => {
    restore();
    if (opts.listen !== false) {
      return subscribeToQueryString(listener);
    }
  });

  return store;
}

// Test utilities
let testParams = new URLSearchParams();
let testListeners: (() => void)[] = [];

export function useTestQueryEngine() {
  // Override global functions for testing
  (globalThis as any).testQueryParams = testParams;
}

export function setTestQueryParam(key: string, newValue: string | undefined) {
  if (typeof newValue === "undefined") {
    testParams.delete(key);
  } else {
    testParams.set(key, newValue);
  }
  for (let listener of testListeners) {
    listener();
  }
}

export function getTestQuery() {
  return testParams.toString();
}

export function cleanTestQuery() {
  testParams = new URLSearchParams();
  for (let listener of testListeners) {
    listener();
  }
}
