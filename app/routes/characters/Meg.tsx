import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import CharacterNameTable from "@/components/CharacterNameTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import AttackDamageCell from "@/components/common/AttackDamageCell";
import D20TestCell from "@/components/common/D20TestCell";
import HeroicInspirationCheckboxes from "@/components/common/HeroicInspirationCheckboxes";
import InfoTooltip from "@/components/common/InfoTooltip";
import RollLink from "@/components/common/RollLink";
import TextBox from "@/components/common/TextBox";
import WarlockSpellSlotsTable from "@/components/spells/WarlockSpellSlotsTable";
import { $notes } from "@/js/character/dynamic-state/commonStores";
import MegCharacter from "@/js/characters/MegCharacter";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

const character = new MegCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getBackground } = await import("@/js/utils/render-5etools/getBackground");
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getClassFeature } = await import("@/js/utils/render-5etools/getClassFeature");
  const { getSubclass } = await import("@/js/utils/render-5etools/getSubclass");
  const { getSubclassFeature } = await import("@/js/utils/render-5etools/getSubclassFeature");
  const { getFeat } = await import("@/js/utils/render-5etools/getFeat");
  const { getOptionalFeature } = await import("@/js/utils/render-5etools/getOptionalFeature");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { getSpecies, getSpeciesFeature } = await import("@/js/utils/render-5etools/getSpecies");
  const { getVariantRule } = await import("@/js/utils/render-5etools/getVariantRule");
  const { getCharacterCreationOption, getCharacterCreationOptionFeature } = await import("@/js/utils/render-5etools/getCharacterCreationOption");
  const { getItem } = await import("@/js/utils/render-5etools/getItem");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Elf")),
    darkvisionRef: renderHTML(getSpeciesFeature("Darkvision", "Elf")),
    feyAncestryRef: renderHTML(getSpeciesFeature("Fey Ancestry", "Elf")),
    tranceRef: renderHTML(getSpeciesFeature("Trance", "Elf")),
    backgroundRef: renderHTML(getBackground("Wayfarer")),
    classRef: renderHTML(getClass("Warlock")),
    fiendRef: renderHTML(getSubclass("Warlock", "Fiend")),
    darkOnesBlessingRef: renderHTML(getSubclassFeature("Dark One's Blessing", "Warlock", "Fiend")),
    hollowOneRef: renderHTML(getCharacterCreationOption("Hollow One", "EGW")),
    agelessRef: renderHTML(getCharacterCreationOptionFeature("Ageless", "Hollow One", "EGW")),
    clingToLifeRef: renderHTML(getCharacterCreationOptionFeature("Cling to Life", "Hollow One", "EGW")),
    revenanceRef: renderHTML(getCharacterCreationOptionFeature("Revenance", "Hollow One", "EGW")),
    unsettlingPresenceRef: renderHTML(getCharacterCreationOptionFeature("Unsettling Presence", "Hollow One", "EGW")),
    heroicInspirationRef: renderHTML(getVariantRule("Heroic Inspiration")),
    alertRef: renderHTML(getFeat("Alert")),
    magicalCunningRef: renderHTML(getClassFeature("Magical Cunning", "Warlock")),
    pactOfTheTomeRef: renderHTML(getOptionalFeature("Pact of the Tome")),
    agonizingBlastRef: renderHTML(getOptionalFeature("Agonizing Blast")),
    fiendishVigorRef: renderHTML(getOptionalFeature("Fiendish Vigor")),
    eldritchBlastRef: renderHTML(getSpell("Eldritch Blast")),
    mindSliverRef: renderHTML(getSpell("Mind Sliver")),
    minorIllusionRef: renderHTML(getSpell("Minor Illusion")),
    spareTheDyingRef: renderHTML(getSpell("Spare the Dying")),
    sacredFlameRef: renderHTML(getSpell("Sacred Flame")),
    messageRef: renderHTML(getSpell("Message")),
    falseLifeRef: renderHTML(getSpell("False Life")),
    armorOfAgathysRef: renderHTML(getSpell("Armor of Agathys")),
    hellishRebukeRef: renderHTML(getSpell("Hellish Rebuke")),
    witchBoltRef: renderHTML(getSpell("Witch Bolt")),
    cloudOfDaggersRef: renderHTML(getSpell("Cloud of Daggers")),
    burningHandsRef: renderHTML(getSpell("Burning Hands")),
    commandRef: renderHTML(getSpell("Command")),
    scorchingRayRef: renderHTML(getSpell("Scorching Ray")),
    suggestionRef: renderHTML(getSpell("Suggestion")),
    detectMagicRef: renderHTML(getSpell("Detect Magic")),
    comprehendLanguagesRef: renderHTML(getSpell("Comprehend Languages")),
    unseenServantRef: renderHTML(getSpell("Unseen Servant")),
    thievesToolsRef: renderHTML(getItem("Thieves' Tools")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  darkvisionRef: ReferenceRendered;
  feyAncestryRef: ReferenceRendered;
  tranceRef: ReferenceRendered;
  backgroundRef: ReferenceRendered;
  classRef: ReferenceRendered;
  fiendRef: ReferenceRendered;
  darkOnesBlessingRef: ReferenceRendered;
  hollowOneRef: ReferenceRendered;
  agelessRef: ReferenceRendered;
  clingToLifeRef: ReferenceRendered;
  revenanceRef: ReferenceRendered;
  unsettlingPresenceRef: ReferenceRendered;
  heroicInspirationRef: ReferenceRendered;
  alertRef: ReferenceRendered;
  magicalCunningRef: ReferenceRendered;
  pactOfTheTomeRef: ReferenceRendered;
  agonizingBlastRef: ReferenceRendered;
  fiendishVigorRef: ReferenceRendered;
  eldritchBlastRef: ReferenceRendered;
  mindSliverRef: ReferenceRendered;
  minorIllusionRef: ReferenceRendered;
  spareTheDyingRef: ReferenceRendered;
  sacredFlameRef: ReferenceRendered;
  messageRef: ReferenceRendered;
  falseLifeRef: ReferenceRendered;
  armorOfAgathysRef: ReferenceRendered;
  hellishRebukeRef: ReferenceRendered;
  witchBoltRef: ReferenceRendered;
  cloudOfDaggersRef: ReferenceRendered;
  burningHandsRef: ReferenceRendered;
  commandRef: ReferenceRendered;
  scorchingRayRef: ReferenceRendered;
  suggestionRef: ReferenceRendered;
  detectMagicRef: ReferenceRendered;
  comprehendLanguagesRef: ReferenceRendered;
  unseenServantRef: ReferenceRendered;
  thievesToolsRef: ReferenceRendered;
}

