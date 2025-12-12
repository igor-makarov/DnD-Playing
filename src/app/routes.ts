import { type RouteConfigEntry, layout, route } from "@react-router/dev/routes";
import { readdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";

// Convert file name segment to URL segment
// $param -> :param (dynamic route parameter)
function toUrlSegment(segment: string): string {
  if (segment.startsWith("$")) {
    return ":" + segment.slice(1);
  }
  return segment;
}

// Auto-discover routes from the routes directory
function discoverRoutes(routesDir: string): RouteConfigEntry[] {
  const routes: RouteConfigEntry[] = [];

  function scanDirectory(dir: string, urlPrefix: string = "") {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recurse into subdirectories, converting $ to : for dynamic segments
        scanDirectory(fullPath, `${urlPrefix}/${toUrlSegment(entry)}`);
      } else if (entry.endsWith(".tsx")) {
        const name = basename(entry, ".tsx");
        const relativePath = fullPath.replace(routesDir + "/", "routes/");

        if (name === "index") {
          // index.tsx -> /prefix or /
          const urlPath = urlPrefix || "/";
          routes.push(route(urlPath, relativePath));
        } else {
          // Other files -> /prefix/name (converting $ to : for dynamic params)
          const urlPath = `${urlPrefix}/${toUrlSegment(name)}`;
          routes.push(route(urlPath, relativePath));
        }
      }
    }
  }

  scanDirectory(routesDir);
  return routes;
}

const routesDir = join(dirname(import.meta.dirname!), "app/routes");
export default discoverRoutes(routesDir).concat([
  layout(join(dirname(import.meta.dirname!), "layouts/ReferenceLayout.tsx"), [
    route("/characters/Jacob/info", `${routesDir}/characters/Jacob/info.mdx`),
  ]),
]);
