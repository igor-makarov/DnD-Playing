import type { DiceString } from "@/js/common/DiceString";

export function restoreHitDice(
  hitDiceByType: Array<{ die: DiceString; count: number }>,
  currentHitDice: Record<string, number | undefined>,
): Record<string, number | undefined> {
  // Calculate total hit dice and total spent
  const totalHitDice = hitDiceByType.reduce((sum, { count }) => sum + count, 0);
  const totalSpent = hitDiceByType.reduce((sum, { die, count }) => {
    const available = currentHitDice[die.toString()] ?? count;
    return sum + (count - available);
  }, 0);

  // Calculate how many to restore (half of total, minimum 1)
  const toRestore = Math.max(1, Math.floor(totalHitDice / 2));
  const canRestore = Math.min(toRestore, totalSpent);

  // Start with a copy of the current state
  const result: Record<string, number | undefined> = { ...currentHitDice };

  if (canRestore === 0) {
    return result;
  }

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
      result[die.toString()] = newAvailable === count ? undefined : newAvailable;
      remaining -= restore;
    }
  }

  return result;
}
