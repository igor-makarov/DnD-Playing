import { useStore } from "@/js/hooks/useStore";
import { $rollModifierStore } from "@/js/stores/rollModifierStore";

export function useRollModifiers() {
  return useStore($rollModifierStore);
}
