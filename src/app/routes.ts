import { type RouteConfigEntry, route } from "@react-router/dev/routes";
import { readdirSync, statSync } from "node:fs";
import { join, basename, dirname } from "node:path";

// Auto-discover routes from the routes directory
function discoverRoutes(routesDir: string): RouteConfigEntry[] {
  const routes: RouteConfigEntry[] = [];

  function scanDirectory(dir: string, urlPrefix: string = "") {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        // Recurse into subdirectories
        scanDirectory(fullPath, `${urlPrefix}/${entry}`);
      } else if (entry.endsWith(".tsx")) {
        const name = basename(entry, ".tsx");
        const relativePath = fullPath.replace(routesDir + "/", "routes/");

        if (name === "index") {
          // index.tsx -> /prefix or /
          const urlPath = urlPrefix || "/";
          routes.push(route(urlPath, relativePath));
        } else {
          // Other files -> /prefix/name
          const urlPath = `${urlPrefix}/${name}`;
          routes.push(route(urlPath, relativePath));
        }
      }
    }
  }

  scanDirectory(routesDir);
  return routes;
}

const routesDir = join(dirname(import.meta.dirname!), "app/routes");
export default discoverRoutes(routesDir);
