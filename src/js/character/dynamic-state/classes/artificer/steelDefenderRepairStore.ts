import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $steelDefenderRepairUsed = createSearchParamStore<number | undefined>(
  searchParamsStore,
  "steel-defender-repair-used",
  undefined,
  numberCodec,
);

registerLongRestReset(() => $steelDefenderRepairUsed.set(undefined));
