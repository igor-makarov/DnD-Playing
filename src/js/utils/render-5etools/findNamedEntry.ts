import type { Entry } from "./ReferenceTypes";

export interface NamedEntry {
  type: string;
  name: string;
  entries?: Entry[];
}

export function findNamedEntry(entries: Entry[], name: string): NamedEntry | undefined {
  for (const entry of entries) {
    if (typeof entry === "string") {
      continue;
    }

    if (entry.name?.toLowerCase() === name.toLowerCase()) {
      return entry as NamedEntry;
    }

    if (entry.entries) {
      const match = findNamedEntry(entry.entries, name);
      if (match) {
        return match;
      }
    }
  }

  return undefined;
}
