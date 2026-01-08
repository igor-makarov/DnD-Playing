import { Character } from "@/js/character/Character";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

export default class MegCharacter extends Character {
  constructor() {
    super({
      name: "Meg",
      abilityScores: {
        Str: 8,
        Dex: 14,
        Con: 13 + 1 /* Wayfarer +1 */,
        Int: 12,
        Wis: 10,
        Cha: 15 + 1 + 2 /* DM Bonus +1, Wayfarer +2 */,
      },
      classLevels: [{ className: "Warlock", level: 1 }],

      skillProficiencies: [
        { skill: "Intimidation" }, // Warlock
        { skill: "Arcana" }, // Warlock
        { skill: "Insight" }, // Wayfarer
        { skill: "Stealth" }, // Wayfarer
        { skill: "Perception" }, // High Elf
      ],
      saveProficiencies: [
        { save: "Wis" }, // Warlock
        { save: "Cha" }, // Warlock
      ],
      hitPointRolls: [{ level: 1, die: new DiceString("d8"), roll: 8 }],
    });
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // AC with Light Armor (Leather): 11 + DEX modifier
  getArmorClass(): number {
    return 11 + this.getAbilityModifier("Dex");
  }

  // Initiative with Alert feat: DEX modifier + Proficiency bonus
  getInitiative(): D20Test {
    return new D20Test("Ability Check", "Dex", this.getAbilityModifier("Dex"), this.createProficiency(true));
  }

  // Hollow One: Unsettling Presence (1/long rest)
  getUnsettlingPresenceRange(): number {
    return 15;
  }
}
