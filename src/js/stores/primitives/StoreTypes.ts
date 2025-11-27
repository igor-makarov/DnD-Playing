// Core types shared across all stores
export type SetStateAction<S> = S | ((prevState: S) => S);
export type Dispatch<A> = (value: A) => void;

// Base store type
export type Store<S> = {
  get: () => S;
  set: Dispatch<SetStateAction<S>>;
  subscribe: (listener: (state: S) => void) => () => void;
  getInitialValue: () => S;
};

// Search param encoder/decoder options
export interface SearchParamStoreOptions<S> {
  encode: (value: S) => string | undefined;
  decode: (value: string) => S;
}
