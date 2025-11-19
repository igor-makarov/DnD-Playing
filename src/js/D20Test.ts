import type { Ability } from "./CharacterTypes";
import { DiceString } from "./DiceString";
import { rehydratable } from "./rehydrate";

/**
 * Enum representing the type of d20 roll
 */
export enum D20TestKind {
  ABILITY_CHECK = "ABILITY_CHECK",
  ATTACK_ROLL = "ATTACK_ROLL",
  SAVING_THROW = "SAVING_THROW",
}

/**
 * Represents an ability check with a bonus modifier
 * Used for skill checks, saving throws, and other d20 rolls
 *
 * @example
 * const check = new D20Test("Str", D20TestKind.ABILITY_CHECK, 5);
 * check.getBonus() // 5
 * check.getBonusString() // "+5"
 * check.getDiceString() // DiceString("d20+5")
 */
@rehydratable
export class D20Test {
  private ability: Ability;
  private kind: D20TestKind;
  private bonus: number;

  /**
   * Create a D20Test with ability, kind, and bonus
   *
   * @param ability The ability name (e.g., "Str", "Dex")
   * @param kind The type of roll (ABILITY_CHECK, ATTACK_ROLL, or SAVING_THROW)
   * @param bonus The bonus modifier for the check
   */
  constructor(ability: Ability, kind: D20TestKind, bonus: number) {
    console.log("in AbilityCheck.constructor");
    this.ability = ability;
    this.kind = kind;
    this.bonus = bonus;
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
   * Get the raw bonus value
   *
   * @returns The bonus modifier
   * @example
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 5).getBonus() // 5
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, -2).getBonus() // -2
   */
  getBonus(): number {
    return this.bonus;
  }

  /**
   * Get the bonus formatted as a string with sign
   *
   * @returns The bonus with appropriate sign (e.g., "+5" or "-2")
   * @example
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 5).getBonusString() // "+5"
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, -2).getBonusString() // "-2"
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 0).getBonusString() // "+0"
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
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 5).getDiceString() // DiceString("d20+5")
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, -2).getDiceString() // DiceString("d20-2")
   */
  getDiceString(): DiceString {
    return new DiceString("d20", this.bonus);
  }
}
