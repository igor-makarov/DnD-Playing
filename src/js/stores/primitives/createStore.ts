type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

export function createStore<S>(initialState: S | (() => S)) {
  const initialValue = typeof initialState === "function" ? (initialState as () => S)() : initialState;
  let state = initialValue;
  const listeners = new Set<(state: S) => void>();

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
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { get, set: set as Dispatch<SetStateAction<S>>, subscribe, getInitialValue };
}
