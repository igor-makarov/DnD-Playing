import type {
  Ability,
  AbilityCheck,
  AbilityScores,
  AttackAddon,
  Proficiency,
  SavingThrow,
  SavingThrowProficiency,
  Skill,
  SkillAbilityCheck,
  SkillProficiency,
  Weapon,
} from "./CharacterTypes";
import { SKILL_TO_DEFAULT_ABILITIY } from "./CharacterTypes";
import { D20Test } from "./D20Test";

export class Character {
  abilityScores: AbilityScores;
  characterLevel: number;
  proficiencyBonus: number;
  skillProficiencies: SkillProficiency[];
  saveProficiencies: SavingThrowProficiency[];
  weapons: Weapon[];
  attackAddons: AttackAddon[];

  constructor({
    abilityScores,
    characterLevel,
    proficiencyBonus,
    skillProficiencies,
    saveProficiencies,
    weapons = [],
    attackAddons = [],
  }: {
    abilityScores: AbilityScores;
    characterLevel: number;
    proficiencyBonus: number;
    skillProficiencies: SkillProficiency[];
    saveProficiencies: SavingThrowProficiency[];
    weapons?: Weapon[];
    attackAddons?: AttackAddon[];
  }) {
    this.abilityScores = abilityScores;
    this.characterLevel = characterLevel;
    this.proficiencyBonus = proficiencyBonus;
    this.skillProficiencies = skillProficiencies;
    this.saveProficiencies = saveProficiencies;
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
        check: new D20Test("Ability Check", ability, modifier),
      };
    });
  }

  getSkillAbilityChecks(): SkillAbilityCheck[] {
    const allSkills = Object.keys(SKILL_TO_DEFAULT_ABILITIY) as Skill[];

    return allSkills.map((skill) => {
      const ability = SKILL_TO_DEFAULT_ABILITIY[skill];
      const modifier = this.getAbilityModifier(ability);

      const skillProf = this.skillProficiencies.find((sp) => sp.skill === skill);
      const proficiency = skillProf ? this.createProficiency(true, skillProf.multiplier ?? 1) : this.createProficiency(false);

      return {
        skill,
        ability,
        check: new D20Test("Ability Check", ability, modifier, proficiency),
      };
    });
  }

  getSavingThrows(): SavingThrow[] {
    return this.getAbilities().map((ability) => {
      const isProficient = this.saveProficiencies.some((s) => s.save === ability);
      const modifier = this.getAbilityModifier(ability);
      const proficiency = this.createProficiency(isProficient);
      return {
        ability,
        check: new D20Test("Saving Throw", ability, modifier, proficiency),
      };
    });
  }

  createProficiency(proficient: boolean, multiplier?: number): Proficiency {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? "E" : "P";
    return { symbol: proficient ? symbol : " ", bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }
}
