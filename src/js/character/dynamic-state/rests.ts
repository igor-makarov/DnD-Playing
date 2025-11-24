import { $channelDivinityUsed, $hitPoints, $layOnHands, $spellSlotsSpent } from "./stores";

export function finishShortRest() {
  $channelDivinityUsed.set(undefined);
}

export function finishLongRest() {
  $hitPoints.set(undefined);
  $spellSlotsSpent.set(undefined);
  $channelDivinityUsed.set(undefined);
  $layOnHands.set(undefined);
}
