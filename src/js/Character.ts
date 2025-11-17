import type {
  Ability,
  AbilityScores,
  AttackAddon,
  Proficiency,
  SavingThrow,
  SavingThrowProficiency,
  Skill,
  SkillProficiency,
  Weapon,
} from "./CharacterTypes";
import { DiceString } from "./DiceString";

export class Character {
  abilityScores: AbilityScores;
  characterLevel: number;
  proficiencyBonus: number;
  skills: SkillProficiency[];
  saves: SavingThrowProficiency[];
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

  getAbilities(): Ability[] {
    return Object.keys(this.abilityScores) as Ability[];
  }

  getAbilityModifier(ability: Ability): number {
    return Math.floor((this.abilityScores[ability] - 10) / 2);
  }

  getSkills(): Skill[] {
    return this.skills.map((skillProf) => {
      const proficiency = this.createProficiency(skillProf.proficient ?? false);
      const modifier = this.getAbilityModifier(skillProf.ability);
      return {
        skill: skillProf.skill,
        ability: skillProf.ability,
        proficiency,
        dice: DiceString.init("d20", modifier + proficiency.bonus),
      };
    });
  }

  getSavingThrows(): SavingThrow[] {
    return this.getAbilities().map((ability) => {
      const save = this.saves.find((s) => s.save === ability);
      const modifier = this.getAbilityModifier(ability);
      const proficiency = this.createProficiency(save?.proficient ?? false);
      return {
        ability,
        proficiency,
        dice: DiceString.init("d20", modifier + proficiency.bonus),
      };
    });
  }

  createProficiency(proficient: boolean, multiplier?: number): Proficiency {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? "E" : "P";
    return { symbol: proficient ? symbol : " ", bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }
}
