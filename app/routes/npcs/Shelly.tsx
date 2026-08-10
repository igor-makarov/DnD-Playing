import { useLoaderData } from "react-router";

import HitDiceTable from "@/components/HitDiceTable";
import AttackDamageCell from "@/components/common/AttackDamageCell";
import CheckboxUsesRow from "@/components/common/CheckboxUsesRow";
import D20TestCell from "@/components/common/D20TestCell";
import InfoTooltip from "@/components/common/InfoTooltip";
import ReferenceCard from "@/components/common/ReferenceCard";
import RollLink from "@/components/common/RollLink";
import TextBox from "@/components/common/TextBox";
import GameplayStatBlockAbilities from "@/components/stat-block/GameplayStatBlockAbilities";
import GameplayStatBlockSaves from "@/components/stat-block/GameplayStatBlockSaves";
import GameplayStatBlockVitals from "@/components/stat-block/GameplayStatBlockVitals";
import type { SteelDefenderGameplay } from "@/js/character/classes/ArtificerReferences";
import { $steelDefenderRepairUsed } from "@/js/character/dynamic-state/classes/artificer/steelDefenderRepairStore";
import { $notes } from "@/js/character/dynamic-state/commonStores";
import MiloCharacter from "@/js/characters/MiloCharacter";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";
import { useStore } from "@/js/hooks/useStore";
import type { ReferenceRendered } from "@/js/utils/render-5etools/ReferenceTypes";

const milo = new MiloCharacter();

export function meta() {
  return [{ title: "Shelly" }];
}

export async function loader() {
  const { getSteelDefender, getSteelDefenderGameplay } = await import("@/js/character/classes/ArtificerReferences");
  const { getSubclassFeature } = await import("@/js/utils/render-5etools/getSubclassFeature");
  const { getRemainingStatBlockReference } = await import("@/js/utils/render-5etools/referenceToGameplayStatBlock");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");
  const ownerStats = milo.getSteelDefenderOwnerStats();
  const statBlockReference = getSteelDefender(ownerStats);
  const gameplayStatBlockReference = {
    ...statBlockReference,
    entries: statBlockReference.entries.filter((entry) => {
      if (typeof entry === "string") return true;
      return entry.name !== "Steel Bond" && !(entry.type === "heading" && entry.name === "Traits");
    }),
  };

  return {
    steelDefender: getSteelDefenderGameplay(ownerStats),
    statBlockRef: renderHTML(getRemainingStatBlockReference(gameplayStatBlockReference)),
    featureRef: renderHTML(getSubclassFeature("Steel Defender", "Artificer", "Battle Smith", "EFA")),
  };
}

interface LoaderData {
  steelDefender: SteelDefenderGameplay;
  statBlockRef: ReferenceRendered;
  featureRef: ReferenceRendered;
}

export default function ShellyPage() {
  const { steelDefender, statBlockRef, featureRef } = useLoaderData<LoaderData>();
  const { statBlock, forceEmpoweredRend, repair, deflectAttack } = steelDefender;
  const repairUsed = useStore($steelDefenderRepairUsed);
  const hitDice = statBlock.hitDice.map(({ die, count }) => ({ die: new DiceString(die), count }));
  const constitutionScore = statBlock.abilities.find(({ ability }) => ability === "Con")?.score ?? 10;
  const constitutionModifier = Math.floor((constitutionScore - 10) / 2);

  return (
    <>
      <base target="_blank" />
      <div className="row six-across">
        <GameplayStatBlockAbilities statBlock={statBlock} />
      </div>
      <div className="row four-across">
        <GameplayStatBlockVitals statBlock={statBlock} />
      </div>
      <main className="row three-and-large">
        <div className="column">
          <GameplayStatBlockSaves statBlock={statBlock} />
          <HitDiceTable hitDice={hitDice} conModifier={constitutionModifier} />
        </div>
        <div className="column">
          <table>
            <tbody>
              <tr>
                <th colSpan={2} className="modifier">
                  Actions
                </th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={forceEmpoweredRend.reference}>Force-Empowered Rend</InfoTooltip>
                </td>
                <td className="checkCell">
                  <D20TestCell roll={new D20Test("Attack Roll", "Int", forceEmpoweredRend.attackBonus)} />{" "}
                  <AttackDamageCell dice={new DiceString(forceEmpoweredRend.damage)} />
                </td>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={repair.reference}>Repair</InfoTooltip>{" "}
                  <CheckboxUsesRow maxUses={repair.uses} currentUsed={repairUsed ?? 0} onChange={$steelDefenderRepairUsed.set} /> / day
                </td>
                <td className="checkCell">
                  <RollLink dice={new DiceString(repair.healing)} />
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th className="modifier">Reactions</th>
              </tr>
              <tr>
                <td>
                  <InfoTooltip reference={deflectAttack.reference}>Deflect Attack</InfoTooltip>
                </td>
              </tr>
            </tbody>
          </table>
          <TextBox title="Notes" store={$notes} placeholder="Notes" rows={20} data-testid="notes-text-box" />
        </div>
        <div className="column">
          <ReferenceCard>
            <div dangerouslySetInnerHTML={{ __html: statBlockRef.sanitizedHtml }} />
          </ReferenceCard>
        </div>
        <div className="column features">
          <ReferenceCard>
            <div dangerouslySetInnerHTML={{ __html: featureRef.sanitizedHtml }} />
          </ReferenceCard>
        </div>
      </main>
    </>
  );
}
