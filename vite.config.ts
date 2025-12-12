import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import remarkFrontmatter from "remark-frontmatter";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    assetsDir: (process.env.BASE_URL || "/").substring(1) + "assets/",
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx({ remarkPlugins: [remarkFrontmatter] }),
    },

    reactRouter(),
    tsconfigPaths(),
  ],
});
