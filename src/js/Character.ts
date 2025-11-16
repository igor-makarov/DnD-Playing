type Ability = 'Str' | 'Dex' | 'Con' | 'Int' | 'Wis' | 'Cha';
type Skill = {
  skill: string;
  modifier: Ability;
  proficient: boolean;
}

type SavingThrow = {
  save: Ability;
  proficient: boolean;
}

type Weapon = {
  weapon: string;
  damage: string;
  bonus: number;
}

export class Character {
  abilityScores: [Ability: number];
  characterLevel: number;
  proficiencyBonus: number;
  skills: [Skill];
  saves: [SavingThrow];
  weapons: Weapon[];
  constructor({ abilityScores, characterLevel, proficiencyBonus, skills, saves, weapons = [] }) {
    this.abilityScores = abilityScores;
    this.characterLevel = characterLevel;
    this.proficiencyBonus = proficiencyBonus;
    this.skills = skills;
    this.saves = saves;
    this.weapons = weapons;
  }

  abilityModifier(ability) {
    return Math.floor((this.abilityScores[ability] - 10) / 2);
  }

  createProficiency(proficient, multiplier) {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? 'E' : 'P';
    return { symbol: proficient ? symbol : ' ', bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }
}
