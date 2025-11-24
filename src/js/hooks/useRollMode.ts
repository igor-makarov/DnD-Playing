import { useSyncExternalStore } from "react";

import { rollModeStore } from "@/js/stores/rollModeStore";

export function useRollMode() {
  // *somehow*, we still cannot use our `useStore` here
  return useSyncExternalStore(rollModeStore.subscribe, rollModeStore.get, () => "app")
}
