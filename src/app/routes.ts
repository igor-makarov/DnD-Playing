import { type RouteConfig, route } from "@react-router/dev/routes";

export default [route("/", "routes/index.tsx"), route("/characters/Azamat", "routes/characters/Azamat.tsx")] satisfies RouteConfig;
