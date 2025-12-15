import ReferenceCard from "@/components/common/ReferenceCard";

import type { Route } from "./+types/$class";

const pageTitle = "Class Reference";

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.className ?? pageTitle }];
}

interface LoaderData {
  className: string;
  sanitizedHtml: string;
}

// Server-only: runs during pre-render, not bundled for client
export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const { getClass, getClassFeaturesFull } = await import("@/js/utils/render-5etools/getClass");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  // Parse param: "Fighter-XPHB" -> className="Fighter", source="XPHB"
  const classParam = params.class;
  const lastDash = classParam.lastIndexOf("-");
  const className = classParam.substring(0, lastDash);
  const source = classParam.substring(lastDash + 1);

  // Fetch class data from 5etools
  const classData = getClass(className, source);

  // Add class features grouped by level
  const features = getClassFeaturesFull(className, source);
  const byLevel = new Map<number, typeof features>();
  for (const f of features) {
    if (!byLevel.has(f.level)) byLevel.set(f.level, []);
    byLevel.get(f.level)!.push(f);
  }

  for (const [level, levelFeatures] of byLevel) {
    for (const feature of levelFeatures) {
      classData.entries.push({ type: "heading", name: `Level ${level}: ${feature.name}` });
      classData.entries = [...classData.entries, ...feature.entries];
    }
  }

  delete classData.fullLink;
  const { sanitizedHtml } = renderHTML(classData);

  return { className, sanitizedHtml };
}

export default function ClassPage({ loaderData }: Route.ComponentProps) {
  const { sanitizedHtml } = loaderData;

  return (
    <div className="reference-layout">
      <ReferenceCard>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </ReferenceCard>
    </div>
  );
}
