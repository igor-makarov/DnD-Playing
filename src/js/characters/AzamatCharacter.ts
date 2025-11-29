import { Character } from "@/js/character/Character";
import type { SavingThrow } from "@/js/character/CharacterTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

export default class AzamatCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 15 + 1 + 2 + 2 /* ASI 4/8/12 */,
        Dex: 13 + 1 /* ASI 4 */,
        Con: 14 + 2 + 2 /* Warforged + Belt of Dwarvenkind */,
        Int: 9,
        Wis: 10,
        Cha: 15 + 1 /* Warforged */,
      },
      classLevels: [{ className: "Paladin", level: 14 }],

      skillProficiencies: [
        { skill: "Athletics" },
        { skill: "History" },
        { skill: "Intimidation" },
        { skill: "Investigation" },
        { skill: "Perception" },
      ],
      saveProficiencies: [
        { save: "Wis" }, // Paladin
        { save: "Cha" }, // Paladin
      ],
      weapons: [
        { weapon: "Warhammer +1 (2h)", ability: "Str", damage: new DiceString("d10+1") },
        { weapon: "Unarmed", ability: "Str", damage: new DiceString(0) },
        { weapon: "Laser Axe", ability: "Str", damage: new DiceString("d10+d6") },
        { weapon: "Warhammer +1 (1h)", ability: "Str", damage: new DiceString("d8+1") },
        { weapon: "Javelin", ability: "Str", damage: new DiceString("d6") },
        { weapon: "Club", ability: "Str", damage: new DiceString("d4") },
        { weapon: "Warhammer", ability: "Str", damage: new DiceString("d8") },
      ],
      attackAddons: [
        { name: "Radiant Strike", damage: new DiceString("d8") },
        { name: "Divine Smite", damage: { base: { level: 1, damage: new DiceString("2d8") }, increment: new DiceString("d8") } },
        { name: "Divine Smite (undead)", damage: { optional: true, damage: new DiceString("d8") } },
        { name: "Searing Smite", damage: { base: { level: 1, damage: new DiceString("d6") }, increment: new DiceString("d6") } },
        { name: "Thunderous Smite", damage: { base: { level: 1, damage: new DiceString("2d6") }, increment: new DiceString("d6") } },
        { name: "Wrathful Smite", damage: { base: { level: 1, damage: new DiceString("d6") }, increment: new DiceString("d6") } },
        { name: "Shining Smite", damage: { base: { level: 2, damage: new DiceString("2d6") }, increment: new DiceString("d6") } },
        { name: "Blinding Smite", damage: { base: { level: 3, damage: new DiceString("3d8") }, increment: new DiceString("d8") } },
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d10"), roll: 10 },
        { level: 2, die: new DiceString("d10"), roll: 6 },
        { level: 3, die: new DiceString("d10"), roll: 6 },
        { level: 4, die: new DiceString("d10"), roll: 7 },
        { level: 5, die: new DiceString("d10"), roll: 6 },
        { level: 6, die: new DiceString("d10"), roll: 6 },
        { level: 7, die: new DiceString("d10"), roll: 7 },
        { level: 8, die: new DiceString("d10"), roll: 6 },
        { level: 9, die: new DiceString("d10"), roll: 9 },
        { level: 10, die: new DiceString("d10"), roll: 10 },
        { level: 11, die: new DiceString("d10"), roll: 6 },
        { level: 12, die: new DiceString("d10"), roll: 6 },
        { level: 13, die: new DiceString("d10"), roll: 8 },
        { level: 14, die: new DiceString("d10"), roll: 5 },
      ],
    });
  }

  // Override to add Charisma modifier (Aura of Protection)
  getSavingThrows(): SavingThrow[] {
    const baseSaves = super.getSavingThrows();
    const charismaMod = this.getAbilityModifier("Cha");

    return baseSaves.map(({ ability, check }) => ({
      ability,
      check: new D20Test("Saving Throw", ability, check.getAbilityModifier() + charismaMod, check.getProficiency()),
    }));
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  getChannelDivinity(): number {
    return 2;
  }

  getLayOnHandsMaximum(): number {
    return 5 * this.characterLevel;
  }
}
