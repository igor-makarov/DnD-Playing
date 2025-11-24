import { useStore } from "@/js/hooks/useStore";
import { rollModeStore } from "@/js/stores/rollModeStore";

export function useRollMode() {
  return useStore(rollModeStore, "app");
}
