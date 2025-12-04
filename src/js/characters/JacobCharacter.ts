import { Character } from "@/js/character/Character";
import type { WeaponAttackData } from "@/js/character/WeaponAttackTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

export default class JacobCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 13,
        Dex: 16,
        Con: 15 + 1 /* Background +1 */,
        Int: 11,
        Wis: 9,
        Cha: 18 + 2 /* Background +2 */,
      },
      classLevels: [{ className: "Rogue", level: 1 }],

      skillProficiencies: [
        { skill: "Deception" }, // Rogue
        { skill: "Intimidation" }, // Rogue
        { skill: "Persuasion", multiplier: 2 }, // Rogue with Expertise
        { skill: "Stealth", multiplier: 2 }, // Rogue with Expertise
        { skill: "Performance" }, // Background
        { skill: "Athletics" }, // Background
        { skill: "Acrobatics" }, // Human
      ],
      saveProficiencies: [
        { save: "Dex" }, // Rogue
        { save: "Int" }, // Rogue
      ],
      weapons: [
        { weapon: "Handaxe (Vex)", ability: "Dex", damage: new DiceString("d6") },
        { weapon: "Dagger (Nick)", ability: "Dex", damage: new DiceString("d4") },
        { weapon: "Shortbow", ability: "Dex", damage: new DiceString("d6") },
      ],
      attackAddons: [{ name: "Sneak Attack", damage: { optional: true, damage: new DiceString("d6") } }],
      hitPointRolls: [{ level: 1, die: new DiceString("d8"), roll: 8 }],
    });
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus (Magic Initiate)
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // AC with Mage Armor: 13 + DEX modifier
  getArmorClass(): number {
    return 13 + this.getAbilityModifier("Dex");
  }

  // Initiative with Alert feat: DEX modifier + Proficiency bonus
  getInitiative(): D20Test {
    return new D20Test("Ability Check", "Dex", this.getAbilityModifier("Dex"), this.createProficiency(true));
  }

  // Override to add True Strike variants of all weapons
  getWeaponAttacks(): WeaponAttackData[] {
    const baseWeapons = super.getWeaponAttacks();
    const trueStrikeWeapons: WeaponAttackData[] = [];

    // Create True Strike variant for each weapon
    for (const weapon of this.weapons) {
      const weaponDamageWithCha = DiceString.sum([weapon.damage, new DiceString(this.getAbilityModifier("Cha"))]);

      // Add extra radiant damage based on character level
      const extraRadiant = this.getCantripDamage(new DiceString("0"), new DiceString("d6"));
      const totalDamage = DiceString.sum([weaponDamageWithCha, extraRadiant]);

      trueStrikeWeapons.push({
        weapon: `True Strike + ${weapon.weapon}`,
        attackRoll: new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true)),
        damage: totalDamage.normalize(),
      });
    }

    return [...baseWeapons, ...trueStrikeWeapons];
  }
}
