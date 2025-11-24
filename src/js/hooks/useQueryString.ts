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

// Hook to subscribe to the raw query string and update it
export function useQueryString(): [string, (params: URLSearchParams) => void] {
  const queryString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setQueryString = useCallback((params: URLSearchParams) => {
    const newSearch = params.toString();
    const newURL = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;

    window.history.pushState({}, "", newURL);
    dispatchURLChangeEvent("pushstate");
  }, []);

  return [queryString, setQueryString];
}
