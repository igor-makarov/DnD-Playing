import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import CharacterNameTable from "@/components/CharacterNameTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import WeaponAttackTable from "@/components/WeaponAttackTable/WeaponAttackTable";
import TinkersMagicCheckboxes from "@/components/classes/artificer/TinkersMagicCheckboxes";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import RollLink from "@/components/common/RollLink";
import TextBox from "@/components/common/TextBox";
import LuckPointsCheckboxes from "@/components/feats/LuckPointsCheckboxes";
import HeroicInspirationCheckboxes from "@/components/species/human/HeroicInspirationCheckboxes";
import SpellSlotsTable from "@/components/spells/SpellSlotsTable";
import { $notes } from "@/js/character/dynamic-state/stores";
import MiloCharacter from "@/js/characters/MiloCharacter";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

const character = new MiloCharacter();

export function meta() {
  return [{ title: character.name }];
}

export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getClassFeature } = await import("@/js/utils/render-5etools/getClassFeature");
  const { getFeat } = await import("@/js/utils/render-5etools/getFeat");
  const { getItem } = await import("@/js/utils/render-5etools/getItem");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { getVariantRule } = await import("@/js/utils/render-5etools/getVariantRule");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Human")),
    classRef: renderHTML(getClass("Artificer", "EFA")),
    heroicInspirationRef: renderHTML(getVariantRule("Heroic Inspiration")),
    crafterRef: renderHTML(getFeat("Crafter")),
    luckyRef: renderHTML(getFeat("Lucky")),
    spellcastingRef: renderHTML(getClassFeature("Spellcasting", "Artificer", "EFA")),
    tinkersMagicRef: renderHTML(getClassFeature("Tinker's Magic", "Artificer", "EFA")),
    mendingRef: renderHTML(getSpell("Mending")),
    fireBoltRef: renderHTML(getSpell("Fire Bolt")),
    shockingGraspRef: renderHTML(getSpell("Shocking Grasp")),
    cureWoundsRef: renderHTML(getSpell("Cure Wounds")),
    shieldRef: renderHTML(getSpell("Shield")),
    thievesToolsRef: renderHTML(getItem("Thieves' Tools")),
    tinkersToolsRef: renderHTML(getItem("Tinker's Tools")),
    jewelersToolsRef: renderHTML(getItem("Jeweler's Tools")),
    smithsToolsRef: renderHTML(getItem("Smith's Tools")),
    masonsToolsRef: renderHTML(getItem("Mason's Tools")),
    herbalismKitRef: renderHTML(getItem("Herbalism Kit")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  classRef: ReferenceRendered;
  heroicInspirationRef: ReferenceRendered;
  crafterRef: ReferenceRendered;
  luckyRef: ReferenceRendered;
  spellcastingRef: ReferenceRendered;
  tinkersMagicRef: ReferenceRendered;
  mendingRef: ReferenceRendered;
  fireBoltRef: ReferenceRendered;
  shockingGraspRef: ReferenceRendered;
  cureWoundsRef: ReferenceRendered;
  shieldRef: ReferenceRendered;
  thievesToolsRef: ReferenceRendered;
  tinkersToolsRef: ReferenceRendered;
  jewelersToolsRef: ReferenceRendered;
  smithsToolsRef: ReferenceRendered;
  masonsToolsRef: ReferenceRendered;
  herbalismKitRef: ReferenceRendered;
}

export default function MiloPage() {
  const {
    speciesRef,
    classRef,
    heroicInspirationRef,
    crafterRef,
    luckyRef,
    spellcastingRef,
    tinkersMagicRef,
    mendingRef,
    fireBoltRef,
    shockingGraspRef,
    cureWoundsRef,
    shieldRef,
    thievesToolsRef,
    tinkersToolsRef,
    jewelersToolsRef,
    smithsToolsRef,
    masonsToolsRef,
    herbalismKitRef,
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
                  <span> (Studded Leather)</span>
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
          <TextBox title="Notes" store={$notes} placeholder="Notes" rows={20} data-testid="notes-text-box" />
        </div>
        <div className="column">
          <WeaponAttackTable title="Weapon Attacks" weaponAttacks={character.getWeaponAttacks()} damageAddons={character.getWeaponAttackAddons()} />
          <SpellSlotsTable spellSlots={character.getSpellSlots()} />
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
                <th>Cantrips</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={mendingRef}>Mending</InfoTooltip>
                </td>
                <td className="modifier"></td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={fireBoltRef}>Fire Bolt</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={character.getCantripDamage(new DiceString("d10"), new DiceString("d10"))} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={shockingGraspRef}>Shocking Grasp</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={character.getCantripDamage(new DiceString("d8"), new DiceString("d8"))} />
                </td>
              </tr>
              <tr>
                <th>Prepared Spells</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={cureWoundsRef}>Cure Wounds</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={new DiceString("2d8", character.getAbilityModifier("Int"))} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={shieldRef}>Shield</InfoTooltip>
                </td>
                <td className="modifier">+5 AC</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} infoHref="/characters/Milo-info" />
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
                  <InfoTooltip reference={classRef}>Artificer</InfoTooltip> {character.characterLevel}
                </td>
              </tr>
              <tr>
                <td>
                  [Human] Resourceful (free <InfoTooltip reference={heroicInspirationRef}>Inspiration</InfoTooltip>)
                </td>
                <td className="modifier">
                  <HeroicInspirationCheckboxes />
                </td>
              </tr>
              <tr>
                <td>
                  [Feat] <InfoTooltip reference={crafterRef}>Crafter</InfoTooltip> (from Human)
                </td>
                <td className="modifier">smith, tinker, mason; 20% discount</td>
              </tr>
              <tr>
                <td>
                  [Feat] <InfoTooltip reference={luckyRef}>Lucky</InfoTooltip> (from background)
                </td>
                <td className="modifier">
                  <LuckPointsCheckboxes maxLuckPoints={character.getLuckPoints()} />
                </td>
              </tr>
              <tr>
                <td>
                  [Artificer 1] <InfoTooltip reference={tinkersMagicRef}>Tinker&apos;s Magic</InfoTooltip>
                </td>
                <td className="modifier">
                  <TinkersMagicCheckboxes maxUses={character.getTinkersMagicUses()} />
                </td>
              </tr>
              <tr>
                <td>
                  [Artificer 1] <InfoTooltip reference={spellcastingRef}>Spellcasting</InfoTooltip>
                </td>
                <td className="modifier">{character.getPreparedSpellsCount()} spells prepared</td>
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
                  <strong>Languages:</strong> Common, 1 extra language (TBD)
                  <br />
                  <strong>Tools:</strong> <InfoTooltip reference={thievesToolsRef}>Thieves&apos; Tools</InfoTooltip>,{" "}
                  <InfoTooltip reference={tinkersToolsRef}>Tinker&apos;s Tools</InfoTooltip>,{" "}
                  <InfoTooltip reference={jewelersToolsRef}>Jeweler&apos;s Tools</InfoTooltip>,{" "}
                  <InfoTooltip reference={smithsToolsRef}>Smith&apos;s Tools</InfoTooltip>,{" "}
                  <InfoTooltip reference={masonsToolsRef}>Mason&apos;s Tools</InfoTooltip>,{" "}
                  <InfoTooltip reference={herbalismKitRef}>Herbalism Kit</InfoTooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
