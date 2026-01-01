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
import LevelledSpellDamageRow from "@/components/spells/LevelledSpellDamageRow";
import WarlockSpellSlotsTable from "@/components/spells/WarlockSpellSlotsTable";
import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class TyrannyCharacter extends Character {
  constructor() {
    super({
      name: "Tyranny",
      abilityScores: {
        Str: 12,
        Dex: 15,
        Con: 18,
        Int: 12,
        Wis: 8,
        Cha: 20,
      },
      classLevels: [{ className: "Warlock", level: 3 }],
      skillProficiencies: [{ skill: "Deception" }, { skill: "Persuasion" }],
      saveProficiencies: [
        { save: "Wis" }, // Warlock
        { save: "Cha" }, // Warlock
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d8"), roll: 8 },
        { level: 2, die: new DiceString("d8"), roll: 5 },
        { level: 3, die: new DiceString("d8"), roll: 5 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [];
  }

  // Spell Attack Modifier: Charisma modifier + Proficiency bonus
  getSpellAttack(): D20Test {
    return new D20Test("Attack Roll", "Cha", this.getAbilityModifier("Cha"), this.createProficiency(true));
  }

  // Spell Save DC: 8 + Proficiency bonus + Charisma modifier
  getSpellSaveDC(): number {
    return 8 + this.getSpellAttack().getBonus();
  }

  // Dark One's Blessing: Gain temporary HP when reducing hostile creature to 0 HP
  getDarkOnesBlessingTempHP(): number {
    return this.getAbilityModifier("Cha") + this.getClassLevel("Warlock");
  }
}

const character = new TyrannyCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Tiefling")),
    classRef: renderHTML(getClass("Warlock")),
    commandRef: renderHTML(getSpell("Command")),
    suggestionRef: renderHTML(getSpell("Suggestion")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
  commandRef: ReferenceRendered;
  suggestionRef: ReferenceRendered;
}

export default function Tyranny03Page() {
  const { speciesRef, classRef, commandRef, suggestionRef } = useLoaderData<LoaderData>();

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
                  <span className="mono">15</span>
                  <span style={{ fontSize: "0.8em" }}> (12 w/o Mage Armor)</span>
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
              <tr>
                <th>Fiend Spells</th>
                <th className="modifier">Damage</th>
              </tr>
              <LevelledSpellDamageRow
                name="Burning Hands"
                damageOptions={character.getDamageProgression({ level: 1, damage: new DiceString("3d6") }, new DiceString("d6"))}
              />
              <LevelledSpellDamageRow
                name="Scorching Ray"
                damageOptions={character.getDamageProgression({ level: 2, damage: new DiceString("2d6") }, new DiceString("d6"))}
              />
              <tr>
                <td>
                  <InfoTooltip reference={commandRef}>Command</InfoTooltip>
                </td>
                <td className="modifier">WIS save</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={suggestionRef}>Suggestion</InfoTooltip>
                </td>
                <td className="modifier">WIS save</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} />
          <WarlockSpellSlotsTable warlockSpellSlots={character.getWarlockSpellSlots()} />
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
                  Demon (<InfoTooltip reference={speciesRef}>Tiefling</InfoTooltip>/Fiend)
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Warlock</InfoTooltip> 3 (Fiend)
                </td>
              </tr>
              <tr>
                <td>[Demon] Darkvision</td>
                <td className="modifier">60 ft.</td>
              </tr>
              <tr>
                <td>[Demon] Fiendish Legacy</td>
                <td className="modifier">Abyssal (poison resist)</td>
              </tr>
              <tr>
                <td>[Demon] Otherworldly Presence</td>
                <td className="modifier">Thaumaturgy cantrip</td>
              </tr>
              <tr>
                <td>[Warlock] Magical Cunning</td>
                <td className="modifier">recover spell slots</td>
              </tr>
              <tr>
                <td>[Invocation] Armor of Shadows</td>
                <td className="modifier">Mage Armor at will</td>
              </tr>
              <tr>
                <td>[Invocation] Pact of the Blade</td>
                <td className="modifier">demon claws</td>
              </tr>
              <tr>
                <td>[Invocation] Mask of Many Faces</td>
                <td className="modifier">Disguise Self at will</td>
              </tr>
              <tr>
                <td>[Fiend] Dark One&apos;s Blessing</td>
                <td className="modifier">
                  temp HP on kill: <span className="mono">{character.getDarkOnesBlessingTempHP()}</span>
                </td>
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
                <td colSpan={2}> Common, Demonic </td>
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
                <td colSpan={2}> Candescent Creed (Aspirant), Wicander Halovar (ward) </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
