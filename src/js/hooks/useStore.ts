import { useSyncExternalStore } from "react";

import { type Store } from "@/js/stores/primitives/createStore";

export function useStore<T>(store: Store<T>) {
  return useSyncExternalStore<T>(store.subscribe, store.get, store.getInitialValue);
}
