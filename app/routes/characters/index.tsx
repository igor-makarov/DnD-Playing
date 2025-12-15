import { Link, useLoaderData } from "react-router";

const pageTitle = "Characters";

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

export async function loader(): Promise<LoaderData> {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const charactersDir = path.resolve("app/routes/characters");
  const files = fs.readdirSync(charactersDir).filter((f: string) => f.endsWith(".tsx") && f !== "index.tsx");

  const characterPages = files
    .map((filename: string) => {
      const name = filename.replace(".tsx", "");
      return { name, to: `/characters/${name}` };
    })
    .sort((a: CharacterPage, b: CharacterPage) => a.name.localeCompare(b.name));

  return { characterPages };
}

export default function CharactersIndexPage() {
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
      </div>
    </div>
  );
}
