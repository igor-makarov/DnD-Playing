import type { Config } from "@react-router/dev/config";

export default {
  // Use src/app as the app directory (like Next.js)
  appDirectory: "src/app",

  // Enable SSR for pre-rendering
  ssr: true,

  // Pre-render these routes at build time for SSG
  prerender: ["/", "/characters/Azamat"],

  // Support BASE_URL for deployment
  basename: process.env.BASE_URL || "/",
} satisfies Config;
