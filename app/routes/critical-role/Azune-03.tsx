import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import SpellSlotsTable from "@/components/spells/SpellSlotsTable";
import { Character } from "@/js/character/Character";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

class AzuneCharacter extends Character {
  constructor() {
    super({
      name: "Azune Nayar",
      abilityScores: {
        Str: 18,
        Dex: 14,
        Con: 16,
        Int: 12,
        Wis: 14,
        Cha: 18,
      },
      // Paladin 2 / Sorcerer 1 at level 3
      classLevels: [
        { className: "Paladin", level: 2 },
        { className: "Sorcerer", level: 1 },
      ],
      skillProficiencies: [],
      saveProficiencies: [
        { save: "Wis" }, // Paladin
        { save: "Cha" }, // Paladin
      ],
      hitPointRolls: [
        { level: 1, die: new DiceString("d10"), roll: 10 },
        { level: 2, die: new DiceString("d10"), roll: 6 },
        { level: 3, die: new DiceString("d6"), roll: 5 },
      ],
    });
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

const character = new AzuneCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { getSpell } = await import("@/js/utils/render-5etools/getSpell");
  const { getFeat } = await import("@/js/utils/render-5etools/getFeat");
  const { getClassFeature } = await import("@/js/utils/render-5etools/getClassFeature");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Human")),
    paladinClassRef: renderHTML(getClass("Paladin")),
    sorcererClassRef: renderHTML(getClass("Sorcerer")),
    guidanceSpellRef: renderHTML(getSpell("Guidance")),
    mendingSpellRef: renderHTML(getSpell("Mending")),
    messageSpellRef: renderHTML(getSpell("Message")),
    detectMagicSpellRef: renderHTML(getSpell("Detect Magic")),
    falseLifeSpellRef: renderHTML(getSpell("False Life")),
    luckyFeatRef: renderHTML(getFeat("Lucky")),
    layOnHandsFeatureRef: renderHTML(getClassFeature("Lay on Hands", "Paladin")),
    fightingStyleFeatureRef: renderHTML(getClassFeature("Fighting Style", "Paladin")),
    innateSorceryFeatureRef: renderHTML(getClassFeature("Innate Sorcery", "Sorcerer")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  paladinClassRef: ReferenceRendered;
  sorcererClassRef: ReferenceRendered;
  guidanceSpellRef: ReferenceRendered;
  mendingSpellRef: ReferenceRendered;
  messageSpellRef: ReferenceRendered;
  detectMagicSpellRef: ReferenceRendered;
  falseLifeSpellRef: ReferenceRendered;
  luckyFeatRef: ReferenceRendered;
  layOnHandsFeatureRef: ReferenceRendered;
  fightingStyleFeatureRef: ReferenceRendered;
  innateSorceryFeatureRef: ReferenceRendered;
}

export default function AzuneNayarPage() {
  const {
    speciesRef,
    paladinClassRef,
    sorcererClassRef,
    guidanceSpellRef,
    mendingSpellRef,
    messageSpellRef,
    detectMagicSpellRef,
    falseLifeSpellRef,
    luckyFeatRef,
    layOnHandsFeatureRef,
    fightingStyleFeatureRef,
    innateSorceryFeatureRef,
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
                  <span className="mono">20</span>
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
                <th>Cantrips</th>
                <th className="modifier">Source</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={guidanceSpellRef}>Guidance</InfoTooltip>
                </td>
                <td className="modifier">Paladin/Sorcerer</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={mendingSpellRef}>Mending</InfoTooltip>
                </td>
                <td className="modifier">Sorcerer</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={messageSpellRef}>Message</InfoTooltip>
                </td>
                <td className="modifier">Sorcerer</td>
              </tr>
              <tr>
                <th>1st Level Spells</th>
                <th className="modifier">Effect</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={detectMagicSpellRef}>Detect Magic</InfoTooltip>
                </td>
                <td className="modifier">ritual, sense magic</td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={falseLifeSpellRef}>False Life</InfoTooltip>
                </td>
                <td className="modifier">temp HP</td>
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
                  <InfoTooltip reference={paladinClassRef}>Paladin</InfoTooltip> 2 / <InfoTooltip reference={sorcererClassRef}>Sorcerer</InfoTooltip>{" "}
                  1
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
                <td>
                  [Feat] <InfoTooltip reference={luckyFeatRef}>Lucky</InfoTooltip>
                </td>
                <td className="modifier">reroll d20s</td>
              </tr>
              <tr>
                <td>
                  [Paladin 1] <InfoTooltip reference={layOnHandsFeatureRef}>Lay on Hands</InfoTooltip>
                </td>
                <td className="modifier">
                  pool: <span className="mono">{character.getLayOnHandsPool()}</span> HP
                </td>
              </tr>
              <tr>
                <td>
                  [Paladin 2] <InfoTooltip reference={fightingStyleFeatureRef}>Fighting Style</InfoTooltip>
                </td>
                <td className="modifier">Defense (+1 AC)</td>
              </tr>
              <tr>
                <td>
                  [Sorcerer 1] <InfoTooltip reference={innateSorceryFeatureRef}>Innate Sorcery</InfoTooltip>
                </td>
                <td className="modifier">bonus action, adv on spell attacks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
