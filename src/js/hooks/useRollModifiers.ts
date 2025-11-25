import { useStore } from "@/js/hooks/useStore";
import { $rollModifierStore, RollModifier } from "@/js/stores/rollModifierStore";

// Re-export the enum for convenience
export { RollModifier };

// Hook to use roll modifiers
export function useRollModifiers() {
  return useStore($rollModifierStore);
}
