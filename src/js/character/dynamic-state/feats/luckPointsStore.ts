import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $luckPointsUsed = createSearchParamStore<number | undefined>(searchParamsStore, "luck-points-used", undefined, numberCodec);

registerLongRestReset(() => $luckPointsUsed.set(undefined));
