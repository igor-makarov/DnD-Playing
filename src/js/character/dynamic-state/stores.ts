import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { kebabNumberArrayCodec, numberCodec } from "@/js/stores/primitives/queryCodecs";
import { queryMap } from "@/js/stores/primitives/queryStores";

// Query atoms for character dynamic state
export const $hitPoints = createSearchParamStore<number | undefined>("hit-points", undefined, numberCodec);

export const $spellSlotsSpent = createSearchParamStore<number[] | undefined>("spell-slots-spent", undefined, kebabNumberArrayCodec);

// export const $channelDivinityUsed = queryAtom<number | undefined>("channel-divinity-used", 0, numberCodec);
export const $channelDivinityUsed = createSearchParamStore<number | undefined>("channel-divinity-used", undefined, numberCodec);

export const $layOnHands = createSearchParamStore<number | undefined>("lay-on-hands", undefined, numberCodec);

// Map from die type (e.g., "d10", "d8") to number of dice available (undefined means maximum)
export const $hitDice = queryMap<number | undefined>("hit-dice-", {}, numberCodec);
