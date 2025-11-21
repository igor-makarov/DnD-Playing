import { rehydrate } from "./rehydratable";

/**
 * React HOC that automatically rehydrates decorated class instances in props.
 */

export function withAutoRehydration<P extends object>(Component: React.FC<P>): React.FC<P> {
  return (props) => {
    return Component(rehydrate(props));
  };
}
