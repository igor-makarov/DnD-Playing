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

class MurrayCharacter extends Character {
  constructor() {
    super({
      name: "Murray Mag'Nesson",
      abilityScores: {
        Str: 11,
        Dex: 8,
        Con: 16,
        Int: 19,
        Wis: 12,
        Cha: 12,
      },
      classLevels: [{ className: "Wizard", level: 3 }],
      skillProficiencies: [{ skill: "Arcana" }, { skill: "History" }, { skill: "Investigation" }],
      saveProficiencies: [
        { save: "Int" }, // Wizard
        { save: "Wis" }, // Wizard
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d6"), roll: 6 },
        { level: 2, die: new DiceString("d6"), roll: 6 },
        { level: 3, die: new DiceString("d6"), roll: 6 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [];
  }

  // Spell Attack Modifier: Intelligence modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Int", this.getAbilityModifier("Int"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Intelligence modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // Portent dice for Divination wizard
  getPortentDice(): number {
    return 2;
  }
}

const character = new MurrayCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Dwarf")),
    classRef: renderHTML(getClass("Wizard")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function MurrayPage() {
  const { speciesRef, classRef } = useLoaderData<LoaderData>();

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
                  <span className="mono">12</span>
                  <span style={{ fontSize: "0.8em" }}> (9 w/o Mage Armor)</span>
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
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Portent
                </th>
              </tr>
              <tr>
                <td>Dice per long rest</td>
                <td className="modifier mono">{character.getPortentDice()}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ fontSize: "0.9em" }}>
                  {" "}
                  Replace any d20 roll before outcome{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
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
                  <InfoTooltip reference={speciesRef}>Dwarf</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Wizard</InfoTooltip> 3 (Diviner)
                </td>
              </tr>
              <tr>
                <td>[Dwarf] Darkvision</td>
                <td className="modifier">120 ft.</td>
              </tr>
              <tr>
                <td>[Dwarf] Dwarven Resilience</td>
                <td className="modifier">resist poison, adv. vs poison</td>
              </tr>
              <tr>
                <td>[Dwarf] Dwarven Toughness</td>
                <td className="modifier">+1 HP per level</td>
              </tr>
              <tr>
                <td>[Dwarf] Stonecunning</td>
                <td className="modifier">tremorsense 60 ft. (2/day)</td>
              </tr>
              <tr>
                <td>[Wizard] Ritual Adept</td>
                <td className="modifier">cast ritual spells</td>
              </tr>
              <tr>
                <td>[Wizard] Arcane Recovery</td>
                <td className="modifier">recover spell slots</td>
              </tr>
              <tr>
                <td>[Wizard] Scholar</td>
                <td className="modifier">expertise in one skill</td>
              </tr>
              <tr>
                <td>[Diviner] Divination Savant</td>
                <td className="modifier">cheaper divination spells</td>
              </tr>
              <tr>
                <td>[Diviner] Portent</td>
                <td className="modifier">2 pre-rolled d20s</td>
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
                <td colSpan={2}> Penteveral (Bursar) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
