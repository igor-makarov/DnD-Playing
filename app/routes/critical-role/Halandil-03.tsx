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

class HalandilCharacter extends Character {
  constructor() {
    super({
      name: "Halandil Fang",
      abilityScores: {
        Str: 10,
        Dex: 14,
        Con: 13,
        Int: 16,
        Wis: 16,
        Cha: 18,
      },
      classLevels: [{ className: "Bard", level: 3 }],
      skillProficiencies: [
        { skill: "Performance", multiplier: 2 }, // Expertise
        { skill: "Persuasion" },
        { skill: "History" },
        { skill: "Insight" },
      ],
      saveProficiencies: [
        { save: "Dex" }, // Bard
        { save: "Cha" }, // Bard
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d8"), roll: 8 },
        { level: 2, die: new DiceString("d8"), roll: 6 },
        { level: 3, die: new DiceString("d8"), roll: 6 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [{ weapon: "Liar's Blade", ability: "Dex", damage: new DiceString("d6") }];
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // Bardic Inspiration die
  getBardicInspirationDie(): string {
    return "d6";
  }

  // Number of Bardic Inspiration uses (= CHA mod, min 1)
  getBardicInspirationUses(): number {
    return Math.max(1, this.getAbilityModifier("Cha"));
  }
}

const character = new HalandilCharacter();

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
    classRef: renderHTML(getClass("Bard")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function HalandilPage() {
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
                  <span className="mono">13</span>
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
                  Bardic Inspiration
                </th>
              </tr>
              <tr>
                <td>Die</td>
                <td className="modifier mono">{character.getBardicInspirationDie()}</td>
              </tr>
              <tr>
                <td>Uses</td>
                <td className="modifier mono">{character.getBardicInspirationUses()}/long rest</td>
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
                  <InfoTooltip reference={classRef}>Bard</InfoTooltip> 3
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
                <td>[Bard] Bardic Inspiration</td>
                <td className="modifier">{character.getBardicInspirationDie()} to ally</td>
              </tr>
              <tr>
                <td>[Bard] Expertise</td>
                <td className="modifier">2 skills doubled</td>
              </tr>
              <tr>
                <td>[Bard] Jack of All Trades</td>
                <td className="modifier">+1 to non-prof checks</td>
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
                <td colSpan={2}> Fang family, Hallowed Round (owner) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
