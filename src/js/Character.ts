export type Ability = 'Str' | 'Dex' | 'Con' | 'Int' | 'Wis' | 'Cha';
export type Skill = {
  skill: string;
  modifier: Ability;
  proficient: boolean;
}

export type SavingThrow = {
  save: Ability;
  proficient: boolean;
}

export type Weapon = {
  weapon: string;
  damage: string;
  bonus: number;
}

export type WeaponAttack = {
  weapon: string;
  attackModifier: number;
  damageRoll: string;
  critRoll: string;
}

export class Character {
  abilityScores: [Ability: number];
  characterLevel: number;
  proficiencyBonus: number;
  skills: Skill[];
  saves: SavingThrow[];
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

  createWeaponAttacks(): WeaponAttack[] {
    return this.weapons.map(w => ({
      weapon: w.weapon,
      attackModifier: this.abilityModifier('Str') + this.proficiencyBonus + (w.bonus ?? 0),
      damageRoll: `${w.damage ?? ''}+${this.abilityModifier('Str') + (w.bonus ?? 0)}`,
      critRoll: `${w.damage ? w.damage + '+' + w.damage : ''}+${this.abilityModifier('Str') + (w.bonus ?? 0)}`,
    }))
  }
}
