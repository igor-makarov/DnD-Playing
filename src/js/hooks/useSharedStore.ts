import { useSyncExternalStore } from "react";

export interface SharedStore<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createSharedStore<T>(initial: T): SharedStore<T> {
  let value = initial;
  const listeners = new Set<() => void>();

  const store: SharedStore<T> = {
    get: () => value,
    set: (next) => {
      const nextVal = typeof next === "function" ? (next as (prev: T) => T)(value) : next;
      if (Object.is(nextVal, value)) return;
      value = nextVal;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return store;
}

export function useSharedStore<T>(store: SharedStore<T>) {
  const value = useSyncExternalStore(
    store.subscribe,
    store.get,
    store.get, // SSR snapshot
  );
  return [value, store.set] as const;
}
