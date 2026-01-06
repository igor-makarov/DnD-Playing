import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import CharacterNameTable from "@/components/CharacterNameTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import RollLink from "@/components/common/RollLink";
import LuckPointsCheckboxes from "@/components/feats/LuckPointsCheckboxes";
import WarlockSpellSlotsTable from "@/components/spells/WarlockSpellSlotsTable";
import AlondraCharacter from "@/js/characters/AlondraCharacter";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

const character = new AlondraCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getBackground } = await import("@/js/utils/render-5etools/getBackground");
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getFeat } = await import("@/js/utils/render-5etools/getFeat");
  const { getOptionalFeature } = await import("@/js/utils/render-5etools/getOptionalFeature");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { getCharacterCreationOption } = await import("@/js/utils/render-5etools/getCharacterCreationOption");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Elf")),
    backgroundRef: renderHTML(getBackground("Wayfarer")),
    classRef: renderHTML(getClass("Warlock")),
    hollowOneRef: renderHTML(getCharacterCreationOption("Hollow One")),
    luckyRef: renderHTML(getFeat("Lucky")),
    pactOfTheTomeRef: renderHTML(getOptionalFeature("Pact of the Tome")),
    eldritchBlastRef: renderHTML(getSpell("Eldritch Blast")),
    mindSliverRef: renderHTML(getSpell("Mind Sliver")),
    minorIllusionRef: renderHTML(getSpell("Minor Illusion")),
    spareTheDyingRef: renderHTML(getSpell("Spare the Dying")),
    sacredFlameRef: renderHTML(getSpell("Sacred Flame")),
    messageRef: renderHTML(getSpell("Message")),
    armorOfAgathysRef: renderHTML(getSpell("Armor of Agathys")),
    hellishRebukeRef: renderHTML(getSpell("Hellish Rebuke")),
    comprehendLanguagesRef: renderHTML(getSpell("Comprehend Languages")),
    unseenServantRef: renderHTML(getSpell("Unseen Servant")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  backgroundRef: ReferenceRendered;
  classRef: ReferenceRendered;
  hollowOneRef: ReferenceRendered;
  luckyRef: ReferenceRendered;
  pactOfTheTomeRef: ReferenceRendered;
  eldritchBlastRef: ReferenceRendered;
  mindSliverRef: ReferenceRendered;
  minorIllusionRef: ReferenceRendered;
  spareTheDyingRef: ReferenceRendered;
  sacredFlameRef: ReferenceRendered;
  messageRef: ReferenceRendered;
  armorOfAgathysRef: ReferenceRendered;
  hellishRebukeRef: ReferenceRendered;
  comprehendLanguagesRef: ReferenceRendered;
  unseenServantRef: ReferenceRendered;
}

export default function AlondraPage() {
  const {
    speciesRef,
    backgroundRef,
    classRef,
    hollowOneRef,
    luckyRef,
    pactOfTheTomeRef,
    eldritchBlastRef,
    mindSliverRef,
    minorIllusionRef,
    spareTheDyingRef,
    sacredFlameRef,
    messageRef,
    armorOfAgathysRef,
    hellishRebukeRef,
    comprehendLanguagesRef,
    unseenServantRef,
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
                  <span> (Leather)</span>
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
                  <InfoTooltip reference={eldritchBlastRef}>Eldritch Blast</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={character.getCantripDamage(new DiceString("d10"), new DiceString("d10"))} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={mindSliverRef}>Mind Sliver</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={character.getCantripDamage(new DiceString("d6"), new DiceString("d6"))} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={sacredFlameRef}>Sacred Flame</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={character.getCantripDamage(new DiceString("d8"), new DiceString("d8"))} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={minorIllusionRef}>Minor Illusion</InfoTooltip>
                </td>
                <td className="modifier">illusion</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={spareTheDyingRef}>Spare the Dying</InfoTooltip>
                </td>
                <td className="modifier">stabilize</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={messageRef}>Message</InfoTooltip>
                </td>
                <td className="modifier">whisper 120 ft</td>
              </tr>
              <tr>
                <th>Prepared Spells</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={armorOfAgathysRef}>Armor of Agathys</InfoTooltip>
                </td>
                <td className="modifier">5 THP, 5 dmg on hit</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={hellishRebukeRef}>Hellish Rebuke</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={new DiceString("2d10")} />
                </td>
              </tr>
              <tr>
                <th>Rituals</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={comprehendLanguagesRef}>Comprehend Languages</InfoTooltip>
                </td>
                <td className="modifier"></td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={unseenServantRef}>Unseen Servant</InfoTooltip>
                </td>
                <td className="modifier"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} infoHref="/characters/Alondra-info" />
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
                  <InfoTooltip reference={speciesRef}>High Elf</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Background</td>
                <td className="modifier">
                  <InfoTooltip reference={backgroundRef}>Wayfarer</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Supernatural Gift</td>
                <td className="modifier">
                  <InfoTooltip reference={hollowOneRef}>Hollow One</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Warlock</InfoTooltip> {character.characterLevel}
                </td>
              </tr>
              <tr>
                <td>
                  [Feat] <InfoTooltip reference={luckyRef}>Lucky</InfoTooltip>
                </td>
                <td className="modifier">
                  <LuckPointsCheckboxes maxLuckPoints={character.getLuckPoints()} />
                </td>
              </tr>
              <tr>
                <td>
                  [Invocation] <InfoTooltip reference={pactOfTheTomeRef}>Pact of the Tome</InfoTooltip>
                </td>
                <td className="modifier">+3 cantrips, rituals</td>
              </tr>
              <tr>
                <td>[High Elf] Darkvision</td>
                <td className="modifier">60 ft</td>
              </tr>
              <tr>
                <td>[High Elf] Fey Ancestry</td>
                <td className="modifier">ADV vs Charmed</td>
              </tr>
              <tr>
                <td>[High Elf] Trance</td>
                <td className="modifier">4h Long Rest</td>
              </tr>
              <tr>
                <td>[High Elf] Elven Lineage</td>
                <td className="modifier"></td>
              </tr>
              <tr>
                <td>[Hollow One] Ageless</td>
                <td className="modifier"></td>
              </tr>
              <tr>
                <td>[Hollow One] Cling to Life</td>
                <td className="modifier">death save 16+ = 1 HP</td>
              </tr>
              <tr>
                <td>[Hollow One] Revenance</td>
                <td className="modifier">detect as undead</td>
              </tr>
              <tr>
                <td>[Hollow One] Unsettling Presence</td>
                <td className="modifier">1/day, DIS next save</td>
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
                  <strong>Languages:</strong> Common, Elvish
                  <br />
                  <strong>Tools:</strong> Thieves&apos; Tools
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
