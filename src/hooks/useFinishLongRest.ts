import { useQueryState } from "./useQueryState";

// Hook to clear multiple query state values (Long Rest functionality)

export function useFinishLongRest(queryKeys: string[] = ["hit-points", "spell-slots"]) {
  const setters = queryKeys.map((key) => useQueryState(key)[1]);

  const longRest = () => {
    setters.forEach((setter) => setter(undefined));
  };

  return longRest;
}
