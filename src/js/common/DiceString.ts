import { rehydratable } from "../utils/rehydratable";

/**
 * Represents a single dice term (e.g., "2d6" means 2 dice with 6 sides)
 */
interface DiceTerm {
  count: number;
  sides: number;
}

/**
 * D&D Dice String parser and manipulator
 * Supports parsing, normalizing, and applying critical hit rules to dice expressions
 *
 * Examples:
 * - "2d6+5" => 2 six-sided dice plus 5
 * - "d20+3" => 1 twenty-sided die plus 3
 * - "2d6+1d4-2" => 2d6, 1d4, minus 2
 */
@rehydratable("DiceString")
export class DiceString {
  private dice: DiceTerm[];
  private modifier: number;

  /**
   * Create a DiceString from a string, number, DiceTerm array, or another DiceString
   *
   * @param input The dice string to parse (string, DiceString, number, or DiceTerm[])
   * @param modifier Bonus modifier
   * @returns A new DiceString instance
   * @throws Error if the input is invalid
   *
   * @example
   * new DiceString("2d6+5") // 2d6 + 5
   * new DiceString("d20") // 1d20
   * new DiceString(5) // just a modifier of 5
   * new DiceString("2d6", [{count: 1, sides: 4}], 3) // Creates from string with additional dice and bonus
   * new DiceString(5, [{count: 2, sides: 6}]) // Creates from modifier with dice array
   */
  constructor(input: DiceString | string | number | DiceTerm[], modifier: number = 0) {
    console.log("in DiceString.constructor");

    // If input is a DiceTerm array, use it directly
    if (Array.isArray(input)) {
      this.dice = input;
      this.modifier = modifier;
    } else if (input instanceof DiceString) {
      this.dice = input.dice;
      this.modifier = input.modifier + modifier;
    } else {
      const parsed = DiceString.fromParts(input);
      this.dice = parsed.dice;
      this.modifier = parsed.modifier + modifier;
    }
  }

  /**
   * Parse input into dice and modifier components (does not create DiceString instance)
   * @returns Object with dice array and modifier
   */
  private static fromParts(input: string | number): { dice: DiceTerm[]; modifier: number } {
    // If a number, treat as a modifier
    if (typeof input === "number") {
      return { dice: [], modifier: input };
    }

    // Must be a string - parse it
    return DiceString.parse(input);
  }

  /**
   * Sum multiple dice strings and normalize the result
   *
   * @param diceStrings Array of DiceString instances to sum
   * @returns A normalized DiceString combining all inputs
   *
   * @example
   * DiceString.sum(new DiceString("2d6+3"), new DiceString("1d6"), new DiceString("2d6")) // "5d6+3"
   * DiceString.sum(new DiceString("d20+5"), new DiceString(2)) // "d20+7"
   */
  static sum(...diceStrings: DiceString[]): DiceString {
    if (!diceStrings || diceStrings.length === 0) {
      return new DiceString(0);
    }

    // Combine all dice and modifiers
    const allDice: DiceTerm[] = [];
    let totalModifier = 0;

    for (const ds of diceStrings) {
      allDice.push(...ds.dice);
      totalModifier += ds.modifier;
    }

    // Create and normalize the result
    return new DiceString(allDice, totalModifier).normalize();
  }

  /**
   * Parse a dice string expression into dice and modifier components (private implementation)
   *
   * Supported formats:
   * - "2d6" - multiple dice
   * - "d20" - single die (treated as 1d20)
   * - "2d6+5" - dice with positive modifier
   * - "2d6-3" - dice with negative modifier
   * - "2d6+1d4+5" - multiple dice types with modifier
   *
   * @param input The dice string to parse (must be a string)
   * @returns Object with dice array and modifier
   * @throws Error if the input is invalid
   */
  private static parse(input: string): { dice: DiceTerm[]; modifier: number } {
    // Must be a string at this point
    if (!input || typeof input !== "string") {
      throw new Error("Invalid input: must be a non-empty string");
    }

    const dice: DiceTerm[] = [];
    let modifier = 0;

    // Remove all whitespace
    const normalized = input.replace(/\s+/g, "");

    // Split by + and -, keeping the operators
    const terms: string[] = [];
    const operators: string[] = [];
    let currentTerm = "";

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (char === "+" || char === "-") {
        if (currentTerm) {
          terms.push(currentTerm);
          operators.push(char);
          currentTerm = "";
        } else if (char === "-" && i === 0) {
          // Handle leading negative sign
          currentTerm = "-";
        }
      } else {
        currentTerm += char;
      }
    }
    if (currentTerm) {
      terms.push(currentTerm);
    }

    // Process each term
    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const sign = i === 0 && !term.startsWith("-") ? 1 : operators[i - 1] === "-" ? -1 : 1;

      // Check if it's a dice term (contains 'd' or 'D')
      const diceMatch = term.match(/^(-?)(\d*)d(\d+)$/i);

