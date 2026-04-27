import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import {
  ARTIFICER_MAGIC_ITEM_PLANS_KNOWN_BY_LEVEL,
  ARTIFICER_PREPARED_SPELLS_BY_LEVEL,
  ARTIFICER_REPLICATE_MAGIC_ITEMS_BY_LEVEL,
} from "@/js/character/classes/ArtificerTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

export default class MiloCharacter extends Character {
  constructor() {
    super({
      name: "Milo Korr",
      abilityScores: {
        Str: 8,
        Dex: 14 + 1 /* DM bonus +1 */,
        Con: 13 + 1 /* Tinker background +1 */,
        Int: 15 + 2 /* Tinker background +2 */,
        Wis: 12,
        Cha: 10,
      },
      classLevels: [{ className: "Artificer", level: 2 }],
      skillProficiencies: [
        { skill: "Arcana" }, // Artificer
        { skill: "Investigation" }, // Artificer
        { skill: "Perception" }, // Human
        { skill: "History" }, // Tinker background
        { skill: "Nature" }, // Tinker background
      ],
      saveProficiencies: [
        { save: "Con" }, // Artificer
        { save: "Int" }, // Artificer
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d8"), roll: 8 },
        { level: 2, die: new DiceString("d8"), roll: 5 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [
      { weapon: "Light Crossbow", ability: "Dex", damage: new DiceString("d8") },
      { weapon: "Dagger", ability: "Dex", damage: new DiceString("d4") },
    ];
  }

  getArmorClass(): number {
    return 12 + this.getAbilityModifier("Dex"); // Studded Leather
  }

  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Int", this.getAbilityModifier("Int"), this.createProficiency(true));
  }

  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  getPreparedSpellsCount(): number {
    const artificerLevel = this.getClassLevel("Artificer");
    return ARTIFICER_PREPARED_SPELLS_BY_LEVEL[artificerLevel - 1] ?? 0;
  }

  getTinkersMagicUses(): number {
    return Math.max(1, this.getAbilityModifier("Int"));
  }

  getReplicateMagicItemsCount(): number {
    const artificerLevel = this.getClassLevel("Artificer");
    return ARTIFICER_REPLICATE_MAGIC_ITEMS_BY_LEVEL[artificerLevel - 1] ?? 0;
  }

  getReplicateMagicItemPlansKnown(): number {
    const artificerLevel = this.getClassLevel("Artificer");
    return ARTIFICER_MAGIC_ITEM_PLANS_KNOWN_BY_LEVEL[artificerLevel - 1] ?? 0;
  }

  getLuckPoints(): number {
    return this.proficiencyBonus;
  }
}
