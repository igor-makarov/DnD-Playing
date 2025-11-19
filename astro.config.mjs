import { defineConfig } from "astro/config";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://igor-makarov.github.io",
  base: "/DnD-Playing",
  integrations: [
    react({
      babel: {
        presets: [["@babel/preset-react"]],
        plugins: [["@babel/plugin-proposal-decorators", { version: "2023-05" }]],
      },
    }),
  ],
});
