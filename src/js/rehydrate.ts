/**
 * Rehydrates a serialized object by restoring its prototype
 * Useful for class instances that have been serialized across client/server boundary
 *
 * @param obj The serialized object (plain object)
 * @param classConstructor The class constructor (e.g., DiceString)
 * @returns The object with its prototype restored
 *
 * @example
 * const diceString = rehydrate(serializedDice, DiceString);
 * diceString.crit(); // Now works!
 */
export function rehydrate<T>(obj: any, classConstructor: new (...args: any[]) => T): T {
  if (!obj) {
    return obj;
  }

  // If it already has the correct prototype, return as-is
  if (Object.getPrototypeOf(obj) === classConstructor.prototype) {
    return obj as T;
  }

  // Restore the prototype
  Object.setPrototypeOf(obj, classConstructor.prototype);
  return obj as T;
}

// Type helper for class constructors
type Constructor<T = {}> = new (...args: any[]) => T;

// Registry mapping type names to class constructors
const rehydratableClasses = new Map<string, Constructor>();

/**
 * Decorator that marks a class as rehydratable
 * Use with @ notation to register a class for automatic rehydration
 *
 * @param target The class to mark as rehydratable
 * @returns The same class with rehydratable metadata
 *
 * @example
 * @rehydratable
 * class DiceString extends BaseDiceString {}
 */
export function rehydratable<T extends Constructor>(target: T): T {
  const className = target.name;

  // Register the class in our registry by name
  rehydratableClasses.set(className, target);

  // Modify the constructor to add type marker to instances
  // This is critical for cross-boundary serialization: when objects are sent from
  // server to client, they lose their prototype and become plain objects. The
  // __rehydrationType property is a data property that SURVIVES serialization,
  // allowing the client to identify which class to rehydrate to.
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      // Tag each instance with its type name so it can be identified after deserialization
      (this as any).__rehydrationType = className;
    }
  } as T;
}

/**
 * HOC that automatically rehydrates props from rehydratable classes
 * Works with any component - checks each prop against registered classes
 *
 * @param Component The React component to wrap
 * @returns A new component that auto-rehydrates props
 *
 * @example
 * const MyComponent = withAutoRehydration<MyProps>(({ data }) => { ... });
 */
export function withAutoRehydration<P extends object>(Component: React.FC<P>): React.FC<P> {
  return (props) => {
    const rehydrated = { ...props } as any;

    // Check each prop value for a rehydration type marker
    for (const key in props) {
      const value = props[key];
      if (value && typeof value === "object" && (value as any).__rehydrationType) {
        const typeName = (value as any).__rehydrationType;
        const constructor = rehydratableClasses.get(typeName);

        // If we found the constructor, rehydrate the object
        if (constructor) {
          rehydrated[key] = rehydrate(value, constructor);
        }
      }
    }

    return Component(rehydrated as P);
  };
}
