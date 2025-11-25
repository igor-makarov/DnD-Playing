// Type definitions for query parameter codecs
export interface QueryParamOptions<T, S = string> {
  encode?: (value: T) => S | undefined;
  decode?: (value: S) => T;
}

export interface QueryMapOptions<T, S = string> {
  encode?: (value: T) => S | undefined;
  decode?: (value: S) => T;
}

// Codec for simple numeric values
export const numberCodec: QueryParamOptions<number | undefined> = {
  encode: (value) => (value !== undefined ? value.toString() : undefined),
  decode: (str) => parseInt(str, 10),
};

// Codec for queryMap numeric values (always returns a string, never undefined)
export const numberMapCodec: QueryMapOptions<number> = {
  encode: (value) => value.toString(),
  decode: (str) => parseInt(str, 10),
};

// Format: Stored in URL as hyphen-separated string (e.g., "1-2-0" means 1 slot used at level 1, 2 at level 2, 0 at level 3)
// - Empty/undefined query param = no slots spent (returns undefined)
// - Trailing zeros are automatically trimmed when saving (e.g., [1, 2, 0] -> "1-2")
// - Array indices correspond to spell levels (index 0 = level 1, index 1 = level 2, etc.)
export const kebabNumberArrayCodec: QueryParamOptions<number[] | undefined> = {
  encode: (value) => {
    if (value === undefined) return undefined;
    // Trim trailing zeros
    const trimmed = [...value];
    while (trimmed.length > 0 && trimmed[trimmed.length - 1] === 0) {
      trimmed.pop();
    }
    return trimmed.length > 0 ? trimmed.join("-") : undefined;
  },
  decode: (str) => str.split("-").map((n: string) => parseInt(n, 10) || 0),
};

// Create the store with default first string, and encode to remove from URL when set to first string
export function closedStringCodec<const T extends readonly string[]>(
  list: T & (T extends readonly [infer _First, ...infer _Rest] ? unknown : never),
): QueryParamOptions<T[number]> {
  return {
    encode: (value) => (value == list[0] ? undefined : value),
    decode: (str) => (list.includes(str) ? (str as T[number]) : list[0]),
  };
}
