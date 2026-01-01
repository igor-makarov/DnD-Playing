import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import CharacterNameTable from "@/components/CharacterNameTable";
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

class ThaishaCharacter extends Character {
  constructor() {
    super({
      name: "Thaisha Lloy",
      abilityScores: {
        Str: 13,
        Dex: 13,
        Con: 16,
        Int: 13,
        Wis: 20,
        Cha: 16,
      },
      classLevels: [{ className: "Druid", level: 3 }],
      skillProficiencies: [{ skill: "Nature" }, { skill: "Perception" }],
      saveProficiencies: [
        { save: "Int" }, // Druid
        { save: "Wis" }, // Druid
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d8"), roll: 8 },
        { level: 2, die: new DiceString("d8"), roll: 5 },
        { level: 3, die: new DiceString("d8"), roll: 6 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [{ weapon: "Lloy Staff", ability: "Wis", damage: new DiceString("d6") }];
  }

  // Spell Attack Modifier: Wisdom modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Wis", this.getAbilityModifier("Wis"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Wisdom modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }
}

const character = new ThaishaCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Orc")),
    classRef: renderHTML(getClass("Druid")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function ThaishaPage() {
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
                  <span className="mono">14</span>
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
          <CharacterNameTable name={character.name} />
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
                  <InfoTooltip reference={speciesRef}>Orc</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Druid</InfoTooltip> 3 (Circle of the Land)
                </td>
              </tr>
              <tr>
                <td>[Orc] Adrenaline Rush</td>
                <td className="modifier">Dash as BA, temp HP</td>
              </tr>
              <tr>
                <td>[Orc] Darkvision</td>
                <td className="modifier">120 ft.</td>
              </tr>
              <tr>
                <td>[Orc] Relentless Endurance</td>
                <td className="modifier">drop to 1 HP instead of 0</td>
              </tr>
              <tr>
                <td>[Druid] Druidic</td>
                <td className="modifier">secret language</td>
              </tr>
              <tr>
                <td>[Druid] Primal Order</td>
                <td className="modifier">bonus cantrip</td>
              </tr>
              <tr>
                <td>[Druid] Wild Shape</td>
                <td className="modifier">transform into beasts</td>
              </tr>
              <tr>
                <td>[Druid] Wild Companion</td>
                <td className="modifier">summon familiar</td>
              </tr>
              <tr>
                <td>[Circle of Land] Land&apos;s Aid</td>
                <td className="modifier">bonus healing</td>
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
                <td colSpan={2}> Old Path (member), Lloy family, Fang family </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
