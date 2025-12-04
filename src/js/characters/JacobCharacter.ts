import { Character } from "@/js/character/Character";
import type { AttackAddon, Weapon } from "@/js/character/CharacterTypes";
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
      hitPointRolls: [{ level: 1, die: new DiceString("d8"), roll: 8 }],
    });
  }

  protected getWeapons(): Weapon[] {
    const baseWeapons: Weapon[] = [
      { weapon: "Shortsword (Vex)", ability: "Dex", damage: new DiceString("d6") },
      { weapon: "Dagger (Nick)", ability: "Dex", damage: new DiceString("d4") },
      { weapon: "Dart (Vex)", ability: "Dex", damage: new DiceString("d4") },
      { weapon: "Shortbow (Vex)", ability: "Dex", damage: new DiceString("d6") },
    ];

    const trueStrikeWeapons = baseWeapons.map((weapon) => {
      // Add extra radiant damage based on character level
      const extraRadiant = this.getCantripDamage(new DiceString("0"), new DiceString("d6"));
      const totalDamage = DiceString.sum([weapon.damage, extraRadiant]);

      return {
        weapon: `True Strike + ${weapon.weapon}`,
        ability: "Cha" as const,
        damage: totalDamage,
      };
    });

    return [...baseWeapons, ...trueStrikeWeapons];
  }

  private getSneakAttackDice(): DiceString {
    const rogueLevel = this.getClassLevel("Rogue");
    const sneakAttackDice = Math.ceil(rogueLevel / 2);
    return new DiceString("d6").multiply(sneakAttackDice);
  }

  protected getAttackAddons(): AttackAddon[] {
    return [{ name: "Sneak Attack", damage: { optional: true, damage: this.getSneakAttackDice() } }];
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
}
