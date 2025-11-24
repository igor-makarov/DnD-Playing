import { defineConfig } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://igor-makarov.github.io",
  base: "/DnD-Playing",
  vite: {
    plugins: [tsconfigPaths()],
  },
  integrations: [
    react({
      babel: {
        presets: [["@babel/preset-react"]],
        plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
      },
    }),
  ],
});
