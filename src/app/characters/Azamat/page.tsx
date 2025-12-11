import type { Metadata } from "next";

import AbilitiesTable from "@/components/AbilitiesTable";
import HitDiceTable from "@/components/HitDiceTable.server";
import HitPointsInput from "@/components/HitPointsInput.server";
import SavesTable from "@/components/SavesTable";
import SkillsTable from "@/components/SkillsTable";
import SpellSlotsTables from "@/components/SpellSlotsTables";
import WeaponAttackTable from "@/components/WeaponAttackTable/WeaponAttackTable.server";
import ChannelDivinityCheckboxes from "@/components/classes/paladin/ChannelDivinityCheckboxes";
import LayOnHandsInput from "@/components/classes/paladin/LayOnHandsInput";
import D20TestCell from "@/components/common/D20TestCell.server";
import InfoTooltip from "@/components/common/InfoTooltip";
import LevelledSpellDamageRow from "@/components/spells/LevelledSpellDamageRow";
import AzamatCharacter from "@/js/characters/AzamatCharacter";
import { DiceString } from "@/js/common/DiceString";
import { getClass } from "@/js/utils/render-5etools/getClass";
import { getSpecies } from "@/js/utils/render-5etools/getSpecies";
import renderHTML from "@/js/utils/render-5etools/renderHTML";

const character = new AzamatCharacter();
const characterName = "Azamat";

export const metadata: Metadata = {
  title: characterName,
};

export default function AzamatPage() {
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
                    <D20TestCell roll={character.getInitiative()} advantage={true} />
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
          <SavesTable title="Saves (with added Cha)" character={character} />
          <SavesTable
            title={'<a href="https://2014.5e.tools/races.html#warforged_erlw">Constructed Resilience</a><br>ADV against poison<br>also half damage'}
            savingThrows={character.getSavingThrows().filter((s) => s.ability == "Con")}
            advantage={true}
            character={character}
          />
          <HitDiceTable hitDice={character.getHitDice()} conModifier={character.getAbilityModifier("Con")} />
        </div>
        <div className="column">
          <WeaponAttackTable weaponAttacks={character.getWeaponAttacks()} damageAddons={character.getWeaponAttackAddons()} />
          <table>
            <tbody>
              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Other Spells
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
                <th>Spell</th>
                <th className="modifier">Damage</th>
              </tr>
              <LevelledSpellDamageRow
                name="Moonbeam"
                damageOptions={character.getDamageProgression({ level: 2, damage: new DiceString("2d10") }, new DiceString("1d10"))}
              />
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
                  <InfoTooltip reference={renderHTML(getSpecies("Warforged", "ERLW"))}>Warforged</InfoTooltip>
                </td>
              </tr>
              <tr>
                <td>Class</td>
                <td className="modifier">
                  <InfoTooltip reference={renderHTML(getClass("Paladin"))}>Paladin</InfoTooltip> {character.characterLevel}
                </td>
              </tr>
              <tr>
                <td>Lay on Hands</td>
                <td className="modifier">
                  <LayOnHandsInput layOnHandsMaximum={character.getLayOnHandsMaximum()} /> per long rest
                </td>
              </tr>
              <tr>
                <td>Channel Divinity</td>
                <td className="modifier">
                  <ChannelDivinityCheckboxes maxUses={character.getChannelDivinity()} />
                </td>
              </tr>
              <tr>
                <td>[CD] Divine Sense (60ft)</td>
                <td className="modifier">celestial/fiend/undead</td>
              </tr>
              <tr>
                <td>[CD] Harness Divine Power</td>
                <td className="modifier">
                  max slot lv: <span className="mono">{Math.ceil(0.5 * character.proficiencyBonus)}</span>
                </td>
              </tr>
              <tr>
                <td>[CD] Watcher&apos;s Will (30ft)</td>
                <td className="modifier">
                  <span className="mono">{character.getAbilityModifier("Cha")}</span> + self
                </td>
              </tr>
              <tr>
                <td>[CD] Abjure the Extraplanar (30ft)</td>
                <td className="modifier">WIS save</td>
              </tr>
              <tr>
                <td>Cleansing Touch</td>
                <td className="modifier">
                  <span className="mono">{character.getAbilityModifier("Cha")}</span>/long rest
                </td>
              </tr>
              <tr>
                <td>Aura of Protection (10ft)</td>
                <td className="modifier">
                  <span className="mono">+{character.getAbilityModifier("Cha")}&nbsp;</span>
                </td>
              </tr>
              <tr>
                <td>Aura of the Sentinel (10ft)</td>
                <td className="modifier">Advantage: Initiative</td>
              </tr>
              <tr>
                <td>Aura of Courage (10ft)</td>
                <td className="modifier">Immunity: frightened</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
