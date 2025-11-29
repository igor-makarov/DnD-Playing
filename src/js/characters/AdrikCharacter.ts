import { Character } from "@/js/character/Character.js";
import { DiceString } from "@/js/common/DiceString";

export default class AdrikCharacter extends Character {
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
      classLevels: [
        { className: "Ranger", level: 5 },
        { className: "Cleric", level: 7 },
      ],
      // prettier-ignore
      skillProficiencies: [
        { skill: "Arcana" },
        { skill: "History" },
        { skill: "Investigation" },
        { skill: "Nature" },
        { skill: "Survival" },
      ],
      saveProficiencies: [
        { save: "Str" }, // Ranger
        { save: "Dex" }, // Ranger
      ],
      hitPointRolls: [
        // Ranger (D10) levels 1-5
        { level: 1, die: new DiceString("d10"), roll: 10 },
        { level: 2, die: new DiceString("d10"), roll: 5 },
        { level: 3, die: new DiceString("d10"), roll: 9 },
        { level: 4, die: new DiceString("d10"), roll: 9 },
        { level: 5, die: new DiceString("d10"), roll: 7 },
        // Cleric (D8) levels 6-12
        { level: 6, die: new DiceString("d8"), roll: 5 },
        { level: 7, die: new DiceString("d8"), roll: 5 },
        { level: 8, die: new DiceString("d8"), roll: 5 },
        { level: 9, die: new DiceString("d8"), roll: 5 },
        { level: 10, die: new DiceString("d8"), roll: 5 },
        { level: 11, die: new DiceString("d8"), roll: 5 },
        { level: 12, die: new DiceString("d8"), roll: 5 },
      ],
    });
  }

  // Override: Adrik gets +1 HP per level from Hill Dwarf Dwarven Toughness
  getHitPointsForLevel(level: number): number | undefined {
    const hitPointsForLevel = super.getHitPointsForLevel(level);
    if (!hitPointsForLevel) {
      return undefined;
    }

    return hitPointsForLevel + 1; // Hill Dwarf Dwarven Toughness
  }
}
