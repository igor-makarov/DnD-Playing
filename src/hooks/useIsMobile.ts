import { useSyncExternalStore } from "react";

// Subscribe to resize events
function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

// Get current mobile status
function getSnapshot() {
  return window.matchMedia("(max-width: 768px)").matches || "ontouchstart" in window;
}

// Server snapshot (for SSR) - default to mobile
function getServerSnapshot() {
  return true;
}

// Hook to detect if device is mobile
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
