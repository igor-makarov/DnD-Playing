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

class KattiganCharacter extends Character {
  constructor() {
    super({
      name: "Kattigan Vale",
      abilityScores: {
        Str: 18,
        Dex: 18,
        Con: 16,
        Int: 13,
        Wis: 15,
        Cha: 15,
      },
      classLevels: [{ className: "Ranger", level: 3 }],
      skillProficiencies: [{ skill: "Survival" }, { skill: "Perception" }, { skill: "Stealth" }],
      saveProficiencies: [
        { save: "Str" }, // Ranger
        { save: "Dex" }, // Ranger
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d10"), roll: 10 },
        { level: 2, die: new DiceString("d10"), roll: 6 },
        { level: 3, die: new DiceString("d10"), roll: 6 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [
      { weapon: "Atlatl Club", ability: "Str", damage: new DiceString("d6") },
      { weapon: "Longbow", ability: "Dex", damage: new DiceString("d8") },
    ];
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

const character = new KattiganCharacter();

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
    classRef: renderHTML(getClass("Ranger")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function KattiganPage() {
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
                  <InfoTooltip reference={speciesRef}>Human</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Ranger</InfoTooltip> 3 (Beast Master)
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
                <td>[Feat] Savage Attacker</td>
                <td className="modifier">reroll weapon damage 1/turn</td>
              </tr>
              <tr>
                <td>[Feat] Magic Initiate (Druid)</td>
                <td className="modifier">druid cantrips & spell</td>
              </tr>
              <tr>
                <td>[Ranger] Favored Enemy</td>
                <td className="modifier">Hunter&apos;s Mark free cast</td>
              </tr>
              <tr>
                <td>[Ranger] Weapon Mastery</td>
                <td className="modifier">2 weapons</td>
              </tr>
              <tr>
                <td>[Ranger] Fighting Style</td>
                <td className="modifier">—</td>
              </tr>
              <tr>
                <td>[Ranger] Deft Explorer</td>
                <td className="modifier">Expertise, Thieves&apos; Cant</td>
              </tr>
              <tr>
                <td>[Beast Master] Primal Companion</td>
                <td className="modifier">Wulferic (beast companion)</td>
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
                <td colSpan={2}> Common, Thieves&apos; Cant </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
