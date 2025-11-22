import { D20Test } from "../common/D20Test";
import { DiceString } from "../common/DiceString";
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
  SpellSlotsForLevel,
  Weapon,
} from "./CharacterTypes";
import { SKILL_TO_DEFAULT_ABILITIY } from "./CharacterTypes";
import type { DamageAddonData, DamageOptionData, WeaponAttackData } from "./WeaponAttackTypes";

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

  getInitiative(): D20Test {
    return new D20Test("Ability Check", "Dex", this.getAbilityModifier("Dex"));
  }

  createProficiency(proficient: boolean, multiplier?: number): Proficiency {
    multiplier ||= 1;
    const symbol = multiplier > 1 ? "E" : "P";
    return { symbol: proficient ? symbol : " ", bonus: (proficient ? 1 : 0) * this.proficiencyBonus * multiplier };
  }

  // Abstract method stub - override in subclasses to provide spell slots
  getSpellSlots(): SpellSlotsForLevel[] {
    return [];
  }

  // Get list of spell levels that have slots available
  getSpellLevels(): number[] {
    return this.getSpellSlots().map((slot) => slot.level);
  }

  // Get damage progression list for available spell levels
  getDamageProgression(base: DamageOptionData, increment: DiceString, step: number = 1): DamageOptionData[] {
    const baseLevel = base.level;
    const baseDamage = base.damage;
    const availableLevels = this.getSpellLevels().filter((level) => level >= baseLevel);

    return availableLevels.map((level) => {
      if (level < baseLevel) {
        return { level, damage: baseDamage };
      }

      const stepsProgressed = Math.floor((level - baseLevel) / step);

      if (stepsProgressed === 0) {
        return { level, damage: baseDamage };
      }

      // Create array of increments to add
      const increments = Array(stepsProgressed).fill(increment);
      const damage = DiceString.sum([baseDamage, ...increments]);

      return { level, damage };
    });
  }

  getWeaponAttacks(): WeaponAttackData[] {
    return this.weapons.map((w) => {
      const damageWithAbility = new DiceString(w.damage, this.getAbilityModifier(w.ability));
      const weaponBonus = w.damage.getModifier();

      return {
        weapon: w.weapon,
        attackRoll: new D20Test("Attack Roll", w.ability, this.getAbilityModifier(w.ability), this.createProficiency(true), weaponBonus),
        damage: {
          damage: damageWithAbility.normalize(),
        },
      };
    });
  }

  getWeaponAttackAddons(): DamageAddonData[] {
    return this.attackAddons.map((addon) => {
      const name = addon.addon;
      if (addon.damage instanceof DiceString) {
        return {
          addon: name,
          damage: {
            damage: addon.damage,
          },
        };
      } else if ("optional" in addon.damage) {
        // OptionalDamage - convert to OptionalDamageData
        return {
          addon: name,
          damage: {
            optional: true,
            damage: addon.damage.damage,
          },
        };
      } else {
        // DamageWithLevels - expand using getDamageProgression
        return {
          addon: name,
          damage: {
            options: this.getDamageProgression(addon.damage.base, addon.damage.increment, addon.damage.step),
          },
        };
      }
    });
  }
}
