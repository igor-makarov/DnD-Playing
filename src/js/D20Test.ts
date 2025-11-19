import { DiceString } from "./DiceString";
import { rehydratable } from "./rehydrate";

/**
 * Represents an ability check with a bonus modifier
 * Used for skill checks, saving throws, and other d20 rolls
 *
 * @example
 * const check = new AbilityCheck(5);
 * check.getBonus() // 5
 * check.getBonusString() // "+5"
 * check.getDiceString() // DiceString("d20+5")
 */
@rehydratable
export class D20Test {
  private bonus: number;

  /**
   * Create an AbilityCheck with a given bonus
   *
   * @param bonus The bonus modifier for the check
   */
  constructor(bonus: number) {
    console.log("in AbilityCheck.constructor");
    this.bonus = bonus;
  }

  /**
   * Get the raw bonus value
   *
   * @returns The bonus modifier
   * @example
   * new AbilityCheck(5).getBonus() // 5
   * new AbilityCheck(-2).getBonus() // -2
   */
  getBonus(): number {
    return this.bonus;
  }

  /**
   * Get the bonus formatted as a string with sign
   *
   * @returns The bonus with appropriate sign (e.g., "+5" or "-2")
   * @example
   * new AbilityCheck(5).getBonusString() // "+5"
   * new AbilityCheck(-2).getBonusString() // "-2"
   * new AbilityCheck(0).getBonusString() // "+0"
   */
  getBonusString(): string {
    const sign = this.bonus >= 0 ? "+" : "";
    return `${sign}${this.bonus}`;
  }

  /**
   * Get a DiceString for this ability check (d20 + bonus)
   *
   * @returns A DiceString representing d20 plus the bonus
   * @example
   * new AbilityCheck(5).getDiceString() // DiceString("d20+5")
   * new AbilityCheck(-2).getDiceString() // DiceString("d20-2")
   */
  getDiceString(): DiceString {
    return new DiceString("d20", this.bonus);
  }
}
