import type { Ability, Proficiency } from "./CharacterTypes";
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
 * Represents an ability check with proficiency and ability modifier
 * Used for skill checks, saving throws, and other d20 rolls
 *
 * @example
 * const check = new D20Test("Str", D20TestKind.ABILITY_CHECK, 3, {symbol: "●", bonus: 2});
 * check.getBonus() // 5
 * check.getBonusString() // "+5"
 * check.getDiceString() // DiceString("d20+5")
 */
@rehydratable("D20Test")
export class D20Test {
  private ability: Ability;
  private kind: D20TestKind;
  private proficiency: Proficiency;
  private abilityModifier: number;

  /**
   * Create a D20Test with ability, kind, ability modifier, and optional proficiency
   *
   * @param ability The ability name (e.g., "Str", "Dex")
   * @param kind The type of roll (ABILITY_CHECK, ATTACK_ROLL, or SAVING_THROW)
   * @param abilityModifier The ability modifier for the check
   * @param proficiency The proficiency information (symbol and bonus), defaults to no proficiency
   */
  constructor(ability: Ability, kind: D20TestKind, abilityModifier: number, proficiency?: Proficiency) {
    console.log("in AbilityCheck.constructor");
    this.ability = ability;
    this.kind = kind;
    this.proficiency = proficiency ?? { symbol: "", bonus: 0 };
    this.abilityModifier = abilityModifier;
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
   * Get the total bonus (ability modifier + proficiency bonus)
   *
   * @returns The total bonus modifier
   * @example
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 5).getBonus() // 5
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 3, {symbol: "●", bonus: 2}).getBonus() // 5
   */
  getBonus(): number {
    return this.abilityModifier + this.proficiency.bonus;
  }

  /**
   * Get the total bonus formatted as a string with sign
   *
   * @returns The total bonus with appropriate sign (e.g., "+5" or "-2")
   * @example
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 5).getBonusString() // "+5"
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, -2, {symbol: "●", bonus: 2}).getBonusString() // "+0"
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 0).getBonusString() // "+0"
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
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, 5).getDiceString() // DiceString("d20+5")
   * new D20Test("Str", D20TestKind.ABILITY_CHECK, -2, {symbol: "●", bonus: 2}).getDiceString() // DiceString("d20+0")
   */
  getDiceString(): DiceString {
    return new DiceString("d20", this.getBonus());
  }
}
