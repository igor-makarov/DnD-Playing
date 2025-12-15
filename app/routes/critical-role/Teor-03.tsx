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

class TeorCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 15,
        Dex: 15,
        Con: 16,
        Int: 12,
        Wis: 14,
        Cha: 17,
      },
      classLevels: [{ className: "Paladin", level: 3 }],
      skillProficiencies: [{ skill: "Athletics" }, { skill: "Intimidation" }],
      saveProficiencies: [
        { save: "Wis" }, // Paladin
        { save: "Cha" }, // Paladin
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d10"), roll: 10 },
        { level: 2, die: new DiceString("d10"), roll: 8 },
        { level: 3, die: new DiceString("d10"), roll: 9 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [
      { weapon: "Flail", ability: "Str", damage: new DiceString("d8") },
      { weapon: "Claws", ability: "Str", damage: new DiceString("d6") },
    ];
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // Lay on Hands pool (5 HP per Paladin level)
  getLayOnHandsPool(): number {
    return this.getClassLevel("Paladin") * 5;
  }
}

const character = new TeorCharacter();
const characterName = "Teor Pridesire";

export function meta() {
  return [{ title: characterName }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Leonin", "MOT")),
    classRef: renderHTML(getClass("Paladin")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
}

export default function TeorPage() {
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
                  <span className="mono">18</span>
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
                  Nama (<InfoTooltip reference={speciesRef}>Leonin</InfoTooltip>)
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Paladin</InfoTooltip> 3 (Oath of Glory)
                </td>
              </tr>
              <tr>
                <td>[Nama] Darkvision</td>
                <td className="modifier">60 ft.</td>
              </tr>
              <tr>
                <td>[Nama] Claws</td>
                <td className="modifier">1d6 slashing unarmed</td>
              </tr>
              <tr>
                <td>[Nama] Hunter&apos;s Instinct</td>
                <td className="modifier">prof in skill</td>
              </tr>
              <tr>
                <td>[Nama] Daunting Roar</td>
                <td className="modifier">frighten nearby enemies</td>
              </tr>
              <tr>
                <td>[Feat] Savage Attacker</td>
                <td className="modifier">reroll weapon damage 1/turn</td>
              </tr>
              <tr>
                <td>[Paladin] Lay on Hands</td>
                <td className="modifier">
                  pool: <span className="mono">{character.getLayOnHandsPool()}</span> HP
                </td>
              </tr>
              <tr>
                <td>[Paladin] Weapon Mastery</td>
                <td className="modifier">2 weapons</td>
              </tr>
              <tr>
                <td>[Paladin] Fighting Style</td>
                <td className="modifier">—</td>
              </tr>
              <tr>
                <td>[Paladin] Divine Smite</td>
                <td className="modifier">2d8+ radiant on hit</td>
              </tr>
              <tr>
                <td>[Paladin] Channel Divinity</td>
                <td className="modifier">1/rest</td>
              </tr>
              <tr>
                <td>[Glory] Peerless Athlete</td>
                <td className="modifier">enhanced athletics</td>
              </tr>
              <tr>
                <td>[Glory] Inspiring Smite</td>
                <td className="modifier">temp HP to allies</td>
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
                <td colSpan={2}> Torn Banner (member), Loza Blade (commander) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
