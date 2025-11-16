import { Character } from "../../js/Character";

class AzamatCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        'Str': 15 + 1 + 2 + 2 /* ASI 4/8/12 */,
        'Dex': 13 + 1 /* ASI 4 */,
        'Con': 14 + 2 + 2 /* Warforged + Belt of Dwarvenkind */,
        'Int': 9,
        'Wis': 10,
        'Cha': 15 + 1, /* Warforged */
      },
      characterLevel: 14,
      proficiencyBonus: 5,
      skills: [
        { skill: 'Acrobatics', modifier: 'Dex' },
        { skill: 'Animal Handling', modifier: 'Wis' },
        { skill: 'Arcana', modifier: 'Int' },
        { skill: 'Athletics', modifier: 'Str', proficient: true },
        { skill: 'Deception', modifier: 'Cha' },
        { skill: 'History', modifier: 'Int', proficient: true },
        { skill: 'Insight', modifier: 'Wis' },
        { skill: 'Intimidation', modifier: 'Cha', proficient: true },
        { skill: 'Investigation', modifier: 'Int', proficient: true },
        { skill: 'Medicine', modifier: 'Wis' },
        { skill: 'Nature', modifier: 'Int' },
        { skill: 'Perception', modifier: 'Wis', proficient: true },
        { skill: 'Performance', modifier: 'Cha' },
        { skill: 'Persuasion', modifier: 'Cha' },
        { skill: 'Religion', modifier: 'Int' },
        { skill: 'Sleight of Hand', modifier: 'Dex' },
        { skill: 'Stealth', modifier: 'Dex' },
        { skill: 'Survival', modifier: 'Wis' },
      ],
      saves: [
        { save: 'Str' },
        { save: 'Dex' },
        { save: 'Con' },
        { save: 'Int' },
        { save: 'Wis', proficient: true }, // Paladin
        { save: 'Cha', proficient: true }, // Paladin
      ],
      weapons: [
        { weapon: 'Warhammer +1 (2h)', damage: 'd10', bonus: 1 },
        { weapon: 'Unarmed' },
        { weapon: 'Warhammer +1 (1h)', damage: 'd8', bonus: 1 },
        { weapon: 'Laser Axe', damage: 'd10+d6' },
        { weapon: 'Javelin', damage: 'd6' },
        { weapon: 'Club', damage: 'd4' },
        { weapon: 'Warhammer', damage: 'd8' },
      ],
      attackAddons: [
        { addon: 'Radiant Strike', damage: 'd8' },
      ],
    });
  }
}

export const character = new AzamatCharacter();
