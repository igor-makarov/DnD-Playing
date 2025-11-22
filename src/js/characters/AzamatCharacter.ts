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
          damage: [
            [1, new DiceString("2d8")],
            [2, new DiceString("3d8")],
            [3, new DiceString("4d8")],
            [4, new DiceString("5d8")],
          ],
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

  // Paladin spell slots based on character level
  getSpellSlots(): SpellSlotsForLevel[] {
    // prettier-ignore
    const paladinSpellSlots: Record<number, SpellSlotsForLevel[]> = {
      1: [[1, 2]],
      2: [[1, 2]],
      3: [[1, 3]],
      4: [[1, 3]],
      5: [[1, 4], [2, 2]],
      6: [[1, 4], [2, 2]],
      7: [[1, 4], [2, 3]],
      8: [[1, 4], [2, 3]],
      9: [[1, 4], [2, 3], [3, 2]],
      10: [[1, 4], [2, 3], [3, 2]],
      11: [[1, 4], [2, 3], [3, 3]],
      12: [[1, 4], [2, 3], [3, 3]],
      13: [[1, 4], [2, 3], [3, 3], [4, 1]],
      14: [[1, 4], [2, 3], [3, 3], [4, 1]],
      15: [[1, 4], [2, 3], [3, 3], [4, 2]],
      16: [[1, 4], [2, 3], [3, 3], [4, 2]],
      17: [[1, 4], [2, 3], [3, 3], [4, 3], [5, 1]],
      18: [[1, 4], [2, 3], [3, 3], [4, 3], [5, 1]],
      19: [[1, 4], [2, 3], [3, 3], [4, 3], [5, 2]],
      20: [[1, 4], [2, 3], [3, 3], [4, 3], [5, 2]],
    };

    return paladinSpellSlots[this.characterLevel] || [];
  }
}
