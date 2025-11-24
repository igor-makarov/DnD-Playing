import { queryAtom } from "@/js/stores/queryStores";

export type RollMode = "app" | "site";

// Create the store with default "app", and encode to remove from URL when set to "app"
export const rollModeStore = queryAtom<RollMode>("roll", "app", {
  encode: (value) => (value === "app" ? undefined : value),
  decode: (str) => (str as RollMode) ?? "app",
});
