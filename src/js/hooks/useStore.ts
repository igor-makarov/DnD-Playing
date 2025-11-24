import { type Store } from "nanostores";

import { useSyncExternalStore } from "react";

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore<T>(store.subscribe, store.get, () => store.value as T);
}
