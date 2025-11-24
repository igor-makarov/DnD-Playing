import { kebabNumberArrayCodec, numberCodec, numberMapCodec } from "@/js/stores/primitives/queryCodecs";
import { queryAtom, queryMap } from "@/js/stores/primitives/queryStores";

// Query atoms for character dynamic state
export const $hitPoints = queryAtom<number | undefined>("hit-points", undefined, numberCodec);

export const $spellSlotsSpent = queryAtom<number[] | undefined>("spell-slots-spent", undefined, kebabNumberArrayCodec);

export const $channelDivinityUsed = queryAtom<number | undefined>("channel-divinity-used", undefined, numberCodec);

export const $layOnHands = queryAtom<number | undefined>("lay-on-hands", undefined, numberCodec);

// Map from die type (e.g., "d10", "d8") to number of dice used
export const $hitDiceUsed = queryMap<number | undefined>("hit-dice-used-", {}, numberCodec);
