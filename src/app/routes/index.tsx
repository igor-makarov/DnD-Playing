import { Link, useLoaderData } from "react-router";

const pageTitle = "D&D Character Sheets";

export function meta() {
  return [{ title: pageTitle }];
}

interface CharacterPage {
  name: string;
  to: string;
}

interface LoaderData {
  characterPages: CharacterPage[];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader(): Promise<LoaderData> {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const charactersDir = path.resolve("src/app/routes/characters");
  const files = fs.readdirSync(charactersDir).filter((f: string) => f.endsWith(".tsx"));

  const characterPages = files
    .map((filename: string) => {
      const name = filename.replace(".tsx", "");
      return { name, to: `/characters/${name}` };
    })
    .sort((a: CharacterPage, b: CharacterPage) => a.name.localeCompare(b.name));

  return { characterPages };
}

export default function HomePage() {
  const { characterPages } = useLoaderData<LoaderData>();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: "300px" }}>
        <table>
          <tbody>
            <tr>
              <th>Characters</th>
            </tr>
            {characterPages.map(({ name, to }) => (
              <tr key={to}>
                <td>
                  <Link to={to}>{name}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Critical Role</th>
            </tr>
            <tr>
              <td>
                <Link to="/critical-role">Critical Role Characters</Link>
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Classes</th>
            </tr>
            <tr>
              <td>
                <Link to="/classes">All Classes</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
