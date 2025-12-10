# Astro → Next.js Migration Plan (App Router with RSC)

## Overview

Migrate from Astro to Next.js App Router for a D&D Character Sheet application. The project uses React components with URL-based state management and static site generation.

**Key benefit of App Router:** React Server Components (RSC) allow server-only code (like `jsdom`, `fs`, `dompurify`) to run seamlessly at build time, similar to Astro's frontmatter.

## Configuration

### next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.BASE_URL || '',
  images: { unoptimized: true },
}
module.exports = nextConfig
```

### tsconfig.json

Use `@tsconfig/next` base, keep path aliases.

## Routing Migration

| Astro | Next.js App Router |
|-------|-------------------|
| `src/pages/index.astro` | `app/page.tsx` |
| `src/pages/characters/Azamat.astro` | `app/characters/Azamat/page.tsx` |
| `src/pages/characters/Jacob.astro` | `app/characters/Jacob/page.tsx` |
| `src/pages/characters/Adrik.astro` | `app/characters/Adrik/page.tsx` |
| `src/pages/classes/index.astro` | `app/classes/page.tsx` |
| `src/pages/classes/[class].astro` | `app/classes/[class]/page.tsx` |
| `src/pages/subclasses/[subclass].astro` | `app/subclasses/[subclass]/page.tsx` |
| `src/pages/critical-role/index.astro` | `app/critical-role/page.tsx` |
| `src/pages/critical-role/[character].astro` | `app/critical-role/[character]/page.tsx` |
| `src/layouts/ReferenceLayout.astro` | `app/classes/layout.tsx` or component |

## Server vs Client Components

### Server Components (default)

Pages are Server Components by default - Node.js code runs at build time:

```tsx
// app/characters/Azamat/page.tsx (Server Component)
import renderHTML from "@/js/utils/render-5etools/renderHTML";
import { getClass } from "@/js/utils/render-5etools/getClass";

export default function AzamatPage() {
  // This runs ONLY on the server at build time - uses jsdom, fs, etc.
  const classData = renderHTML(getClass("Paladin"));

  return (
    <>
      <ServerContent classData={classData} />
      <InteractiveSection /> {/* Client Component */}
    </>
  );
}
```

### Client Components

Components needing interactivity must be marked with `"use client"`:

```tsx
// src/components/HitPointsInput.tsx
"use client";

import { useState } from "react";

export default function HitPointsInput({ hitPointMaximum }) {
  const [hp, setHp] = useState(hitPointMaximum);
  // ... interactive logic
}
```

**Client Components needed:**
- `HitPointsInput` - URL state
- `HitDiceTable` - URL state
- `D20TestCell` - keyboard modifiers, roll links
- `WeaponAttackTable` - weapon selection state
- `SpellSlotsTable` - URL state
- `InfoTooltip` - dialog interaction
- Any component using `useState`, `useEffect`, `useStore`, or browser APIs

## Layout Structure

### app/layout.tsx (Root Layout)

```tsx
import "@/styles/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Character Pages (self-contained)

```tsx
// app/characters/Azamat/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Azamat",
};

export default function AzamatPage() {
  return (
    <>
      <base target="_blank" />
      <div className="row six-across">
        {/* content */}
      </div>
    </>
  );
}
```

### Dynamic Routes

```tsx
// app/classes/[class]/page.tsx
import { collectAllClassReferences } from "@/js/utils/collectClassNames";
import { getClass } from "@/js/utils/render-5etools/getClass";
import renderHTML from "@/js/utils/render-5etools/renderHTML";

export async function generateStaticParams() {
  const classes = collectAllClassReferences();
  return classes.map((c) => ({ class: `${c.name}-${c.source}` }));
}

export default function ClassPage({ params }: { params: { class: string } }) {
  const [name, source] = params.class.split("-");
  const classData = getClass(name, source);
  const { sanitizedHtml } = renderHTML(classData);

  return (
    <div className="info-tooltip-dialog" style={{ margin: "0 auto" }}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
    </div>
  );
}
```

## Component Migration

### Astro Components → React

| Astro File | React File | Type |
|------------|------------|------|
| `ReferenceLayout.astro` | `src/components/ReferenceLayout.tsx` | Server |
| `AbilitiesTable.astro` | `src/components/AbilitiesTable.tsx` | Server (wraps Client) |
| `SkillsTable.astro` | `src/components/SkillsTable.tsx` | Server (wraps Client) |
| `SavesTable.astro` | `src/components/SavesTable.tsx` | Server (wraps Client) |
| `SaveRow.astro` | `src/components/SaveRow.tsx` | Server (wraps Client) |
| `SkillRow.astro` | `src/components/SkillRow.tsx` | Server (wraps Client) |
| `WeaponAttackTable.astro` | Keep existing React component | Client |
| `SpellSlotsTables.astro` | `src/components/SpellSlotsTables.tsx` | Server (wraps Client) |
| `Link.astro` | `src/components/Link.tsx` (use `next/link`) | Server |

### Hydration Changes

Remove Astro `client:load` directives - use `"use client"` instead:

```diff
- <HitPointsInput client:load {...props} />
+ <HitPointsInput {...props} />  // Component has "use client" directive
```

## What Stays the Same

- **URL query state management** - Custom store system in `src/js/stores/primitives/`
- **React components** - All existing `.tsx` components (add `"use client"` where needed)
- **Character logic** - `src/js/character/` unchanged
- **Server utilities** - `src/js/utils/render-5etools/` work naturally in RSC
- **CSS** - `src/styles/style.css` (import in root layout)
- **Unit tests** - Vitest configuration
- **E2E tests** - Playwright (update port/command)

## Dependencies

### Remove

- `astro`
- `@astrojs/react`
- `@astrojs/check`
- `prettier-plugin-astro`

### Add

- `next`

### Keep

- `react`, `react-dom`
- `vitest`, `@playwright/test`
- `prettier`
- All other utilities

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "check": "tsc --noEmit",
  "format": "prettier --write .",
  "test": "vitest --run",
  "test:e2e": "playwright test"
}
```

## Final Directory Structure

```
├── app/
│   ├── layout.tsx              # Root layout with CSS
│   ├── page.tsx                # Home page
│   ├── characters/
│   │   ├── Azamat/page.tsx
│   │   ├── Jacob/page.tsx
│   │   └── Adrik/page.tsx
│   ├── classes/
│   │   ├── page.tsx            # Classes index
│   │   └── [class]/page.tsx    # Dynamic class pages
│   ├── subclasses/
│   │   └── [subclass]/page.tsx
│   └── critical-role/
│       ├── page.tsx            # CR index
│       └── [character]/page.tsx
├── src/
│   ├── components/             # Shared components
│   ├── js/                     # Business logic
│   └── styles/
├── public/
├── next.config.js
├── tsconfig.json
└── package.json
```

## Deployment

Update `.github/workflows/deploy.yml`:

- Replace `withastro/action` with Next.js build
- Build command: `next build`
- Output directory: `out/` (from `output: 'export'`)
