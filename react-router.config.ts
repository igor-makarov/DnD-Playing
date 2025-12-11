import type { Config } from "@react-router/dev/config";

import { collectClassRoutes } from "./src/js/utils/collectClasses";
import { collectSubclassRoutes } from "./src/js/utils/collectSubclasses";

export default {
  appDirectory: "src/app",
  ssr: false,
  prerender: async function prerender({ getStaticPaths }) {
    const staticPaths = getStaticPaths();
    const classPaths = collectClassRoutes();
    const subclassPaths = collectSubclassRoutes();

    return [...staticPaths, ...classPaths, ...subclassPaths];
  },
  basename: process.env.BASE_URL || "/",
} satisfies Config;
