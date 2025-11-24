import { $channelDivinityUsed, $hitDice, $hitPoints, $layOnHands, $spellSlotsSpent } from "@/js/character/dynamic-state/stores";
import type { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import { restoreHitDice } from "@/js/utils/restoreHitDice";

export function useLongRest(hitDiceByType: Array<{ die: DiceString; count: number }>) {
  const currentHitDice = useStore($hitDice);

  const finishLongRest = () => {
    // Reset all resources
    $hitPoints.set(undefined);
    $spellSlotsSpent.set(undefined);
    $channelDivinityUsed.set(undefined);
    $layOnHands.set(undefined);

    // Restore hit dice: regain spent hit dice up to half of total (minimum 1)
    const restoredHitDice = restoreHitDice(hitDiceByType, currentHitDice);
    $hitDice.set(restoredHitDice);
  };

  return { finishLongRest };
}
