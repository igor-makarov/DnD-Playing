import { batchUpdates } from "@/js/stores/primitives/createURLSearchParamsStore";

const additionalShortRestResets = new Set<() => void>();

// Feature-specific stores (class/species/feat resources) register their resets here.
export function registerShortRestReset(reset: () => void): void {
  additionalShortRestResets.add(reset);
}

export function useShortRest() {
  const finishShortRest = () => {
    batchUpdates(() => {
      for (const reset of additionalShortRestResets) reset();
    });
  };

  return { finishShortRest };
}
