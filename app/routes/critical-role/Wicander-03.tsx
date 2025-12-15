import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import SpellSlotsTables from "@/components/SpellSlotsTables";
import WeaponAttackTable from "@/components/WeaponAttackTable/WeaponAttackTable";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class WicanderCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 10,
        Dex: 15,
        Con: 15,
        Int: 12,
        Wis: 10,
        Cha: 18,
      },
      classLevels: [{ className: "Sorcerer", level: 3 }],
      skillProficiencies: [{ skill: "Persuasion" }, { skill: "Religion" }],
      saveProficiencies: [
        { save: "Con" }, // Sorcerer
        { save: "Cha" }, // Sorcerer
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d6"), roll: 6 },
        { level: 2, die: new DiceString("d6"), roll: 4 },
        { level: 3, die: new DiceString("d6"), roll: 4 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [{ weapon: "Cane", ability: "Dex", damage: new DiceString("d4") }];
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // Sorcery Points
  getSorceryPoints(): number {
    return this.getClassLevel("Sorcerer");
  }
}

const character = new WicanderCharacter();
const characterName = "Wicander Halovar";

export function meta() {
  return [{ title: characterName }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Aasimar")),
    classRef: renderHTML(getClass("Sorcerer")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function WicanderPage() {
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
                  Sorcery Points
                </th>
              </tr>
              <tr>
                <td>Points</td>
                <td className="modifier mono">{character.getSorceryPoints()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <SpellSlotsTables character={character} />
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
                  <InfoTooltip reference={speciesRef}>Aasimar</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Sorcerer</InfoTooltip> 3 (Clockwork)
                </td>
              </tr>
              <tr>
                <td>[Aasimar] Celestial Resistance</td>
                <td className="modifier">resist radiant & necrotic</td>
              </tr>
              <tr>
                <td>[Aasimar] Darkvision</td>
                <td className="modifier">60 ft.</td>
              </tr>
              <tr>
                <td>[Aasimar] Healing Hands</td>
                <td className="modifier">heal = level once/LR</td>
              </tr>
              <tr>
                <td>[Aasimar] Light Bearer</td>
                <td className="modifier">Light cantrip</td>
              </tr>
              <tr>
                <td>[Aasimar] Celestial Revelation</td>
                <td className="modifier">transformation</td>
              </tr>
              <tr>
                <td>[Sorcerer] Innate Sorcery</td>
                <td className="modifier">bonus action, adv on spell attacks</td>
              </tr>
              <tr>
                <td>[Sorcerer] Sorcery Points</td>
                <td className="modifier">{character.getSorceryPoints()} points</td>
              </tr>
              <tr>
                <td>[Sorcerer] Metamagic</td>
                <td className="modifier">2 options known</td>
              </tr>
              <tr>
                <td>[Clockwork] Restore Balance</td>
                <td className="modifier">negate adv/disadv</td>
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
                <td colSpan={2}> House Halovar, Candescent Creed (Light Priest) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
