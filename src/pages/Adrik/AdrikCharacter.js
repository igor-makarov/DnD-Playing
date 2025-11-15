import { Character } from "../../js/Character.js";

class AdrikCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        'Str': 11,
        'Dex': 13 + 1 /* ASI Cleric 4 */,
        'Con': 13 + 2 + 1 /* Dwarf bonus + ASI Cleric 4 */,
        'Int': 15,
        'Wis': 16 + 1 /* Hill Dwarf bonus */,
        'Cha': 12
      },
      characterLevel: 12,
      proficiencyBonus: 4,
      skills: [
        { skill: 'Acrobatics', modifier: 'Dex' },
        { skill: 'Animal Handling', modifier: 'Wis' },
        { skill: 'Arcana', modifier: 'Int', proficient: true },
        { skill: 'Athletics', modifier: 'Str' },
        { skill: 'Deception', modifier: 'Cha' },
        { skill: 'History', modifier: 'Int', proficient: true },
        { skill: 'Insight', modifier: 'Wis' },
        { skill: 'Intimidation', modifier: 'Cha' },
        { skill: 'Investigation', modifier: 'Int', proficient: true },
        { skill: 'Medicine', modifier: 'Wis' },
        { skill: 'Nature', modifier: 'Int', proficient: true },
        { skill: 'Perception', modifier: 'Wis' },
        { skill: 'Performance', modifier: 'Cha' },
        { skill: 'Persuasion', modifier: 'Cha' },
        { skill: 'Religion', modifier: 'Int' },
        { skill: 'Sleight of Hand', modifier: 'Dex' },
        { skill: 'Stealth', modifier: 'Dex' },
        { skill: 'Survival', modifier: 'Wis', proficient: true },
      ],
      saves: [
        { save: 'Str', proficient: true },
        { save: 'Dex', proficient: true },
        { save: 'Con' },
        { save: 'Int' },
        { save: 'Wis' },
        { save: 'Cha' }
      ]
    });
  }
}

export const character = new AdrikCharacter();
