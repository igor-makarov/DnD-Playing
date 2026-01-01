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
import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class JulienCharacter extends Character {
  constructor() {
    super({
      name: "Julien Davinos",
      abilityScores: {
        Str: 15,
        Dex: 18,
        Con: 18,
        Int: 11,
        Wis: 8,
        Cha: 16,
      },
      // Fighter 2 / Rogue 1
      classLevels: [
        { className: "Fighter", level: 2 },
        { className: "Rogue", level: 1 },
      ],
      skillProficiencies: [{ skill: "Athletics" }, { skill: "Intimidation" }, { skill: "Acrobatics" }],
      saveProficiencies: [
        { save: "Str" }, // Fighter
        { save: "Con" }, // Fighter
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d10"), roll: 10 },
        { level: 2, die: new DiceString("d10"), roll: 9 },
        { level: 3, die: new DiceString("d8"), roll: 8 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [
      { weapon: "Rapier", ability: "Dex", damage: new DiceString("d8") },
      { weapon: "Demi-Gauntlet", ability: "Dex", damage: new DiceString("d4") },
    ];
  }

  // Sneak Attack damage at level 1 Rogue
  getSneakAttackDamage(): DiceString {
    return new DiceString("1d6");
  }
}

const character = new JulienCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Human")),
    fighterRef: renderHTML(getClass("Fighter")),
    rogueRef: renderHTML(getClass("Rogue")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  fighterRef: ReferenceRendered;
  rogueRef: ReferenceRendered;
}

export default function JulienPage() {
  const { speciesRef, fighterRef, rogueRef } = useLoaderData<LoaderData>();

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
              <tr>
                <td>Second Wind</td>
                <td className="modifier mono">1d10+2 HP</td>
              </tr>
              <tr>
                <td>Action Surge</td>
                <td className="modifier">extra action (1/rest)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} />
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
                  <InfoTooltip reference={speciesRef}>Human</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={fighterRef}>Fighter</InfoTooltip> 2 / <InfoTooltip reference={rogueRef}>Rogue</InfoTooltip> 1
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
                <td>[Fighter] Fighting Style</td>
                <td className="modifier">Two-Weapon Fighting</td>
              </tr>
              <tr>
                <td>[Fighter] Second Wind</td>
                <td className="modifier">heal as BA (2/rest)</td>
              </tr>
              <tr>
                <td>[Fighter] Weapon Mastery</td>
                <td className="modifier">3 weapons</td>
              </tr>
              <tr>
                <td>[Fighter] Action Surge</td>
                <td className="modifier">extra action</td>
              </tr>
              <tr>
                <td>[Fighter] Tactical Mind</td>
                <td className="modifier">+d10 to ability check</td>
              </tr>
              <tr>
                <td>[Rogue] Expertise</td>
                <td className="modifier">2 skills doubled</td>
              </tr>
              <tr>
                <td>[Rogue] Sneak Attack</td>
                <td className="modifier">1d6 extra damage</td>
              </tr>
              <tr>
                <td>[Rogue] Thieves&apos; Cant</td>
                <td className="modifier">secret language</td>
              </tr>
              <tr>
                <td>[Rogue] Weapon Mastery</td>
                <td className="modifier">2 weapons</td>
              </tr>
              <tr>
                <td>Bloodied Advantage</td>
                <td className="modifier">adv. vs Primus when bloodied</td>
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
                <td colSpan={2}> House Davinos, House Royce (vassal) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
