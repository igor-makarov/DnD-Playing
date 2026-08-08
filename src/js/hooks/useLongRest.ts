import { $hitDice, $hitPoints, $spellSlotsSpent, $temporaryHitPoints } from "@/js/character/dynamic-state/commonStores";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { batchUpdates } from "@/js/stores/primitives/createURLSearchParamsStore";
import { restoreHitDice } from "@/js/utils/restoreHitDice";

const additionalLongRestResets = new Set<() => void>();

// Feature-specific stores (class/species/feat resources) register their resets here.
export function registerLongRestReset(reset: () => void): void {
  additionalLongRestResets.add(reset);
}

export function useLongRest(hitDiceByType: Array<{ die: DiceString; count: number }>) {
  const currentHitDice = useStore($hitDice);

  const finishLongRest = () => {
    batchUpdates(() => {
      // Reset core resources
      $hitPoints.set(undefined);
      $temporaryHitPoints.set(undefined);
      $spellSlotsSpent.set(undefined);

      // Reset registered feature resources
      for (const reset of additionalLongRestResets) reset();

      // Restore hit dice: regain spent hit dice up to half of total (minimum 1)
      const restoredHitDice = restoreHitDice(hitDiceByType, currentHitDice);
      $hitDice.set(restoredHitDice);
    });
  };

  return { finishLongRest };
}
