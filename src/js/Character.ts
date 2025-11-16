export type Ability = "Str" | "Dex" | "Con" | "Int" | "Wis" | "Cha";
export type Skill = {
  skill: string;
  modifier: Ability;
  proficient: boolean;
};

export type SavingThrow = {
  save: Ability;
  proficient: boolean;
};

export type Weapon = {
  weapon: string;
  ability: Ability;
  damage: string;
  bonus: number;
};

type DamageWithLevels = [level: number, damage: string][];

type OptionalDamage = {
  optional: true;
  damage: string;
};

export type AttackAddon = {
  addon: string;
  damage: string | DamageWithLevels | OptionalDamage;
};

export class Character {
  abilityScores: [Ability: number];
  characterLevel: number;
  proficiencyBonus: number;
  skills: Skill[];
  saves: SavingThrow[];
  weapons: Weapon[];
  attackAddons: AttackAddon[];
  constructor({ abilityScores, characterLevel, proficiencyBonus, skills, saves, weapons = [], attackAddons = [] }) {
    this.abilityScores = abilityScores;
    this.characterLevel = characterLevel;
    this.proficiencyBonus = proficiencyBonus;
    this.skills = skills;
    this.saves = saves;
    this.weapons = weapons;
    this.attackAddons = attackAddons;
  }

  abilityModifier(ability: Ability) {
    return Math.floor((this.abilityScores[ability] - 10) / 2);
  }

  createProficiency(proficient: boolean, multiplier: number | undefined) {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? "E" : "P";
    return { symbol: proficient ? symbol : " ", bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }
}