export default function MegPage() {
  const {
    speciesRef,
    darkvisionRef,
    feyAncestryRef,
    tranceRef,
    backgroundRef,
    classRef,
    fiendRef,
    darkOnesBlessingRef,
    hollowOneRef,
    agelessRef,
    clingToLifeRef,
    revenanceRef,
    unsettlingPresenceRef,
    heroicInspirationRef,
    alertRef,
    magicalCunningRef,
    pactOfTheTomeRef,
    agonizingBlastRef,
    fiendishVigorRef,
    eldritchBlastRef,
    mindSliverRef,
    minorIllusionRef,
    spareTheDyingRef,
    sacredFlameRef,
    messageRef,
    falseLifeRef,
    armorOfAgathysRef,
    hellishRebukeRef,
    witchBoltRef,
    cloudOfDaggersRef,
    burningHandsRef,
    commandRef,
    scorchingRayRef,
    suggestionRef,
    detectMagicRef,
    comprehendLanguagesRef,
    unseenServantRef,
    thievesToolsRef,
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
          <TextBox title="Notes" store={$notes} placeholder="Notes" rows={20} data-testid="notes-text-box" />
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
                  <AttackDamageCell dice={character.getEldritchBlastDamage()} />
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
                <td className="modifier">120 ft</td>
              </tr>
              <tr>
                <th>At Will</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={falseLifeRef}>False Life</InfoTooltip>
                </td>
                <td className="modifier">{character.getFiendishVigorTempHP()} THP</td>
              </tr>
              <tr>
                <th>Prepared Spells</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={scorchingRayRef}>Scorching Ray ({character.getScorchingRayCount()}x)</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <AttackDamageCell dice={new DiceString("2d6")} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={witchBoltRef}>Witch Bolt</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <AttackDamageCell dice={new DiceString("3d12")} />
                  <br />
                  {"BA "}
                  <RollLink dice={new DiceString("1d12")} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={cloudOfDaggersRef}>Cloud of Daggers</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={new DiceString("4d4")} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={burningHandsRef}>Burning Hands</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={new DiceString("4d6")} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={hellishRebukeRef}>Hellish Rebuke</InfoTooltip>
                </td>
                <td className="checkCell mono">
                  <RollLink dice={new DiceString("3d10")} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={armorOfAgathysRef}>Armor of Agathys</InfoTooltip>
                </td>
                <td className="modifier">10 THP/dmg</td>
              </tr>
              <tr>
                <th>Utility</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={detectMagicRef}>Detect Magic</InfoTooltip>
                </td>
                <td className="modifier">1/LR; no slot</td>
              </tr>
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
              <tr>
                <td>
                  <InfoTooltip reference={comprehendLanguagesRef}>Comprehend Languages</InfoTooltip>
                </td>
                <td className="modifier">ritual</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={unseenServantRef}>Unseen Servant</InfoTooltip>
                </td>
                <td className="modifier">ritual</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} infoHref="/characters/Meg-info" />
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
                <td>
                  <InfoTooltip reference={heroicInspirationRef}>Heroic Inspiration</InfoTooltip>
                </td>
                <td className="modifier">
                  <HeroicInspirationCheckboxes />
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={classRef}>Warlock</InfoTooltip> {character.characterLevel}
                </td>
              </tr>
              <tr>
                <td>Subclass</td>
                <td className="modifier">
                  <InfoTooltip reference={fiendRef}>Fiend Patron</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>
                  [Feat] <InfoTooltip reference={alertRef}>Alert</InfoTooltip>
                </td>
                <td className="modifier">+PB to Initiative</td>
              </tr>
              <tr>
                <td>
                  [Warlock 2] <InfoTooltip reference={magicalCunningRef}>Magical Cunning</InfoTooltip>
                </td>
                <td className="modifier">recover 1 slot/LR</td>
              </tr>
              <tr>
                <td>
                  [Fiend 3] <InfoTooltip reference={darkOnesBlessingRef}>Dark One&apos;s Blessing</InfoTooltip>
                </td>
                <td className="modifier">{character.getDarkOnesBlessingTempHP()} THP on kill (10 ft)</td>
              </tr>
              <tr>
                <td>
                  [High Elf] <InfoTooltip reference={detectMagicRef}>Detect Magic</InfoTooltip>
                </td>
                <td className="modifier">1/LR; no slot</td>
              </tr>
              <tr>
                <td>
                  [High Elf] <InfoTooltip reference={darkvisionRef}>Darkvision</InfoTooltip>
                </td>
                <td className="modifier">60 ft</td>
              </tr>
              <tr>
                <td>
                  [High Elf] <InfoTooltip reference={feyAncestryRef}>Fey Ancestry</InfoTooltip>
                </td>
                <td className="modifier">ADV vs Charmed</td>
              </tr>
              <tr>
                <td>
                  [High Elf] <InfoTooltip reference={tranceRef}>Trance</InfoTooltip>
                </td>
                <td className="modifier">4h Long Rest</td>
              </tr>
              <tr>
                <td>
                  [Hollow One] <InfoTooltip reference={agelessRef}>Ageless</InfoTooltip>
                </td>
                <td className="modifier"></td>
              </tr>
              <tr>
                <td>
                  [Hollow One] <InfoTooltip reference={clingToLifeRef}>Cling to Life</InfoTooltip>
                </td>
                <td className="modifier">1 HP @ 16+ DS</td>
              </tr>
              <tr>
                <td>
                  [Hollow One] <InfoTooltip reference={revenanceRef}>Revenance</InfoTooltip>
                </td>
                <td className="modifier">detect as undead</td>
              </tr>
              <tr>
                <td>
                  [Hollow One] <InfoTooltip reference={unsettlingPresenceRef}>Unsettling Presence</InfoTooltip>
                </td>
                <td className="modifier">1/day, DIS next save</td>
              </tr>
              <tr>
                <td>[Thieves&apos; Tools] Pick Lock (DC 15)</td>
                <td className="checkCell">
                  <D20TestCell roll={new D20Test("Ability Check", "Dex", character.getAbilityModifier("Dex"), character.createProficiency(true))} />
                </td>
              </tr>
              <tr>
                <td>[Thieves&apos; Tools] Disarm Trap (DC 15)</td>
                <td className="checkCell">
                  <D20TestCell roll={new D20Test("Ability Check", "Dex", character.getAbilityModifier("Dex"), character.createProficiency(true))} />
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
                  <strong>Languages:</strong> Common, Elvish
                  <br />
                  <strong>Tools:</strong> <InfoTooltip reference={thievesToolsRef}>Thieves&apos; Tools</InfoTooltip> (Dex)
                  <br />
                  <strong>Invocations (3):</strong> <InfoTooltip reference={pactOfTheTomeRef}>Pact of the Tome</InfoTooltip>,{" "}
                  <InfoTooltip reference={agonizingBlastRef}>Agonizing Blast</InfoTooltip>,{" "}
                  <InfoTooltip reference={fiendishVigorRef}>Fiendish Vigor</InfoTooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
