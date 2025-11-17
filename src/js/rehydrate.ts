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
