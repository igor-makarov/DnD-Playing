type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

export type Store<S> = {
  get: () => S;
  set: Dispatch<SetStateAction<S>>;
  subscribe: (listener: (state: S) => void) => () => void;
  getInitialValue: () => S;
};

export type StoreOptions = {
  onMount?: () => void | (() => void);
};

export function createStore<S>(initialState: S | (() => S), options?: StoreOptions): Store<S> {
  const initialValue = typeof initialState === "function" ? (initialState as () => S)() : initialState;
  let state = initialValue;
  const listeners = new Set<(state: S) => void>();
  let cleanup: (() => void) | undefined;

  function get(): S {
    return state;
  }

  function getInitialValue(): S {
    return initialValue;
  }

  function set(value: SetStateAction<S>): void {
    state = typeof value === "function" ? (value as (prevState: S) => S)(state) : value;
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(listener: (state: S) => void): () => void {
    const wasEmpty = listeners.size === 0;
    listeners.add(listener);

    // Call onMount when first subscriber is added
    if (wasEmpty && options?.onMount) {
      cleanup = options.onMount() ?? undefined;
    }

    return () => {
      listeners.delete(listener);

      // Call cleanup when last subscriber is removed
      if (listeners.size === 0 && cleanup) {
        cleanup();
        cleanup = undefined;
      }
    };
  }

  return { get, set: set as Dispatch<SetStateAction<S>>, subscribe, getInitialValue };
}
