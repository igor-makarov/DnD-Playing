import { $channelDivinityUsed } from "@/js/character/dynamic-state/stores";

export function useShortRest() {
  const finishShortRest = () => {
    $channelDivinityUsed.set(undefined);
  };

  return { finishShortRest };
}
