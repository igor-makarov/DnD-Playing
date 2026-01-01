import { useLoaderData } from "react-router";

import AbilitiesTable from "@/components/AbilitiesTable";
import CharacterNameTable from "@/components/CharacterNameTable";
import HitDiceTable from "@/components/HitDiceTable";
import HitPointsInput from "@/components/HitPointsInput";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import SpellSlotsTable from "@/components/spells/SpellSlotsTable";
import AdrikCharacter from "@/js/characters/AdrikCharacter";
import { D20Test } from "@/js/common/D20Test";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

const character = new AdrikCharacter();

export function meta() {
  return [{ title: character.name }];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { getSpecies, getSubspecies } = await import("@/js/utils/render-5etools/getSpecies");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    speciesRef: renderHTML(getSpecies("Dwarf", "PHB")),
    subspeciesRef: renderHTML(getSubspecies("Hill", "Dwarf", "PHB")),
    rangerRef: renderHTML(getClass("Ranger", "PHB")),
    clericRef: renderHTML(getClass("Cleric", "PHB")),
  };
}

interface LoaderData {
  speciesRef: ReferenceRendered;
  subspeciesRef: ReferenceRendered;
  rangerRef: ReferenceRendered;
  clericRef: ReferenceRendered;
}

export default function AdrikPage() {
  const { speciesRef, subspeciesRef, rangerRef, clericRef } = useLoaderData<LoaderData>();

  // Computed skills for Favored Terrain (expertise on Forest)
  const favoredTerrainSkills = character
    .getSkillAbilityChecks()
    .filter((s) => (s.ability == "Int" || s.ability == "Wis") && s.check.getProficiency().bonus > 0)
    .map((skill) => {
      const modifier = character.getAbilityModifier(skill.ability);
      const proficiency = character.createProficiency(true, 2);
      return {
        ...skill,
        check: new D20Test("Ability Check", skill.ability, modifier, proficiency),
      };
    });

  // Computed skills for Stonecunning (expertise on stonework)
  const stonecunningSkills = character
    .getSkillAbilityChecks()
    .filter((s) => s.skill == "History")
    .map((skill) => {
      const modifier = character.getAbilityModifier(skill.ability);
      const proficiency = character.createProficiency(true, 2);
      return {
        ...skill,
        check: new D20Test("Ability Check", skill.ability, modifier, proficiency),
      };
    });

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
                  <span className="mono">17</span>
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
          <SkillsTable
            title={'Skills<br><a href="https://www.dungeonmastersvault.com/pages/dnd/5e/characters/17592319397230">character sheet</a>'}
            character={character}
          />
        </div>
        <div className="column">
          <SavesTable title="Saves" character={character} />
          <SavesTable
            title={
              '<a href="http://dnd5e.wikidot.com/lineage:dwarf#:~:text=Dwarven%20Resilience">Dwarven Resilience</a><br>ADV against poison<br>also half damage'
            }
            savingThrows={character.getSavingThrows().filter((s) => s.ability == "Con")}
            advantage={true}
            character={character}
          />
          <HitDiceTable hitDice={character.getHitDice()} conModifier={character.getAbilityModifier("Con")} />
        </div>
        <div className="column">
          <SkillsTable
            title={
              '<a href="http://dnd5e.wikidot.com/ranger#:~:text=at%2014th%20level.-,Natural%20Explorer,-Also%20at%201st">Favored Terrain</a><br>expertise on Forest'
            }
            skills={favoredTerrainSkills}
            character={character}
          />
          <SkillsTable
            title={
              '<a href="http://dnd5e.wikidot.com/ranger#:~:text=of%2020%20arrows-,Favored%20Enemy,-Beginning%20at%201st">Favored Enemy</a><br>ADV on orc, goblin'
            }
            skills={character.getSkillAbilityChecks().filter((s) => s.ability == "Int" || s.skill == "Survival")}
            advantage={true}
            character={character}
          />
          <SkillsTable
            title={'<a href="http://dnd5e.wikidot.com/lineage:dwarf#:~:text=Stonecunning">Stonecunning</a><br>expertise on stonework'}
            skills={stonecunningSkills}
            character={character}
          />
          <SkillsTable
            title={'<a href="https://www.dndbeyond.com/spells/hunters-mark">Hunter\'s Mark</a><br>ADV on marked creature'}
            skills={character.getSkillAbilityChecks().filter((s) => s.skill == "Perception" || s.skill == "Survival")}
            advantage={true}
            character={character}
          />
        </div>
        <div className="column features">
          <CharacterNameTable name={character.name} />
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
                  <InfoTooltip reference={speciesRef}>Dwarf</InfoTooltip> (<InfoTooltip reference={subspeciesRef}>Hill</InfoTooltip>)
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={rangerRef}>Ranger</InfoTooltip> 5 / <InfoTooltip reference={clericRef}>Cleric</InfoTooltip> 7
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
