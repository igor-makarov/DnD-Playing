import { D20Test } from "../common/D20Test";
import { DiceString } from "../common/DiceString";
import type {
  Ability,
  AbilityCheck,
  AbilityScores,
  AttackAddon,
  ClassLevel,
  HitPointRoll,
  Proficiency,
  SavingThrow,
  SavingThrowProficiency,
  Skill,
  SkillAbilityCheck,
  SkillProficiency,
  SpellSlotsForLevel,
  Weapon,
} from "./CharacterTypes";
import { PROFICIENCY_BONUS_BY_LEVEL, SKILL_TO_DEFAULT_ABILITIY } from "./CharacterTypes";
import type { DamageLevel, OptionalDamage } from "./DamageTypes";
import type { DamageAddonData, WeaponAttackData } from "./WeaponAttackTypes";

export class Character {
  abilityScores: AbilityScores;
  classLevels: ClassLevel[];
  skillProficiencies: SkillProficiency[];
  saveProficiencies: SavingThrowProficiency[];
  weapons: Weapon[];
  attackAddons: AttackAddon[];
  hitPointRolls: HitPointRoll[];

  constructor({
    abilityScores,
    classLevels = [],
    skillProficiencies,
    saveProficiencies,
    weapons = [],
    attackAddons = [],
    hitPointRolls = [],
  }: {
    abilityScores: AbilityScores;
    classLevels?: ClassLevel[];
    skillProficiencies: SkillProficiency[];
    saveProficiencies: SavingThrowProficiency[];
    weapons?: Weapon[];
    attackAddons?: AttackAddon[];
    hitPointRolls?: HitPointRoll[];
  }) {
    this.abilityScores = abilityScores;
    this.classLevels = classLevels;
    this.skillProficiencies = skillProficiencies;
    this.saveProficiencies = saveProficiencies;
    this.weapons = weapons;
    this.attackAddons = attackAddons;
    this.hitPointRolls = hitPointRolls;
  }

  get characterLevel(): number {
    return this.classLevels.reduce((total, classLevel) => total + classLevel.level, 0);
  }

  get proficiencyBonus(): number {
    if (this.characterLevel < 1 || this.characterLevel > PROFICIENCY_BONUS_BY_LEVEL.length) {
      return 0; // Or handle error/edge case as appropriate
    }
    return PROFICIENCY_BONUS_BY_LEVEL[this.characterLevel - 1];
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
  getDamageProgression(base: DamageLevel, increment: DiceString, step: number = 1): DamageLevel[] {
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
        damage: damageWithAbility.normalize(),
      };
    });
  }

  getWeaponAttackAddons(): DamageAddonData[] {
    return this.attackAddons.map((addon) => {
      const { name, damage } = addon;
      if (damage instanceof DiceString) {
        return { name, damage: damage as DiceString };
      } else if ("optional" in damage) {
        // OptionalDamage
        return { name, damage: damage as OptionalDamage };
      } else {
        // DamageWithLevels - expand using getDamageProgression
        return {
          name,
          damage: {
            options: this.getDamageProgression(damage.base, damage.increment, damage.step),
          },
        };
      }
    });
  }

  getHitPointsForLevel(level: number): number | undefined {
    const rollData = this.hitPointRolls.find((r) => r.level === level);
    if (!rollData) {
      return undefined;
    }

    return rollData.roll + this.getAbilityModifier("Con");
  }

  getHitPoints(): number {
    let total = 0;

    for (const rollData of this.hitPointRolls) {
      const hitPointsPerLevel = this.getHitPointsForLevel(rollData.level);
      if (hitPointsPerLevel) {
        total += hitPointsPerLevel;
      }
    }

    return total;
  }

  getHitDice(): Array<{ die: DiceString; count: number }> {
    // Group hit dice by their sides
    const diceMap = new Map<string, number>();

    for (const rollData of this.hitPointRolls) {
      const dieString = rollData.die.toString();
      const current = diceMap.get(dieString) || 0;
      diceMap.set(dieString, current + 1);
    }

    // Convert to array and sort by die size (descending)
    const result: Array<{ die: DiceString; count: number }> = [];
    for (const [dieString, count] of diceMap.entries()) {
      result.push({ die: new DiceString(dieString), count });
    }

    // Sort by die size (largest first)
    result.sort((a, b) => {
      // Extract die size from string (e.g., "d10" -> 10)
      const aSides = parseInt(a.die.toString().substring(1));
      const bSides = parseInt(b.die.toString().substring(1));
      return bSides - aSides;
    });

    return result;
  }
}
