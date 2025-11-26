import { createSearchParamMapStore } from "@/js/stores/primitives/createSearchParamMapStore";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { createURLSearchParamsStore } from "@/js/stores/primitives/createURLSearchParamsStore";
import { kebabNumberArrayCodec, numberCodec } from "@/js/stores/primitives/queryCodecs";

// Create shared base store for all character state
const searchParamsStore = createURLSearchParamsStore();

// Query atoms for character dynamic state
export const $hitPoints = createSearchParamStore<number | undefined>(searchParamsStore, "hit-points", undefined, numberCodec);

export const $spellSlotsSpent = createSearchParamStore<number[] | undefined>(
  searchParamsStore,
  "spell-slots-spent",
  undefined,
  kebabNumberArrayCodec,
);

// export const $channelDivinityUsed = queryAtom<number | undefined>("channel-divinity-used", 0, numberCodec);
export const $channelDivinityUsed = createSearchParamStore<number | undefined>(searchParamsStore, "channel-divinity-used", undefined, numberCodec);

export const $layOnHands = createSearchParamStore<number | undefined>(searchParamsStore, "lay-on-hands", undefined, numberCodec);

// Map from die type (e.g., "d10", "d8") to number of dice available (undefined means maximum)
export const $hitDice = createSearchParamMapStore<number | undefined>(searchParamsStore, "hit-dice-", {}, numberCodec);
