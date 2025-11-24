import { useSyncExternalStore } from "react";

import { type RollMode, rollModeStore } from "@/js/stores/rollModeStore";

export function useRollMode() {
  return useSyncExternalStore<RollMode>(rollModeStore.subscribe, rollModeStore.get, () => "app");
}
