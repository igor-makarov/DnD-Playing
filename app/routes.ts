import { layout, route } from "@react-router/dev/routes";
import { readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

// Convert file name segment to URL segment
// $param -> :param (dynamic route parameter)
function toUrlSegment(segment: string): string {
  if (segment.startsWith("$")) {
    return ":" + segment.slice(1);
  }
  return segment;
}

type DiscoveredRoute = { urlPath: string; filePath: string; ext: ".tsx" | ".mdx" };

// Auto-discover routes from the routes directory
function discoverRoutes(routesDir: string): DiscoveredRoute[] {
  const routes: DiscoveredRoute[] = [];

  function scanDirectory(dir: string, urlPrefix: string = "") {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);

      if (statSync(fullPath).isDirectory()) {
        // Recurse into subdirectories, converting $ to : for dynamic segments
        scanDirectory(fullPath, `${urlPrefix}/${toUrlSegment(entry)}`);
      } else if (entry.endsWith(".tsx") || entry.endsWith(".mdx")) {
        const ext = extname(entry) as ".tsx" | ".mdx";
        const name = basename(entry, ext);
        const relativePath = fullPath.replace(routesDir + "/", "routes/");
        const urlPath = name === "index" ? urlPrefix || "/" : `${urlPrefix}/${toUrlSegment(name)}`;
        routes.push({ urlPath, filePath: relativePath, ext });
      }
    }
  }

  scanDirectory(routesDir);
  return routes;
}

const routesDir = join(dirname(import.meta.dirname!), "app/routes");
const layoutPath = "layouts/ReferenceLayout.tsx";

const discovered = discoverRoutes(routesDir);
const tsxRoutes = discovered.filter((r) => r.ext === ".tsx").map((r) => route(r.urlPath, r.filePath));
const mdxRoutes = discovered.filter((r) => r.ext === ".mdx").map((r) => route(r.urlPath, r.filePath));

export default tsxRoutes.concat(mdxRoutes.length > 0 ? [layout(layoutPath, mdxRoutes)] : []);
