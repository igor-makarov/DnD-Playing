import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { registerShortRestReset } from "@/js/hooks/useShortRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $warlockSpellSlotsUsed = createSearchParamStore<number | undefined>(searchParamsStore, "warlock-slots-used", undefined, numberCodec);

registerShortRestReset(() => $warlockSpellSlotsUsed.set(undefined));
registerLongRestReset(() => $warlockSpellSlotsUsed.set(undefined));
