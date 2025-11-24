import { useQueryState } from "./useQueryState";

export function useRollMode(): ["app" | "site" | undefined, (value: "app" | "site" | undefined) => void] {
  return useQueryState<"app" | "site">("roll");
}
