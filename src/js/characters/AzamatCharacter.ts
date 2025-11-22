import { Character } from "../character/Character";
import type { SavingThrow, SpellSlotsForLevel } from "../character/CharacterTypes";
import { D20Test } from "../common/D20Test";
import { DiceString } from "../common/DiceString";

export default class AzamatCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 15 + 1 + 2 + 2 /* ASI 4/8/12 */,
        Dex: 13 + 1 /* ASI 4 */,
        Con: 14 + 2 + 2 /* Warforged + Belt of Dwarvenkind */,
        Int: 9,
        Wis: 10,
        Cha: 15 + 1 /* Warforged */,
      },
      characterLevel: 14,
      proficiencyBonus: 5,
      skillProficiencies: [
        { skill: "Athletics" },
        { skill: "History" },
        { skill: "Intimidation" },
        { skill: "Investigation" },
        { skill: "Perception" },
      ],
      saveProficiencies: [
        { save: "Wis" }, // Paladin
        { save: "Cha" }, // Paladin
      ],
      weapons: [
        { weapon: "Warhammer +1 (2h)", ability: "Str", damage: new DiceString("d10+1") },
        { weapon: "Unarmed", ability: "Str", damage: new DiceString(0) },
        { weapon: "Laser Axe", ability: "Str", damage: new DiceString("d10+d6") },
        { weapon: "Warhammer +1 (1h)", ability: "Str", damage: new DiceString("d8+1") },
        { weapon: "Javelin", ability: "Str", damage: new DiceString("d6") },
        { weapon: "Club", ability: "Str", damage: new DiceString("d4") },
        { weapon: "Warhammer", ability: "Str", damage: new DiceString("d8") },
      ],
      attackAddons: [
        { addon: "Radiant Strike", damage: new DiceString("d8") },
        {
          addon: "Divine Smite",
          damage: {
            base: { level: 1, damage: new DiceString("2d8") },
            increment: new DiceString("d8"),
          },
        },
        { addon: "Divine Smite (undead)", damage: { optional: true, damage: new DiceString("d8") } },
      ],
    });
  }

  // Override to add Charisma modifier (Aura of Protection)
  getSavingThrows(): SavingThrow[] {
    const baseSaves = super.getSavingThrows();
    const charismaMod = this.getAbilityModifier("Cha");

    return baseSaves.map(({ ability, check }) => ({
      ability,
      check: new D20Test("Saving Throw", ability, check.getAbilityModifier() + charismaMod, check.getProficiency()),
    }));
  }

  // Override: Paladin spell slots based on character level
  getSpellSlots(): SpellSlotsForLevel[] {
    // prettier-ignore
    const paladinSpellSlots: Record<number, SpellSlotsForLevel[]> = {
      1: [{level: 1, slots: 2}],
      2: [{level: 1, slots: 2}],
      3: [{level: 1, slots: 3}],
      4: [{level: 1, slots: 3}],
      5: [{level: 1, slots: 4}, {level: 2, slots: 2}],
      6: [{level: 1, slots: 4}, {level: 2, slots: 2}],
      7: [{level: 1, slots: 4}, {level: 2, slots: 3}],
      8: [{level: 1, slots: 4}, {level: 2, slots: 3}],
      9: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 2}],
      10: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 2}],
      11: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}],
      12: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}],
      13: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 1}],
      14: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 1}],
      15: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 2}],
      16: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 2}],
      17: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 1}],
      18: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 1}],
      19: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 2}],
      20: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 2}],
    };

    return paladinSpellSlots[this.characterLevel] || [];
  }
}
