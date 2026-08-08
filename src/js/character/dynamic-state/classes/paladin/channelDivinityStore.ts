import { searchParamsStore } from "@/js/character/dynamic-state/searchParamsStore";
import { registerLongRestReset } from "@/js/hooks/useLongRest";
import { registerShortRestReset } from "@/js/hooks/useShortRest";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { numberCodec } from "@/js/stores/primitives/queryCodecs";

export const $channelDivinityUsed = createSearchParamStore<number | undefined>(searchParamsStore, "channel-divinity-used", undefined, numberCodec);

registerShortRestReset(() => $channelDivinityUsed.set(undefined));
registerLongRestReset(() => $channelDivinityUsed.set(undefined));
