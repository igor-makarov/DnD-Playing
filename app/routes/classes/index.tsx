import { Link, useLoaderData } from "react-router";

import { getSourceName } from "@/js/utils/render-5etools/ReferenceTypes";

const pageTitle = "D&D Classes";

export function meta() {
  return [{ title: pageTitle }];
}

interface ClassPageData {
  name: string;
  source: string;
  to: string;
  subclasses: { name: string; to: string }[];
}

interface LoaderData {
  classesBySource: Record<string, ClassPageData[]>;
  sources: string[];
}

// Server-only: runs during pre-render, not bundled for client
export async function loader(): Promise<LoaderData> {
  const { collectAllClassReferences, classRoute } = await import("@/js/utils/collectClasses");
  const { collectAllSubclassReferences, subclassRoute } = await import("@/js/utils/collectSubclasses");

  const subclassRefs = collectAllSubclassReferences();

  // Group subclasses by class key (className|classSource)
  const subclassesByClass = subclassRefs.reduce(
    (acc, sc) => {
      const key = `${sc.className}|${sc.classSource}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(sc);
      return acc;
    },
    {} as Record<string, typeof subclassRefs>,
  );

  const classPages = collectAllClassReferences()
    .map((ref) => ({
      name: ref.name,
      source: ref.source,
      to: classRoute(ref),
      subclasses: (subclassesByClass[`${ref.name}|${ref.source}`] || [])
        .map((sc) => ({
          name: sc.subclassShortName,
          to: subclassRoute(sc),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name) || a.source.localeCompare(b.source));

  // Group by source
  const classesBySource = classPages.reduce(
    (acc, cls) => {
      if (!acc[cls.source]) {
        acc[cls.source] = [];
      }
      acc[cls.source].push(cls);
      return acc;
    },
    {} as Record<string, typeof classPages>,
  );

  const sources = Object.keys(classesBySource).sort();

  return { classesBySource, sources };
}

export default function ClassesIndexPage() {
  const { classesBySource, sources } = useLoaderData<LoaderData>();

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div style={{ width: "300px" }}>
        {sources.map((source) => (
          <table key={source}>
            <tbody>
              <tr>
                <th>{getSourceName(source)}</th>
              </tr>
              {classesBySource[source].map(({ name, to, subclasses }) => (
                <tr key={to}>
                  <td>
                    <Link to={to}>{name}</Link>
                    {subclasses.length > 0 && (
                      <ul>
                        {subclasses.map((sc) => (
                          <li key={sc.to}>
                            <Link to={sc.to}>{sc.name}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}
