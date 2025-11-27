import { useSyncExternalStore } from "react";

/**
 * Returns true during SSR, false on client after hydration.
 * Useful for components that need to render differently on the server vs client.
 */
export function useIsServerSideRender(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => false,
    () => true,
  );
}
