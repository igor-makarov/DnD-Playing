import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/index.tsx"),
  route("/characters/Azamat", "routes/characters/Azamat.tsx"),
  route("/characters/Jacob", "routes/characters/Jacob.tsx"),
  route("/characters/Adrik", "routes/characters/Adrik.tsx"),
  route("/classes", "routes/classes/index.tsx"),
  route("/critical-role", "routes/critical-role/index.tsx"),
] satisfies RouteConfig;
