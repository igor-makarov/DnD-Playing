import type { Metadata } from "next";

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
      }}
    >
      <div style={{ width: 300 }}>
        <table>
          <tbody>
            <tr>
              <th>Next.js App Router Migration</th>
            </tr>
            <tr>
              <td>Checkpoint 1 complete!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
