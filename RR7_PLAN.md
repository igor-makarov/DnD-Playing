# Next.js → React Router 7 Migration Plan (SSG with Pre-rendering)

## Overview

Migrate from Next.js App Router to React Router 7 (Remix) for a D&D Character Sheet application. The project uses React components with URL-based state management and static site generation via pre-rendering.

**Key benefit of RR7:** Vite-based build, loaders for server-only code, and pre-rendering for SSG deployment.

## Configuration

### react-router.config.ts

```ts
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src/app",
  ssr: true,
  prerender: ["/", "/characters/Azamat"],
  basename: process.env.BASE_URL || "/",
} satisfies Config;
```

### vite.config.ts

```ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  server: {
    port: 3000,
  },
});
```

### tsconfig.json

Use `@tsconfig/vite-react` base, keep path aliases.

## Routing Migration

| Next.js App Router | React Router 7 |
|-------------------|----------------|
| `src/app/layout.tsx` | `src/app/root.tsx` |
| `src/app/page.tsx` | `src/app/routes/index.tsx` |
| `src/app/characters/Azamat/page.tsx` | `src/app/routes/characters/Azamat.tsx` |
| `src/app/characters/Jacob/page.tsx` | `src/app/routes/characters/Jacob.tsx` |
| `src/app/characters/Adrik/page.tsx` | `src/app/routes/characters/Adrik.tsx` |
| `src/app/classes/page.tsx` | `src/app/routes/classes/index.tsx` |
| `src/app/classes/[class]/page.tsx` | `src/app/routes/classes/$class.tsx` |
| `src/app/subclasses/[subclass]/page.tsx` | `src/app/routes/subclasses/$subclass.tsx` |
| `src/app/critical-role/page.tsx` | `src/app/routes/critical-role/index.tsx` |
| `src/app/critical-role/[character]/page.tsx` | `src/app/routes/critical-role/$character.tsx` |

### routes.ts

Routes are configured in `src/app/routes.ts`:

```ts
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/index.tsx"),
  route("/characters/Azamat", "routes/characters/Azamat.tsx"),
  route("/characters/Jacob", "routes/characters/Jacob.tsx"),
  route("/characters/Adrik", "routes/characters/Adrik.tsx"),
  route("/classes", "routes/classes/index.tsx"),
  route("/classes/:class", "routes/classes/$class.tsx"),
  route("/subclasses/:subclass", "routes/subclasses/$subclass.tsx"),
  route("/critical-role", "routes/critical-role/index.tsx"),
  route("/critical-role/:character", "routes/critical-role/$character.tsx"),
] satisfies RouteConfig;
```

## Loader Pattern for Server-Only Code

RR7 uses `loader` functions for server-only code. This keeps Node.js modules (like `fs`, `jsdom`) out of the client bundle.

### Before (Next.js RSC)

```tsx
// src/app/characters/Azamat/page.tsx
import renderHTML from "@/js/utils/render-5etools/renderHTML";
import { getClass } from "@/js/utils/render-5etools/getClass";

export default function AzamatPage() {
  const classData = renderHTML(getClass("Paladin")); // Runs at build time
  return <InfoTooltip reference={classData}>Paladin</InfoTooltip>;
}
```

### After (RR7 Loader)

```tsx
// src/app/routes/characters/Azamat.tsx
import { useLoaderData } from "react-router";

// Server-only: runs during pre-render, not bundled for client
export async function loader() {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  return {
    classRef: renderHTML(getClass("Paladin")),
  };
}

export default function AzamatPage() {
  const { classRef } = useLoaderData<typeof loader>();
  return <InfoTooltip reference={classRef}>Paladin</InfoTooltip>;
}
```

## Root Layout

### src/app/root.tsx

```tsx
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import "@/styles/style.css";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
```

## Route Meta (replacing Next.js Metadata)

```tsx
// Next.js
export const metadata: Metadata = {
  title: "Azamat",
};

// React Router 7
export function meta() {
  return [{ title: "Azamat" }];
}
```

## Dynamic Routes with Pre-rendering

For dynamic routes, add paths to the `prerender` config:

```ts
// react-router.config.ts
export default {
  prerender: async () => {
    const classes = collectAllClassReferences();
    return [
      "/",
      "/characters/Azamat",
      ...classes.map((c) => `/classes/${c.name}-${c.source}`),
    ];
  },
} satisfies Config;
```

Or use a loader with params:

```tsx
// src/app/routes/classes/$class.tsx
import { useLoaderData, useParams } from "react-router";

export async function loader({ params }: { params: { class: string } }) {
  const { getClass } = await import("@/js/utils/render-5etools/getClass");
  const { default: renderHTML } = await import("@/js/utils/render-5etools/renderHTML");

  const [name, source] = params.class.split("-");
  return { html: renderHTML(getClass(name, source)) };
}

export default function ClassPage() {
  const { html } = useLoaderData<typeof loader>();
  return <div dangerouslySetInnerHTML={{ __html: html.sanitizedHtml }} />;
}
```

## What Changed from Next.js

| Aspect | Next.js | React Router 7 |
|--------|---------|----------------|
| Build tool | Webpack/Turbopack | Vite |
| Server code | RSC (inline) | `loader` functions |
| Metadata | `export const metadata` | `export function meta()` |
| Layout | `layout.tsx` | `root.tsx` |
| Routing | File-based (`page.tsx`) | `routes.ts` config |
| Static params | `generateStaticParams` | `prerender` config |
| Client directive | `"use client"` | Not needed (all components are client by default) |

## What Stays the Same

- **URL query state management** - Custom store system in `src/js/stores/primitives/`
- **React components** - All existing `.tsx` components
- **Character logic** - `src/js/character/` unchanged
- **CSS** - `src/styles/style.css` (import in root.tsx)
- **Unit tests** - Vitest configuration
- **E2E tests** - Playwright (update port/command)

## Dependencies

### Remove

- `next`
- `@tsconfig/next`

### Add

- `@react-router/dev`
- `@react-router/node`
- `@react-router/serve`
- `react-router`
- `vite`
- `@tsconfig/vite-react`

### Keep

- `react`, `react-dom`
- `vitest`, `@playwright/test`
- `prettier`
- `vite-tsconfig-paths`
- All other utilities

## Scripts

```json
{
  "dev": "react-router dev",
  "build": "react-router build",
  "start": "react-router-serve ./build/server/index.js",
  "preview": "serve build/client",
  "check": "react-router typegen && tsc --noEmit",
  "format": "prettier --write .",
  "test": "vitest --run",
  "test:e2e": "playwright test"
}
```

## Final Directory Structure

```
├── src/
│   ├── app/
│   │   ├── root.tsx                    # Root layout with CSS
│   │   ├── routes.ts                   # Route configuration
│   │   └── routes/
│   │       ├── index.tsx               # Home page
│   │       ├── characters/
│   │       │   ├── Azamat.tsx
│   │       │   ├── Jacob.tsx
│   │       │   └── Adrik.tsx
│   │       ├── classes/
│   │       │   ├── index.tsx           # Classes index
│   │       │   └── $class.tsx          # Dynamic class pages
│   │       ├── subclasses/
│   │       │   └── $subclass.tsx
│   │       └── critical-role/
│   │           ├── index.tsx           # CR index
│   │           └── $character.tsx
│   ├── components/                     # Shared components
│   ├── js/                             # Business logic
│   └── styles/
├── public/
├── react-router.config.ts
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Deployment

Update `.github/workflows/deploy.yml`:

- Build command: `react-router build`
- Output directory: `build/client/` (pre-rendered static files)
