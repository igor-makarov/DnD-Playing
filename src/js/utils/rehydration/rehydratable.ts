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
    const wrappedClass = class extends target {
      constructor(...args: any[]) {
        super(...args);
        (this as any).__rehydrationType = name;
      }
    } as T;

    // Store the wrapped class so instanceof checks work correctly after rehydration
    rehydratableClasses.set(name, wrappedClass);

    return wrappedClass;
  };
}

/**
 * Rehydrates objects within props that were tagged with __rehydrationType.
 * Restores prototype chains for serialized objects that have lost their class methods.
 * Recursively walks through nested objects and arrays to rehydrate all tagged instances.
 *
 * @param props - The props object containing potentially serialized rehydratable objects
 * @returns The props with rehydrated objects
 * @example
 * const rehydratedProps = rehydrate(deserializedProps);
 */
export function rehydrate<P extends object>(props: P) {
  const rehydrated = { ...props } as any;

  for (const key in rehydrated) {
    rehydrateValue(rehydrated[key]);
  }

  return rehydrated as P;
}

/**
 * Recursively processes a value, rehydrating any objects with __rehydrationType
 * and recursing into nested objects and arrays.
 */
function rehydrateValue(value: any): void {
  if (!value || typeof value !== "object") {
    return;
  }

  // If this value is rehydratable, rehydrate it first
  if ((value as any).__rehydrationType) {
    const typeName = (value as any).__rehydrationType;
    const constructor = rehydratableClasses.get(typeName);

    if (constructor) {
      rehydrateRehydratableObject(value, constructor);
    }
  }

  // Recursively process children (whether rehydrated or not)
  if (Array.isArray(value)) {
    for (const item of value) {
      rehydrateValue(item);
    }
  } else {
    for (const key in value) {
      rehydrateValue(value[key]);
    }
  }
}

/**
 * Restores the prototype chain of a serialized object.
 * Use when objects lose their class methods after JSON serialization.
 */
function rehydrateRehydratableObject<T>(obj: any, classConstructor: new (...args: any[]) => T) {
  if (Object.getPrototypeOf(obj) === classConstructor.prototype) {
    return obj as T;
  }

  Object.setPrototypeOf(obj, classConstructor.prototype);
}

/**
 * Dehydrates objects within props, converting class instances to plain objects.
 * This is the inverse of rehydrate() - prepares props for crossing the server/client boundary.
 * Recursively walks through nested objects and arrays to dehydrate all values.
 *
 * @param props - The props object containing class instances
 * @returns Plain object representation suitable for serialization
 */
export function dehydrate<P extends object>(props: P): P {
  return dehydrateValue(props) as P;
}

/**
 * Recursively converts a value to a plain object representation.
 * Class instances become plain objects, arrays are mapped, primitives pass through.
 */
function dehydrateValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(dehydrateValue);
  }

  // Convert object (including class instances) to plain object
  const plain: Record<string, any> = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      plain[key] = dehydrateValue(value[key]);
    }
  }

  return plain;
}
