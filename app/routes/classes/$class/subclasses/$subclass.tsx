import ReferenceCard from "@/components/common/ReferenceCard";

import type { Route } from "./+types/$subclass";

const pageTitle = "Subclass Reference";

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData?.subclassName ?? pageTitle }];
}

interface LoaderData {
  subclassName: string;
  sanitizedHtml: string;
}

// Server-only: runs during pre-render, not bundled for client
export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  const { getSubclass, getSubclassFeaturesFull } = await import("@/js/utils/render-5etools/getSubclass");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  // Parse params: "Fighter.XPHB" and "Champion.XPHB"
  const classParam = params.class;
  const classSeparator = classParam.lastIndexOf(".");
  const className = classParam.substring(0, classSeparator);
  const classSource = classParam.substring(classSeparator + 1);

  const subclassParam = params.subclass;
  const subclassSeparator = subclassParam.lastIndexOf(".");
  const subclassShortName = subclassParam.substring(0, subclassSeparator);
  const subclassSource = subclassParam.substring(subclassSeparator + 1);

  // Fetch subclass data from 5etools
  const subclassData = getSubclass(className, subclassShortName, classSource);

  // Add subclass features grouped by level (skip intro feature which is already shown)
  const features = getSubclassFeaturesFull(className, subclassShortName, classSource, subclassSource);
  const byLevel = new Map<number, typeof features>();
  for (const f of features) {
    // Skip intro feature (same name as subclass)
    if (f.name === subclassData.name) continue;
    if (!byLevel.has(f.level)) byLevel.set(f.level, []);
    byLevel.get(f.level)!.push(f);
  }

  for (const [level, levelFeatures] of byLevel) {
    for (const feature of levelFeatures) {
      subclassData.entries.push({ type: "heading", name: `Level ${level}: ${feature.name}` });
      subclassData.entries = [...subclassData.entries, ...feature.entries];
    }
  }

  delete subclassData.fullLink;
  const { sanitizedHtml } = renderHTML(subclassData);

  return { subclassName: subclassData.name, sanitizedHtml };
}

export default function SubclassPage({ loaderData }: Route.ComponentProps) {
  const { sanitizedHtml } = loaderData;

  return (
    <div className="reference-layout">
      <ReferenceCard>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </ReferenceCard>
    </div>
  );
}
