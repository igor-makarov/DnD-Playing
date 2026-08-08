import { createURLSearchParamsStore } from "@/js/stores/primitives/createURLSearchParamsStore";

// Single source of truth for URL query string synchronization.
// Every character dynamic-state store (core or feature-specific) must compose
// on these shared instances. Note that even separate createURLSearchParamsStore()
// calls would delegate to the same internal singleton - these exports exist to
// make the sharing explicit.
export const searchParamsStore = createURLSearchParamsStore();
export const replaceSearchParamsStore = createURLSearchParamsStore("replaceState");
