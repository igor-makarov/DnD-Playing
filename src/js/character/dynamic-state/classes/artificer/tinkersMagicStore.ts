import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $tinkersMagicUsed = createSearchParamStore<number | undefined>(searchParamsStore, "tinkers-magic-used", undefined, numberCodec);

registerLongRestReset(() => $tinkersMagicUsed.set(undefined));
