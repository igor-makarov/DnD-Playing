import { type Store as NanoStore } from "nanostores";

import { useSyncExternalStore } from "react";

import { type Store } from "@/js/stores/primitives/createStore";

export function useStore<T>(store: NanoStore<T> | Store<T>) {
  const getServerSnapshot = () => {
    // nanostores have a 'value' property, our stores don't
    return "getInitialValue" in store ? store.getInitialValue() : (store.value as T);
  };

  return useSyncExternalStore<T>(store.subscribe, store.get, getServerSnapshot);
}
