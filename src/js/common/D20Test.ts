import type { Ability, Proficiency } from "../character/CharacterTypes";
import { DiceString } from "./DiceString";

/**
 * Type representing the type of d20 roll
 */
export type D20TestKind = "Ability Check" | "Attack Roll" | "Saving Throw";

/**
 * Represents an ability check with proficiency and ability modifier
 * Used for skill checks, saving throws, and other d20 rolls
 *
 * @example
 * const check = new D20Test("Ability Check", "Str", 3, {symbol: "P", bonus: 2});
 * check.getBonus() // 5
 * check.getBonusString() // "+5"
 * check.getDiceString() // DiceString("d20+5")
 */
export class D20Test {
  private kind: D20TestKind;
  private ability: Ability;
  private proficiency: Proficiency;
  private abilityModifier: number;
  private extraBonus: number;

  /**
   * Create a D20Test with kind, ability, ability modifier, and optional proficiency and extra bonus
   *
   * @param kind The type of roll ("Ability Check", "Attack Roll", or "Saving Throw")
   * @param ability The ability name (e.g., "Str", "Dex")
   * @param abilityModifier The ability modifier for the check
   * @param proficiency The proficiency information (symbol and bonus), defaults to no proficiency
   * @param extraBonus Additional bonus (e.g., weapon bonus for attack rolls), defaults to 0
   */
  constructor(kind: D20TestKind, ability: Ability, abilityModifier: number, proficiency?: Proficiency, extraBonus: number = 0) {
    this.kind = kind;
    this.ability = ability;
    this.proficiency = proficiency ?? { symbol: " ", bonus: 0 };
    this.abilityModifier = abilityModifier;
    this.extraBonus = extraBonus;
  }

  /**
   * Get the ability name
   *
   * @returns The ability name (e.g., "Str", "Dex")
   */
  getAbility(): Ability {
    return this.ability;
  }

  /**
   * Get the roll kind
   *
   * @returns The type of d20 roll
   */
  getKind(): D20TestKind {
    return this.kind;
  }

  /**
   * Get the proficiency information
   *
   * @returns The proficiency (symbol and bonus)
   */
  getProficiency(): Proficiency {
    return this.proficiency;
  }

  /**
   * Get the ability modifier
   *
   * @returns The ability modifier
   */
  getAbilityModifier(): number {
    return this.abilityModifier;
  }

  /**
   * Get the extra bonus
   *
   * @returns The extra bonus
   */
  getExtraBonus(): number {
    return this.extraBonus;
  }

  /**
   * Get the total bonus (ability modifier + proficiency bonus + extra bonus)
   *
   * @returns The total bonus modifier
   * @example
   * new D20Test("Ability Check", "Str", 5).getBonus() // 5
   * new D20Test("Ability Check", "Str", 3, {symbol: "P", bonus: 2}).getBonus() // 5
   * new D20Test("Attack Roll", "Str", 3, {symbol: "P", bonus: 2}, 1).getBonus() // 6
   */
  getBonus(): number {
    return this.abilityModifier + this.proficiency.bonus + this.extraBonus;
  }

  /**
   * Get the total bonus formatted as a string with sign
   *
   * @returns The total bonus with appropriate sign (e.g., "+5" or "-2")
   * @example
   * new D20Test("Ability Check", "Str", 5).getBonusString() // "+5"
   * new D20Test("Ability Check", "Str", -2, {symbol: "P", bonus: 2}).getBonusString() // "+0"
   * new D20Test("Ability Check", "Str", 0).getBonusString() // "+0"
   */
  getBonusString(): string {
    const totalBonus = this.getBonus();
    const sign = totalBonus >= 0 ? "+" : "";
    return `${sign}${totalBonus}`;
  }

  /**
   * Get a DiceString for this ability check (d20 + total bonus)
   *
   * @returns A DiceString representing d20 plus the total bonus
   * @example
   * new D20Test("Ability Check", "Str", 5).getDiceString() // DiceString("d20+5")
   * new D20Test("Ability Check", "Str", -2, {symbol: "P", bonus: 2}).getDiceString() // DiceString("d20+0")
   */
  getDiceString(): DiceString {
    return new DiceString("d20", this.getBonus());
  }
}
