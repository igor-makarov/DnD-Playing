import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src/app",
  ssr: false,
  prerender: async function prerender({ getStaticPaths }) {
    return getStaticPaths();
  },
  basename: process.env.BASE_URL || "/",
} satisfies Config;
