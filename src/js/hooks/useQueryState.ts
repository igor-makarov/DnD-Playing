import { useCallback } from "react";

import { useQueryString } from "./useQueryString";

// Hook to use a specific URL query parameter like useState
export function useQueryState<T extends string = string>(key: string, defaultValue?: T): [T | undefined, (value: T | undefined) => void] {
  const [queryString, setQueryString] = useQueryString();

  const value = useCallback(() => {
    const params = new URLSearchParams(queryString);
    const paramValue = params.get(key);
    return (paramValue as T) ?? defaultValue;
  }, [queryString, key, defaultValue])();

  const setValue = useCallback(
    (newValue: T | undefined) => {
      const params = new URLSearchParams(window.location.search);

      if (newValue === undefined || newValue === null) {
        params.delete(key);
      } else {
        params.set(key, newValue);
      }

      setQueryString(params);
    },
    [key, setQueryString],
  );

  return [value, setValue];
}
