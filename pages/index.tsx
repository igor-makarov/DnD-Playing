import Head from "next/head";

export default function HomePage() {
  const isDev = process.env.NODE_ENV === "development";
  const pageTitle = "D&D Character Sheets";

  return (
    <>
      <Head>
        <title>
          {isDev ? "[dev] " : ""}
          {pageTitle}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
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
                <th>Next.js Migration</th>
              </tr>
              <tr>
                <td>Checkpoint 1 complete!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
