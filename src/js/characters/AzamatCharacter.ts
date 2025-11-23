import { Character } from "../character/Character";
import type { SavingThrow, SpellSlotsForLevel } from "../character/CharacterTypes";
import { D20Test } from "../common/D20Test";
import { DiceString } from "../common/DiceString";

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
      characterLevel: 14,
      proficiencyBonus: 5,
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
        { level: 1, roll: 10 },
        { level: 2, roll: 6 },
        { level: 3, roll: 6 },
        { level: 4, roll: 7 },
        { level: 5, roll: 6 },
        { level: 6, roll: 6 },
        { level: 7, roll: 7 },
        { level: 8, roll: 6 },
        { level: 9, roll: 9 },
        { level: 10, roll: 10 },
        { level: 11, roll: 6 },
        { level: 12, roll: 6 },
        { level: 13, roll: 8 },
        { level: 14, roll: 5 },
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

  // Override: Paladin spell slots based on character level
  getSpellSlots(): SpellSlotsForLevel[] {
    // prettier-ignore
    const paladinSpellSlots: Record<number, SpellSlotsForLevel[]> = {
      1: [{level: 1, slots: 2}],
      2: [{level: 1, slots: 2}],
      3: [{level: 1, slots: 3}],
      4: [{level: 1, slots: 3}],
      5: [{level: 1, slots: 4}, {level: 2, slots: 2}],
      6: [{level: 1, slots: 4}, {level: 2, slots: 2}],
      7: [{level: 1, slots: 4}, {level: 2, slots: 3}],
      8: [{level: 1, slots: 4}, {level: 2, slots: 3}],
      9: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 2}],
      10: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 2}],
      11: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}],
      12: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}],
      13: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 1}],
      14: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 1}],
      15: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 2}],
      16: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 2}],
      17: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 1}],
      18: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 1}],
      19: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 2}],
      20: [{level: 1, slots: 4}, {level: 2, slots: 3}, {level: 3, slots: 3}, {level: 4, slots: 3}, {level: 5, slots: 2}],
    };

    return paladinSpellSlots[this.characterLevel] || [];
  }
}
