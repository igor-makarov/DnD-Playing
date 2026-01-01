import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import WeaponAttackTable from "@/components/WeaponAttackTable/WeaponAttackTable";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import SpellSlotsTable from "@/components/spells/SpellSlotsTable";
import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class OcctisCharacter extends Character {
  constructor() {
    super({
      name: "Occtis Tachonis",
      abilityScores: {
        Str: 10,
        Dex: 16,
        Con: 16,
        Int: 19,
        Wis: 10,
        Cha: 15,
      },
      classLevels: [{ className: "Wizard", level: 3 }],
      skillProficiencies: [{ skill: "Arcana" }, { skill: "Investigation" }, { skill: "History" }],
      saveProficiencies: [
        { save: "Int" }, // Wizard
        { save: "Wis" }, // Wizard
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d6"), roll: 6 },
        { level: 2, die: new DiceString("d6"), roll: 4 },
        { level: 3, die: new DiceString("d6"), roll: 4 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [{ weapon: "Dagger", ability: "Dex", damage: new DiceString("d4") }];
  }

  // Spell Attack Modifier: Intelligence modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Int", this.getAbilityModifier("Int"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Intelligence modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }
}

const character = new OcctisCharacter();

export function meta() {
  return [{ title: character.name }];
}

interface LoaderData {
  humanRef: ReferenceRendered;
  hollowOneRef: ReferenceRendered;
  wizardRef: ReferenceRendered;
  necromancyRef: ReferenceRendered;
  ritualAdeptRef: ReferenceRendered;
  arcaneRecoveryRef: ReferenceRendered;
  scholarRef: ReferenceRendered;
  necromancySavantRef: ReferenceRendered;
}

// Server-only: runs during pre-render, not bundled for client
export async function loader(): Promise<LoaderData> {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { getCharacterCreationOption } = await import("@/js/utils/render-5etools/getCharacterCreationOption");
  const { getSubclass } = await import("@/js/utils/render-5etools/getSubclass");
  const { getClassFeature } = await import("@/js/utils/render-5etools/getClassFeature");
  const { getSubclassFeature } = await import("@/js/utils/render-5etools/getSubclassFeature");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    humanRef: renderHTML(getSpecies("Human")),
    hollowOneRef: renderHTML(getCharacterCreationOption("Hollow One")),
    wizardRef: renderHTML(getClass("Wizard")),
    necromancyRef: renderHTML(getSubclass("Wizard", "Necromancy")),
    ritualAdeptRef: renderHTML(getClassFeature("Ritual Adept", "Wizard")),
    arcaneRecoveryRef: renderHTML(getClassFeature("Arcane Recovery", "Wizard")),
    scholarRef: renderHTML(getClassFeature("Scholar", "Wizard")),
    necromancySavantRef: renderHTML(getSubclassFeature("Necromancy Savant", "Wizard", "Necromancy", "PHB")),
  };
}

export default function OcctisPage() {
  const { humanRef, hollowOneRef, wizardRef, necromancyRef, ritualAdeptRef, arcaneRecoveryRef, scholarRef, necromancySavantRef } =
    useLoaderData<LoaderData>();

  return (
    <>
      <base target="_blank" />
      <div className="row six-across">
        <AbilitiesTable character={character} />
      </div>
      <div className="row four-across">
        <div className="column">
          <table>
            <tbody>
              <tr>
                <th style={{ textAlign: "center" }}>Proficiency Bonus</th>
              </tr>
              <tr>
                <td className="modifier" style={{ textAlign: "center" }}>
                  <span className="mono">+{character.proficiencyBonus}&nbsp;</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column">
          <table>
            <tbody>
              <tr>
                <th style={{ textAlign: "center" }}>AC</th>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <span className="mono">16</span>
                  <span style={{ fontSize: "0.8em" }}> (13 w/o Mage Armor)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column">
          <table>
            <tbody>
              <tr>
                <th style={{ textAlign: "center" }}>HP</th>
              </tr>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <HitPointsInput hitPointMaximum={character.getHitPoints()} hitDiceByType={character.getHitDice()} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column">
          <table>
            <tbody>
              <tr>
                <th style={{ textAlign: "center" }}>Initiative</th>
              </tr>
              <tr>
                <td className="modifier" style={{ textAlign: "center" }}>
                  <span className="checkCell">
                    <D20TestCell roll={character.getInitiative()} />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="row three-and-large">
        <div className="column">
          <SkillsTable title="Skills" character={character} />
        </div>
        <div className="column">
          <SavesTable title="Saves" character={character} />
          <HitDiceTable hitDice={character.getHitDice()} conModifier={character.getAbilityModifier("Con")} />
        </div>
        <div className="column">
          <WeaponAttackTable weaponAttacks={character.getWeaponAttacks()} damageAddons={character.getWeaponAttackAddons()} />
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Spells
                </th>
              </tr>
              <tr>
                <td>Spell Attack Modifier</td>
                <td className="checkCell mono">
                  <D20TestCell roll={character.getSpellAttack()} />
                </td>
              </tr>
              <tr>
                <td>Spell Save DC</td>
                <td className="checkCell mono">
                  <span className="mono">{character.getSpellSaveDC()}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Name
                </th>
              </tr>
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>
                  {character.name}
                </td>
              </tr>
            </tbody>
          </table>
          <SpellSlotsTable spellSlots={character.getSpellSlots()} />
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Features
                </th>
              </tr>
              <tr>
                <th>Feature</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>Species</td>
                <td className="modifier">
                  <InfoTooltip reference={humanRef}>Human</InfoTooltip> (<InfoTooltip reference={hollowOneRef}>Hollow One</InfoTooltip>)
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={wizardRef}>Wizard</InfoTooltip> 3 (<InfoTooltip reference={necromancyRef}>Necromancer</InfoTooltip>)
                </td>
              </tr>
              <tr>
                <td>[Human] Resourceful</td>
                <td className="modifier">Heroic Inspiration on long rest</td>
              </tr>
              <tr>
                <td>[Human] Skillful</td>
                <td className="modifier">+1 skill proficiency</td>
              </tr>
              <tr>
                <td>[Human] Versatile</td>
                <td className="modifier">Origin feat</td>
              </tr>
              <tr>
                <td>[Hollow One] Ageless</td>
                <td className="modifier">no aging</td>
              </tr>
              <tr>
                <td>[Hollow One] Cling to Life</td>
                <td className="modifier">adv. on death saves</td>
              </tr>
              <tr>
                <td>[Hollow One] Revenance</td>
                <td className="modifier">undead ignore you</td>
              </tr>
              <tr>
                <td>[Hollow One] Unsettling Presence</td>
                <td className="modifier">frighten a creature</td>
              </tr>
              <tr>
                <td>
                  [Wizard 1] <InfoTooltip reference={ritualAdeptRef}>Ritual Adept</InfoTooltip>
                </td>
                <td className="modifier">cast ritual spells</td>
              </tr>
              <tr>
                <td>
                  [Wizard 1] <InfoTooltip reference={arcaneRecoveryRef}>Arcane Recovery</InfoTooltip>
                </td>
                <td className="modifier">recover spell slots</td>
              </tr>
              <tr>
                <td>
                  [Wizard 2] <InfoTooltip reference={scholarRef}>Scholar</InfoTooltip>
                </td>
                <td className="modifier">expertise in one skill</td>
              </tr>
              <tr>
                <td>
                  [Necromancer 3] <InfoTooltip reference={necromancySavantRef}>Necromancy Savant</InfoTooltip>
                </td>
                <td className="modifier">cheaper necromancy spells</td>
              </tr>
              <tr>
                <td>[Necromancer 3] Necromancy Spellbook</td>
                <td className="modifier">+2 necromancy spells</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Familiar
                </th>
              </tr>
              <tr>
                <td colSpan={2}> Pincushion (fox familiar) </td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Connections
                </th>
              </tr>
              <tr>
                <td colSpan={2}> House Tachonis, Penteveral (student) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
