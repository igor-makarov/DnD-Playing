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
import { DiceString } from "./DiceString";
import type { DamageAddonData, WeaponAttackData } from "./character/WeaponAttackTypes";

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

  getWeaponAttacks(): WeaponAttackData[] {
    return this.weapons.map((w) => {
      const damageWithAbility = DiceString.sum(w.damage, this.getAbilityModifier(w.ability));
      const weaponBonus = w.damage.getModifier();

      return {
        weapon: w.weapon,
        attackRoll: new D20Test("Attack Roll", w.ability, this.getAbilityModifier(w.ability), this.createProficiency(true), weaponBonus),
        damage: {
          damageRoll: damageWithAbility.normalize().toString(),
          critRoll: damageWithAbility.crit().normalize().toString(),
        },
      };
    });
  }

  getWeaponAttackAddons(): DamageAddonData[] {
    return this.attackAddons.map((addon) => {
      if (addon.damage instanceof DiceString) {
        const addonBaseDamage = addon.damage;
        return {
          addon: addon.addon,
          damage: {
            damageRoll: addonBaseDamage.normalize().toString(),
            critRoll: addonBaseDamage.crit().normalize().toString(),
          },
        };
      } else if ("optional" in addon.damage) {
        // OptionalDamage - convert to OptionalDamageData
        const addonBaseDamage = addon.damage.damage;
        return {
          addon: addon.addon,
          damage: {
            optional: true,
            damageRoll: addonBaseDamage.normalize().toString(),
            critRoll: addonBaseDamage.crit().normalize().toString(),
          },
        };
      } else {
        // DamageWithLevels - convert all levels to damage options
        const options = addon.damage.map(([level, damageObj]) => {
          return {
            level,
            damageRoll: damageObj.normalize().toString(),
            critRoll: damageObj.crit().normalize().toString(),
          };
        });
        return {
          addon: addon.addon,
          damage: { options },
        };
      }
    });
  }
}
