import type {
  Ability,
  AbilityCheck,
  AbilityScores,
  AttackAddon,
  Proficiency,
  SavingThrow,
  SavingThrowProficiency,
  SkillAbilityCheck,
  SkillProficiency,
  Weapon,
} from "./CharacterTypes";
import { D20Test, D20TestKind } from "./D20Test";

export class Character {
  abilityScores: AbilityScores;
  characterLevel: number;
  proficiencyBonus: number;
  skills: SkillProficiency[];
  saves: SavingThrowProficiency[];
  weapons: Weapon[];
  attackAddons: AttackAddon[];
  
  constructor({
    abilityScores,
    characterLevel,
    proficiencyBonus,
    skills,
    saves,
    weapons = [],
    attackAddons = [],
  }: {
    abilityScores: AbilityScores;
    characterLevel: number;
    proficiencyBonus: number;
    skills: SkillProficiency[];
    saves: SavingThrowProficiency[];
    weapons?: Weapon[];
    attackAddons?: AttackAddon[];
  }) {
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

  getAbilityChecks(): AbilityCheck[] {
    return this.getAbilities().map((ability) => {
      const modifier = this.getAbilityModifier(ability);
      return {
        ability,
        check: new D20Test(ability, D20TestKind.ABILITY_CHECK, modifier),
      };
    });
  }

  getSkillAbilityChecks(): SkillAbilityCheck[] {
    return this.skills.map((skillProf) => {
      const proficiency = this.createProficiency(skillProf.proficient ?? false);
      const modifier = this.getAbilityModifier(skillProf.ability);
      return {
        skill: skillProf.skill,
        ability: skillProf.ability,
        check: new D20Test(skillProf.ability, D20TestKind.ABILITY_CHECK, modifier, proficiency),
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
        check: new D20Test(ability, D20TestKind.SAVING_THROW, modifier, proficiency),
      };
    });
  }

  createProficiency(proficient: boolean, multiplier?: number): Proficiency {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? "E" : "P";
    return { symbol: proficient ? symbol : " ", bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }
}
