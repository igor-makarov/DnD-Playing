import type { Metadata } from "next";

import D20TestCell from "@/components/common/D20TestCell";
import { D20Test } from "@/js/common/D20Test";

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
      </div>
    </div>
  );
}
