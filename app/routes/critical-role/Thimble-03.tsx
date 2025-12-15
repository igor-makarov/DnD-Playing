import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import WeaponAttackTable from "@/components/WeaponAttackTable/WeaponAttackTable";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class ThimbleCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 3,
        Dex: 20,
        Con: 18,
        Int: 14,
        Wis: 17,
        Cha: 16,
      },
      classLevels: [{ className: "Rogue", level: 3 }],
      skillProficiencies: [{ skill: "Acrobatics" }, { skill: "Sleight of Hand" }, { skill: "Stealth" }, { skill: "Perception" }],
      saveProficiencies: [
        { save: "Dex" }, // Rogue
        { save: "Int" }, // Rogue
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d8"), roll: 8 },
        { level: 2, die: new DiceString("d8"), roll: 1 },
        { level: 3, die: new DiceString("d8"), roll: 3 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [{ weapon: "Toy Sword", ability: "Dex", damage: new DiceString("d4") }];
  }

  // Sneak Attack damage at level 3
  getSneakAttackDamage(): DiceString {
    return new DiceString("2d6");
  }
}

const character = new ThimbleCharacter();
const characterName = "Thimble";

export function meta() {
  return [{ title: characterName }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Fairy", "MPMM")),
    classRef: renderHTML(getClass("Rogue")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function Thimble03Page() {
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
                  <span className="mono">17</span>
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
                  Combat
                </th>
              </tr>
              <tr>
                <td>Sneak Attack</td>
                <td className="modifier mono">{character.getSneakAttackDamage().toString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
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
                  <InfoTooltip reference={speciesRef}>Fairy</InfoTooltip> (Pixie)
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Rogue</InfoTooltip> 3 (Swashbuckler)
                </td>
              </tr>
              <tr>
                <td>[Fairy] Fairy Magic</td>
                <td className="modifier">Druidcraft cantrip</td>
              </tr>
              <tr>
                <td>[Fairy] Flight</td>
                <td className="modifier">fly speed = walk speed</td>
              </tr>
              <tr>
                <td>[Rogue] Expertise</td>
                <td className="modifier">2 skills doubled</td>
              </tr>
              <tr>
                <td>[Rogue] Sneak Attack</td>
                <td className="modifier">2d6 extra damage</td>
              </tr>
              <tr>
                <td>[Rogue] Thieves&apos; Cant</td>
                <td className="modifier">secret language</td>
              </tr>
              <tr>
                <td>[Swashbuckler] Fancy Footwork</td>
                <td className="modifier">no OA after melee attack</td>
              </tr>
              <tr>
                <td>[Swashbuckler] Rakish Audacity</td>
                <td className="modifier">+CHA to initiative</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Languages
                </th>
              </tr>
              <tr>
                <td colSpan={2}> Common, Sylvan, Thieves&apos; Cant </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
