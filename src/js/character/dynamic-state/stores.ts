import { queryAtom } from "@/js/stores/primitives/queryStores";

// Query atoms for character dynamic state
export const $hitPoints = queryAtom<number | undefined>("hit-points", undefined, {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
});

// Spell slots spent
// Returns array of numbers where each index represents spell level and value is slots used
// Format: Stored in URL as hyphen-separated string (e.g., "1-2-0" means 1 slot used at level 1, 2 at level 2, 0 at level 3)
// - Empty/undefined query param = no slots spent (returns undefined)
// - Trailing zeros are automatically trimmed when saving (e.g., [1, 2, 0] -> "1-2")
// - Array indices correspond to spell levels (index 0 = level 1, index 1 = level 2, etc.)
export const $spellSlotsSpent = queryAtom<number[] | undefined>("spell-slots-spent", undefined, {
  encode: (value) => {
    if (value === undefined) return undefined;
    // Trim trailing zeros
    const trimmed = [...value];
    while (trimmed.length > 0 && trimmed[trimmed.length - 1] === 0) {
      trimmed.pop();
    }
    return trimmed.length > 0 ? trimmed.join("-") : undefined;
  },
  decode: (str) => str.split("-").map((n: string) => parseInt(n, 10) || 0),
});

export const $channelDivinityUsed = queryAtom<number | undefined>("channel-divinity-used", undefined, {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
});

export const $layOnHands = queryAtom<number | undefined>("lay-on-hands", undefined, {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
});
