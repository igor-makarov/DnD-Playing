import { Link, useLoaderData } from "react-router";

const pageTitle = "Critical Role Characters";

export function meta() {
  return [{ title: pageTitle }];
}

interface CharacterPage {
  character: string;
  level: number;
  label: string;
  to: string;
}

interface LoaderData {
  groupedCharacters: Record<string, CharacterPage[]>;
}

// Server-only: runs during pre-render, not bundled for client
export async function loader(): Promise<LoaderData> {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const crDir = path.resolve("src/pages/critical-role");
  const files = fs.readdirSync(crDir).filter((f: string) => f.endsWith(".astro") && f !== "index.astro");

  const characterPages = files
    .map((filename: string) => {
      const name = filename.replace(".astro", "");
      // Parse "Name-Level" format (e.g., "Bolaire-03" -> { character: "Bolaire", level: 3 })
      const match = name.match(/^(.+)-(\d+)$/);
      const character = match ? match[1] : name;
      const level = match ? parseInt(match[2], 10) : 0;
      return {
        character,
        level,
        label: `Level ${level}`,
        to: `/critical-role/${name}`,
      };
    })
    .sort((a: CharacterPage, b: CharacterPage) => a.character.localeCompare(b.character) || a.level - b.level);

  // Group by character
  const groupedCharacters = characterPages.reduce(
    (acc: Record<string, CharacterPage[]>, page: CharacterPage) => {
      if (!acc[page.character]) {
        acc[page.character] = [];
      }
      acc[page.character].push(page);
      return acc;
    },
    {} as Record<string, CharacterPage[]>,
  );

  return { groupedCharacters };
}

export default function CriticalRoleIndexPage() {
  const { groupedCharacters } = useLoaderData<LoaderData>();

  return (
    <div className="row six-across">
      {Object.entries(groupedCharacters).map(([character, pages]) => (
        <div className="column" key={character}>
          <table>
            <tbody>
              <tr>
                <th>{character}</th>
              </tr>
              {pages.map(({ label, to }) => (
                <tr key={to}>
                  <td>
                    <Link to={to}>{label}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
