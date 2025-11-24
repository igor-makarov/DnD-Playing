import type { DiceString } from "@/js/common/DiceString";

import { $channelDivinityUsed, $hitDice, $hitPoints, $layOnHands, $spellSlotsSpent } from "./stores";

export function finishShortRest() {
  $channelDivinityUsed.set(undefined);
}

export function finishLongRest(hitDiceByType: Array<{ die: DiceString; count: number }>) {
  $hitPoints.set(undefined);
  $spellSlotsSpent.set(undefined);
  $channelDivinityUsed.set(undefined);
  $layOnHands.set(undefined);

  // Restore hit dice: regain spent hit dice up to half of total (minimum 1)
  const currentHitDice = $hitDice.get();

  // Calculate total hit dice and total spent
  const totalHitDice = hitDiceByType.reduce((sum, { count }) => sum + count, 0);
  const totalSpent = hitDiceByType.reduce((sum, { die, count }) => {
    const available = currentHitDice[die.toString()] ?? count;
    return sum + (count - available);
  }, 0);

  // Calculate how many to restore (half of total, minimum 1)
  const toRestore = Math.max(1, Math.floor(totalHitDice / 2));
  const canRestore = Math.min(toRestore, totalSpent);

  if (canRestore > 0) {
    let remaining = canRestore;

    // Restore dice starting from largest die type first
    for (const { die, count } of hitDiceByType) {
      if (remaining <= 0) break;

      const available = currentHitDice[die.toString()] ?? count;
      const spent = count - available;

      if (spent > 0) {
        const restore = Math.min(spent, remaining);
        const newAvailable = available + restore;

        // Set to undefined if back to maximum, otherwise set the new count
        $hitDice.setKey(die.toString(), newAvailable === count ? undefined : newAvailable);
        remaining -= restore;
      }
    }
  }
}
