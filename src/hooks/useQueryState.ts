import { useCallback, useSyncExternalStore } from "react";

// Subscribe to URL changes (popstate for back/forward, and custom event for programmatic changes)
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  // Custom event for programmatic navigation
  window.addEventListener("pushstate", callback);
  window.addEventListener("replacestate", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("pushstate", callback);
    window.removeEventListener("replacestate", callback);
  };
}

// Get current query string
function getSnapshot() {
  return window.location.search;
}

// Server snapshot (for SSR)
function getServerSnapshot() {
  return "";
}

// Helper to dispatch custom events when URL changes programmatically
function dispatchURLChangeEvent(type: string) {
  window.dispatchEvent(new Event(type));
}

// Hook to use a specific URL query parameter like useState
export function useQueryState<T extends string = string>(key: string, defaultValue?: T): [T | undefined, (value: T | undefined) => void] {
  const queryString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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

      const newSearch = params.toString();
      const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;

      window.history.pushState({}, "", newURL);
      dispatchURLChangeEvent("pushstate");
    },
    [key],
  );

  return [value, setValue];
}
