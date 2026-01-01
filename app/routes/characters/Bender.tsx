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
import RollLink from "@/components/common/RollLink";
import HeroicInspirationCheckboxes from "@/components/species/human/HeroicInspirationCheckboxes";
import BenderCharacter from "@/js/characters/BenderCharacter";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

const character = new BenderCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getClassFeature } = await import("@/js/utils/render-5etools/getClassFeature");
  const { getFeat } = await import("@/js/utils/render-5etools/getFeat");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { getWeaponMastery } = await import("@/js/utils/render-5etools/getWeaponMastery");
  const { getVariantRule } = await import("@/js/utils/render-5etools/getVariantRule");
  const { getCondition } = await import("@/js/utils/render-5etools/getCondition");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Human")),
    classRef: renderHTML(getClass("Rogue")),
    alertRef: renderHTML(getFeat("Alert")),
    magicInitiateRef: renderHTML(getFeat("Magic Initiate")),
    sneakAttackRef: renderHTML(getClassFeature("Sneak Attack", "Rogue")),
    weaponMasteryRef: renderHTML(getClassFeature("Weapon Mastery", "Rogue")),
    vexRef: renderHTML(getWeaponMastery("Vex")),
    nickRef: renderHTML(getWeaponMastery("Nick")),
    trueStrikeRef: renderHTML(getSpell("True Strike")),
    tollTheDeadRef: renderHTML(getSpell("Toll the Dead")),
    mageArmorRef: renderHTML(getSpell("Mage Armor")),
    unarmedStrikeRef: renderHTML(getVariantRule("Unarmed Strike")),
    grappledRef: renderHTML(getCondition("Grappled")),
    proneRef: renderHTML(getCondition("Prone")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
  alertRef: ReferenceRendered;
  magicInitiateRef: ReferenceRendered;
  sneakAttackRef: ReferenceRendered;
  weaponMasteryRef: ReferenceRendered;
  vexRef: ReferenceRendered;
  nickRef: ReferenceRendered;
  trueStrikeRef: ReferenceRendered;
  tollTheDeadRef: ReferenceRendered;
  mageArmorRef: ReferenceRendered;
  unarmedStrikeRef: ReferenceRendered;
  grappledRef: ReferenceRendered;
  proneRef: ReferenceRendered;
}

export default function BenderPage() {
  const {
    speciesRef,
    classRef,
    alertRef,
    magicInitiateRef,
    sneakAttackRef,
    weaponMasteryRef,
    vexRef,
    nickRef,
    trueStrikeRef,
    tollTheDeadRef,
    mageArmorRef,
    unarmedStrikeRef,
    grappledRef,
    proneRef,
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
                  <span className="mono">{character.getArmorClass()}</span>
                  <span> (Mage Armor)</span>
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
                  <span> (Alert, can swap)</span>
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
          <WeaponAttackTable
            title="Offhand Attack"
            weaponAttacks={character.getOffhandWeaponAttacks()}
            damageAddons={character.getWeaponAttackAddons()}
          />
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Unarmed Strike
                </th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={unarmedStrikeRef}>Attack Modifier</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <D20TestCell roll={character.getUnarmedStrikeAttack()} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={unarmedStrikeRef}>Grapple/Shove DC</InfoTooltip>
                </td>
                <td className="checkCell mono">{character.getGrappleDC()}</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={grappledRef}>Grappled</InfoTooltip>
                </td>
                <td className="modifier">speed 0, DIS</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={proneRef}>Prone</InfoTooltip>
                </td>
                <td className="modifier">DIS/ADV</td>
              </tr>
            </tbody>
          </table>
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
                <th>Cantrips (at will)</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={trueStrikeRef}>True Strike</InfoTooltip>
                </td>
                <td className="modifier">attack w/CHA</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={tollTheDeadRef}>Toll the Dead</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={character.getCantripDamage(new DiceString("d8"), new DiceString("d8"))} />{" "}
                  <RollLink dice={character.getCantripDamage(new DiceString("d12"), new DiceString("d12"))} />
                </td>
              </tr>
              <tr>
                <th>1st Level (1/day)</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={mageArmorRef}>Mage Armor</InfoTooltip>
                </td>
                <td className="modifier">AC 13 + DEX (8h)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} infoHref="/characters/Bender-info" />
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
                  <InfoTooltip reference={classRef}>Rogue</InfoTooltip> {character.characterLevel}
                </td>
              </tr>
              <tr>
                <td>[Human] Resourceful (free Inspiration)</td>
                <td className="modifier">
                  <HeroicInspirationCheckboxes />
                </td>
              </tr>
              <tr>
                <td>
                  [Feat] <InfoTooltip reference={alertRef}>Alert</InfoTooltip> (from background)
                </td>
                <td className="modifier">+PB to Initiative, can swap</td>
              </tr>
              <tr>
                <td>
                  [Feat] <InfoTooltip reference={magicInitiateRef}>Magic Initiate</InfoTooltip> (from Human)
                </td>
                <td className="modifier">2 cantrips, 1 1st-level spell</td>
              </tr>
              <tr>
                <td>
                  [Rogue 1] <InfoTooltip reference={sneakAttackRef}>Sneak Attack</InfoTooltip>
                </td>
                <td className="modifier">+{character.getSneakAttackDice().toString()} damage (1/turn)</td>
              </tr>
              <tr>
                <td>
                  [Rogue 1] <InfoTooltip reference={weaponMasteryRef}>Weapon Mastery</InfoTooltip>
                </td>
                <td className="modifier">
                  <InfoTooltip reference={vexRef}>Vex</InfoTooltip>, <InfoTooltip reference={nickRef}>Nick</InfoTooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Languages &amp; Tools
                </th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <strong>Languages:</strong> Common, Deep Speech, Thieves&apos; Cant
                  <br />
                  <strong>Tools:</strong> Thieves&apos; Tools, Alchemist&apos;s Supplies
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