      if (diceMatch) {
        const termSign = diceMatch[1] === "-" ? -1 : 1;
        const count = diceMatch[2] ? parseInt(diceMatch[2], 10) : 1;
        const sides = parseInt(diceMatch[3], 10);

        if (sides <= 0) {
          throw new Error(`Invalid dice: d${sides} (sides must be positive)`);
        }

        dice.push({ count: count * sign * termSign, sides });
      } else {
        // It's a modifier
        const value = parseInt(term, 10);
        if (isNaN(value)) {
          throw new Error(`Invalid term: "${term}"`);
        }
        modifier += value * sign;
      }
    }

    return { dice, modifier };
  }

  /**
   * Normalize the dice string by combining dice with the same number of sides
   *
   * Example: "d6+2d6+d4" => "3d6+d4"
   *
   * @returns A new normalized DiceString
   */
  normalize(): DiceString {
    const diceMap = new Map<number, number>();

    // Sum up dice counts by sides
    for (const die of this.dice) {
      const current = diceMap.get(die.sides) || 0;
      diceMap.set(die.sides, current + die.count);
    }

    // Convert back to array, filtering out zero counts
    const normalizedDice: DiceTerm[] = [];
    for (const [sides, count] of diceMap.entries()) {
      if (count !== 0) {
        normalizedDice.push({ count, sides });
      }
    }

    // Sort by sides for consistent output
    normalizedDice.sort((a, b) => b.sides - a.sides);

    return new DiceString(normalizedDice, this.modifier);
  }

  /**
   * Apply critical hit rules: double all dice, but not modifiers
   *
   * Example: "2d6+1d4+5" => "4d6+2d4+5"
   *
   * @returns A new DiceString with doubled dice
   */
  crit(): DiceString {
    const critDice = this.dice.map((die) => ({
      count: die.count * 2,
      sides: die.sides,
    }));

    return new DiceString(critDice, this.modifier);
  }

  /**
   * Calculate the average value of the dice expression
   * Average of a die is (sides + 1) / 2
   *
   * @returns The average value of rolling this dice string
   * @example
   * new DiceString("2d6+5").average() // 12 (2 * 3.5 + 5)
   * new DiceString("d20").average() // 10.5
   * new DiceString("d8+3").average() // 7.5
   */
  average(): number {
    let total = this.modifier;

    for (const die of this.dice) {
      // Average of a single die is (sides + 1) / 2
      const dieAverage = (die.sides + 1) / 2;
      total += die.count * dieAverage;
    }

    return total;
  }

  /**
   * Get the modifier component of the dice string
   *
   * @returns The numeric modifier
   * @example
   * new DiceString("2d6+5").getModifier() // 5
   * new DiceString("d20-2").getModifier() // -2
   * new DiceString("d8").getModifier() // 0
   */
  getModifier(): number {
    return this.modifier;
  }

  /**
   * Convert the DiceString back to standard notation
   *
   * Examples:
   * - "2d6+5"
   * - "d20-2"
   * - "3d6+1d4"
   *
   * @returns The dice string in standard notation
   */
  toString(): string {
    return this.toStringInternal();
  }

  /**
   * Convert to string with disadvantage notation (roll twice, take minimum)
   * Only applies to d20 rolls
   *
   * Examples:
   * - "d20+6" => "2d20min+6"
   * - "d20-2" => "2d20min-2"
   * - "2d6+5" => "2d6+5" (unchanged, not a d20)
   *
   * @returns The dice string with disadvantage notation
   */
  toMinString(): string {
    return this.toStringInternal("min");
  }

  /**
   * Convert to string with advantage notation (roll twice, take maximum)
   * Only applies to d20 rolls
   *
   * Examples:
   * - "d20+6" => "2d20max+6"
   * - "d20-2" => "2d20max-2"
   * - "2d6+5" => "2d6+5" (unchanged, not a d20)
   *
   * @returns The dice string with advantage notation
   */
  toMaxString(): string {
    return this.toStringInternal("max");
  }

  /**
   * Internal method to convert dice to string with optional min/max modifier
   */
  private toStringInternal(minMax?: "min" | "max"): string {
    const parts: string[] = [];

    // Add dice terms
    for (const die of this.dice) {
      const count = Math.abs(die.count);
      const countStr = count === 1 ? "" : count.toString();

      // Apply min/max only to d20 rolls
      let diceStr: string;
      if (minMax && die.sides === 20) {
        // Double the count and add min/max suffix
        const advCount = count * 2;
        const advCountStr = advCount === 1 ? "" : advCount.toString();
        diceStr = `${advCountStr}d${die.sides}${minMax}`;
      } else {
        diceStr = `${countStr}d${die.sides}`;
      }

      if (parts.length === 0) {
        // First term
        if (die.count < 0) {
          parts.push(`-${diceStr}`);
        } else {
          parts.push(diceStr);
        }
      } else {
        // Subsequent terms
        if (die.count < 0) {
          parts.push(`-${diceStr}`);
        } else {
          parts.push(`+${diceStr}`);
        }
      }
    }

    // Add modifier
    if (this.modifier !== 0) {
      if (parts.length === 0) {
        parts.push(this.modifier.toString());
      } else {
        if (this.modifier > 0) {
          parts.push(`+${this.modifier}`);
        } else {
          parts.push(`${this.modifier}`);
        }
      }
    }

    return parts.length > 0 ? parts.join("") : "0";
  }
}
