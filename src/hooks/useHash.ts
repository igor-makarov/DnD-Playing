import { useSyncExternalStore } from "react";

// Subscribe to hashchange events
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

// Get current hash value
function getSnapshot() {
  return window.location.hash;
}

// Server snapshot (for SSR)
function getServerSnapshot() {
  return "";
}

// Hook to use URL hash
export function useHash() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
