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
import LevelledSpellDamageRow from "@/components/spells/LevelledSpellDamageRow";
import { Character } from "@/js/character/Character";
import type { Weapon } from "@/js/character/CharacterTypes";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class BolaireCharacter extends Character {
  constructor() {
    super({
      abilityScores: {
        Str: 12,
        Dex: 14,
        Con: 16,
        Int: 18,
        Wis: 14,
        Cha: 18,
      },
      classLevels: [{ className: "Warlock", level: 3 }],
      skillProficiencies: [],
      saveProficiencies: [
        { save: "Wis" }, // Warlock
        { save: "Cha" }, // Warlock
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d8"), roll: 8 },
        { level: 2, die: new DiceString("d8"), roll: 5 },
        { level: 3, die: new DiceString("d8"), roll: 4 },
      ],
    });
  }

  getWeapons(): Weapon[] {
    return [{ weapon: "Pact Blade", ability: "Cha", damage: new DiceString("d8") }];
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

const character = new BolaireCharacter();
const characterName = "Bolaire Lathalia";

export function meta() {
  return [{ title: characterName }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSubclass } = await import("@/js/utils/render-5etools/getSubclass");
  const { getClassFeature } = await import("@/js/utils/render-5etools/getClassFeature");
  const { getSubclassFeature } = await import("@/js/utils/render-5etools/getSubclassFeature");
  const { getOptionalFeature } = await import("@/js/utils/render-5etools/getOptionalFeature");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { getItem } = await import("@/js/utils/render-5etools/getItem");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    warlockRef: renderHTML(getClass("Warlock")),
    fiendRef: renderHTML(getSubclass("Warlock", "Fiend")),
    magicalCunningRef: renderHTML(getClassFeature("Magical Cunning", "Warlock")),
    darkOnesBlessingRef: renderHTML(getSubclassFeature("Dark One's Blessing", "Warlock", "Fiend")),
    pactOfTheBladeRef: renderHTML(getOptionalFeature("Pact of the Blade")),
    devilsSightRef: renderHTML(getOptionalFeature("Devil's Sight")),
    burningHandsRef: renderHTML(getSpell("Burning Hands")),
    scorchingRayRef: renderHTML(getSpell("Scorching Ray")),
    commandRef: renderHTML(getSpell("Command")),
    suggestionRef: renderHTML(getSpell("Suggestion")),
    alchemistsSuppliesRef: renderHTML(getItem("Alchemist's Supplies")),
  };
}

interface LoaderData {
  warlockRef: ReferenceRendered;
  fiendRef: ReferenceRendered;
  magicalCunningRef: ReferenceRendered;
  darkOnesBlessingRef: ReferenceRendered;
  pactOfTheBladeRef: ReferenceRendered;
  devilsSightRef: ReferenceRendered;
  burningHandsRef: ReferenceRendered;
  scorchingRayRef: ReferenceRendered;
  commandRef: ReferenceRendered;
  suggestionRef: ReferenceRendered;
  alchemistsSuppliesRef: ReferenceRendered;
}

export default function BolaireLevel03Page() {
  const {
    warlockRef,
    fiendRef,
    magicalCunningRef,
    darkOnesBlessingRef,
    pactOfTheBladeRef,
    devilsSightRef,
    burningHandsRef,
    scorchingRayRef,
    commandRef,
    suggestionRef,
    alchemistsSuppliesRef,
  } = useLoaderData<LoaderData>();

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
              <tr>
                <th>Fiend Spells</th>
                <th className="modifier">Damage</th>
              </tr>
              <LevelledSpellDamageRow
                name="Burning Hands"
                damageOptions={character.getDamageProgression({ level: 1, damage: new DiceString("3d6") }, new DiceString("d6"))}
                reference={burningHandsRef}
              />
              <LevelledSpellDamageRow
                name="Scorching Ray"
                damageOptions={character.getDamageProgression({ level: 2, damage: new DiceString("2d6") }, new DiceString("d6"))}
                reference={scorchingRayRef}
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
                <td className="modifier">Panto Mask (sentient mask)</td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={warlockRef}>Warlock</InfoTooltip> 3 (<InfoTooltip reference={fiendRef}>Fiend</InfoTooltip>)
                </td>
              </tr>
              <tr>
                <td>
                  [Warlock 2] <InfoTooltip reference={magicalCunningRef}>Magical Cunning</InfoTooltip>
                </td>
                <td className="modifier">recover spell slots</td>
              </tr>
              <tr>
                <td>
                  [Fiend 3] <InfoTooltip reference={darkOnesBlessingRef}>Dark One&apos;s Blessing</InfoTooltip>
                </td>
                <td className="modifier">
                  temp HP on kill: <span className="mono">{character.getDarkOnesBlessingTempHP()}</span>
                </td>
              </tr>
              <tr>
                <td>
                  [Invocation] <InfoTooltip reference={pactOfTheBladeRef}>Pact of the Blade</InfoTooltip>
                </td>
                <td className="modifier">summon weapon, use CHA</td>
              </tr>
              <tr>
                <td>
                  [Invocation] <InfoTooltip reference={devilsSightRef}>Devil&apos;s Sight</InfoTooltip>
                </td>
                <td className="modifier">darkvision 120ft (magical)</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Proficiencies
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  [Tool] <InfoTooltip reference={alchemistsSuppliesRef}>Alchemist&apos;s Supplies</InfoTooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
