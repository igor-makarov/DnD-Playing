import { Character } from "../Character";
import type { SavingThrow } from "../CharacterTypes";
import { DiceString } from "../DiceString";

class AzamatCharacter extends Character {
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
      skills: [
        { skill: "Acrobatics", ability: "Dex" },
        { skill: "Animal Handling", ability: "Wis" },
        { skill: "Arcana", ability: "Int" },
        { skill: "Athletics", ability: "Str", proficient: true },
        { skill: "Deception", ability: "Cha" },
        { skill: "History", ability: "Int", proficient: true },
        { skill: "Insight", ability: "Wis" },
        { skill: "Intimidation", ability: "Cha", proficient: true },
        { skill: "Investigation", ability: "Int", proficient: true },
        { skill: "Medicine", ability: "Wis" },
        { skill: "Nature", ability: "Int" },
        { skill: "Perception", ability: "Wis", proficient: true },
        { skill: "Performance", ability: "Cha" },
        { skill: "Persuasion", ability: "Cha" },
        { skill: "Religion", ability: "Int" },
        { skill: "Sleight of Hand", ability: "Dex" },
        { skill: "Stealth", ability: "Dex" },
        { skill: "Survival", ability: "Wis" },
      ],
      saves: [
        { save: "Str" },
        { save: "Dex" },
        { save: "Con" },
        { save: "Int" },
        { save: "Wis", proficient: true }, // Paladin
        { save: "Cha", proficient: true }, // Paladin
      ],
      weapons: [
        { weapon: "Warhammer +1 (2h)", ability: "Str", damage: new DiceString("d10"), bonus: 1 },
        { weapon: "Unarmed", ability: "Str", damage: new DiceString(0) },
        { weapon: "Laser Axe", ability: "Str", damage: new DiceString("d10+d6") },
        { weapon: "Warhammer +1 (1h)", ability: "Str", damage: new DiceString("d8"), bonus: 1 },
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

    return baseSaves.map(({ ability, proficiency, dice }) => ({
      ability,
      proficiency,
      dice: DiceString.sum(dice, charismaMod),
    }));
  }
}

export const character = new AzamatCharacter();
