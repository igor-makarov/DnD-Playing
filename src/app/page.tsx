import type { Metadata } from "next";

import AttackDamageCell from "@/components/common/AttackDamageCell.server";
import D20TestCell from "@/components/common/D20TestCell.server";
import RollLink from "@/components/common/RollLink.server";
import { D20Test } from "@/js/common/D20Test";
import { DiceString } from "@/js/common/DiceString";

export const metadata: Metadata = {
  title: "D&D Character Sheets",
};

export default function HomePage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: 600 }}>
        D20 Test: <D20TestCell roll={new D20Test("Ability Check", "Cha", 2)} />
        <br />
        Attack Damage: <AttackDamageCell dice={new DiceString("2d6+5")} />
        <br />
        Roll Link (standalone): <RollLink dice={new DiceString("1d20+5")}>Roll d20</RollLink>
      </div>
    </div>
  );
}
