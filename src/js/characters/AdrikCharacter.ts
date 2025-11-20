import { Character } from "../Character.js";

class AdrikCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 11,
        Dex: 13 + 1 /* ASI Cleric 4 */,
        Con: 13 + 2 + 1 /* Dwarf bonus + ASI Cleric 4 */,
        Int: 15,
        Wis: 16 + 1 /* Hill Dwarf bonus */,
        Cha: 12,
      },
      characterLevel: 12,
      proficiencyBonus: 4,
      // prettier-ignore
      skillProficiencies: [
        { skill: "Arcana" },
        { skill: "History" },
        { skill: "Investigation" },
        { skill: "Nature" },
        { skill: "Survival" },
      ],
      saves: [
        { save: "Str", proficient: true },
        { save: "Dex", proficient: true },
        { save: "Con" },
        { save: "Int" },
        { save: "Wis" },
        { save: "Cha" },
      ],
    });
  }
}

export const character = new AdrikCharacter();
