type Constructor<T = {}> = new (...args: any[]) => T;

const rehydratableClasses = new Map<string, Constructor>();

/**
 * Class decorator that enables automatic rehydration across serialization boundaries.
 * Tags instances with __rehydrationType for identification after deserialization.
 *
 * @param name - Explicit name for the class that won't be affected by minification
 * @example
 * @rehydratable("DiceString")
 * class DiceString { ... }
 */
export function rehydratable(name: string) {
  return function <T extends Constructor>(target: T, _context: ClassDecoratorContext): T {
    console.log("registering class name:", name);
    rehydratableClasses.set(name, target);

    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        console.log("tagging instance with type:", name);
        (this as any).__rehydrationType = name;
      }
    } as T;
  };
}

/**
 * Restores the prototype chain of a serialized object.
 * Use when objects lose their class methods after JSON serialization.
 */
function rehydrate<T>(obj: any, classConstructor: new (...args: any[]) => T): T {
  if (!obj) {
    return obj;
  }

  if (Object.getPrototypeOf(obj) === classConstructor.prototype) {
    return obj as T;
  }

  Object.setPrototypeOf(obj, classConstructor.prototype);
  console.log("setting prototype:", classConstructor.prototype);
  return obj as T;
}

/**
 * React HOC that automatically rehydrates decorated class instances in props.
 */
export function withAutoRehydration<P extends object>(Component: React.FC<P>): React.FC<P> {
  return (props) => {
    const rehydrated = { ...props } as any;

    for (const key in props) {
      const value = props[key];
      console.log("rehydration potential:", value);
      console.log("rehydration classes:", rehydratableClasses);
      if (value && typeof value === "object" && (value as any).__rehydrationType) {
        const typeName = (value as any).__rehydrationType;
        const constructor = rehydratableClasses.get(typeName);

        if (constructor) {
          rehydrated[key] = rehydrate(value, constructor);
        }
      }
    }

    return Component(rehydrated as P);
  };
}
