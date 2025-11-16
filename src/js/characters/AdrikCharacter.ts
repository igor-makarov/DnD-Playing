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
      skills: [
        { skill: "Acrobatics", ability: "Dex" },
        { skill: "Animal Handling", ability: "Wis" },
        { skill: "Arcana", ability: "Int", proficient: true },
        { skill: "Athletics", ability: "Str" },
        { skill: "Deception", ability: "Cha" },
        { skill: "History", ability: "Int", proficient: true },
        { skill: "Insight", ability: "Wis" },
        { skill: "Intimidation", ability: "Cha" },
        { skill: "Investigation", ability: "Int", proficient: true },
        { skill: "Medicine", ability: "Wis" },
        { skill: "Nature", ability: "Int", proficient: true },
        { skill: "Perception", ability: "Wis" },
        { skill: "Performance", ability: "Cha" },
        { skill: "Persuasion", ability: "Cha" },
        { skill: "Religion", ability: "Int" },
        { skill: "Sleight of Hand", ability: "Dex" },
        { skill: "Stealth", ability: "Dex" },
        { skill: "Survival", ability: "Wis", proficient: true },
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
