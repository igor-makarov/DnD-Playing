import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $layOnHands = createSearchParamStore<number | undefined>(searchParamsStore, "lay-on-hands", undefined, numberCodec);

registerLongRestReset(() => $layOnHands.set(undefined));
