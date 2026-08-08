import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $humanHeroicInspirationUsed = createSearchParamStore<number | undefined>(
  searchParamsStore,
  "human-heroic-inspiration-used",
  undefined,
  numberCodec,
);

registerLongRestReset(() => $humanHeroicInspirationUsed.set(undefined));
