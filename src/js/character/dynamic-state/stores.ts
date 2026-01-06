import { createSearchParamMapStore } from "@/js/stores/primitives/createSearchParamMapStore";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { createURLSearchParamsStore } from "@/js/stores/primitives/createURLSearchParamsStore";
import { kebabNumberArrayCodec, numberCodec } from "@/js/stores/primitives/queryCodecs";

// Create shared base store for all character state
const searchParamsStore = createURLSearchParamsStore();

export const $hitPoints = createSearchParamStore<number | undefined>(searchParamsStore, "hit-points", undefined, numberCodec);

export const $temporaryHitPoints = createSearchParamStore<number | undefined>(searchParamsStore, "temp-hit-points", undefined, numberCodec);

export const $spellSlotsSpent = createSearchParamStore<number[] | undefined>(
  searchParamsStore,
  "spell-slots-spent",
  undefined,
  kebabNumberArrayCodec,
);

export const $warlockSpellSlotsUsed = createSearchParamStore<number | undefined>(searchParamsStore, "warlock-slots-used", undefined, numberCodec);

export const $channelDivinityUsed = createSearchParamStore<number | undefined>(searchParamsStore, "channel-divinity-used", undefined, numberCodec);

export const $layOnHands = createSearchParamStore<number | undefined>(searchParamsStore, "lay-on-hands", undefined, numberCodec);

export const $heroicInspirationUsed = createSearchParamStore<number | undefined>(
  searchParamsStore,
  "heroic-inspiration-used",
  undefined,
  numberCodec,
);

export const $luckPointsUsed = createSearchParamStore<number | undefined>(searchParamsStore, "luck-points-used", undefined, numberCodec);

// Map from die type (e.g., "d10", "d8") to number of dice available (undefined means maximum)
export const $hitDice = createSearchParamMapStore<number | undefined>(searchParamsStore, "hit-dice-", {}, numberCodec);
