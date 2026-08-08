import { createSearchParamMapStore } from "@/js/stores/primitives/createSearchParamMapStore";
import { createSearchParamStore } from "@/js/stores/primitives/createSearchParamStore";
import { kebabNumberArrayCodec, numberCodec, textCodec } from "@/js/stores/primitives/queryCodecs";

import { replaceSearchParamsStore, searchParamsStore } from "./searchParamsStore";

// Core dynamic state shared by every character, regardless of class/species/feats.
// Feature-specific stores (e.g. warlock spell slots, lay on hands, human inspiration)
// live in subdirectories here (classes/<class>/, species/<species>/, feats/) and
// self-register rest resets via registerLongRestReset / registerShortRestReset.

export const $hitPoints = createSearchParamStore<number | undefined>(searchParamsStore, "hit-points", undefined, numberCodec);

export const $temporaryHitPoints = createSearchParamStore<number | undefined>(searchParamsStore, "temp-hit-points", undefined, numberCodec);

export const $spellSlotsSpent = createSearchParamStore<number[] | undefined>(
  searchParamsStore,
  "spell-slots-spent",
  undefined,
  kebabNumberArrayCodec,
);

export const $heroicInspiration = createSearchParamStore<number | undefined>(searchParamsStore, "heroic-inspiration", undefined, numberCodec);

export const $notes = createSearchParamStore<string>(replaceSearchParamsStore, "notes", "", textCodec);

// Map from die type (e.g., "d10", "d8") to number of dice available (undefined means maximum)
export const $hitDice = createSearchParamMapStore<number | undefined>(searchParamsStore, "hit-dice-", {}, numberCodec);
