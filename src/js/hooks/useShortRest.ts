import { $channelDivinityUsed } from "@/js/character/dynamic-state/stores";
import { batchUpdates } from "@/js/stores/primitives/createURLSearchParamsStore";

export function useShortRest() {
  const finishShortRest = () => {
    batchUpdates(() => {
      $channelDivinityUsed.set(undefined);
    });
  };

  return { finishShortRest };
}
