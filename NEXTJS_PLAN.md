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
| `src/pages/index.astro` | `src/app/page.tsx` |
| `src/pages/characters/Azamat.astro` | `src/app/characters/Azamat/page.tsx` |
| `src/pages/characters/Jacob.astro` | `src/app/characters/Jacob/page.tsx` |
| `src/pages/characters/Adrik.astro` | `src/app/characters/Adrik/page.tsx` |
| `src/pages/classes/index.astro` | `src/app/classes/page.tsx` |
| `src/pages/classes/[class].astro` | `src/app/classes/[class]/page.tsx` |
| `src/pages/subclasses/[subclass].astro` | `src/app/subclasses/[subclass]/page.tsx` |
| `src/pages/critical-role/index.astro` | `src/app/critical-role/page.tsx` |
| `src/pages/critical-role/[character].astro` | `src/app/critical-role/[character]/page.tsx` |
| `src/layouts/ReferenceLayout.astro` | `src/app/classes/layout.tsx` or component |

## Server vs Client Components

### Server Components (default)

Pages are Server Components by default - Node.js code runs at build time:

```tsx
// src/app/characters/Azamat/page.tsx (Server Component)
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

### Client Components with Rehydration Pattern

For components that need both:
1. Rich props (class instances like `D20Test`, `DiceString`) from Server Components
2. Client-side interactivity (`useState`, `useEffect`, browser APIs)

Use the **Server/Client wrapper pattern** with `withAutoRehydration`:

```tsx
// src/components/common/D20TestCell.tsx (Server Component - entry point)
import { D20Test } from "@/js/common/D20Test";
import { withAutoRehydration } from "@/js/utils/rehydration/withAutoRehydration";
import D20TestCellClient from "./D20TestCell.client";

export interface Props {
  roll: D20Test;  // Class instance - will be dehydrated
  advantage?: boolean;
}

const D20TestCell: React.FC<Props> = withAutoRehydration(D20TestCellClient);
export default D20TestCell;
```

```tsx
// src/components/common/D20TestCell.client.tsx (Client Component)
"use client";
import type { Props } from "./D20TestCell";

export default function D20TestCellClient({ roll, advantage = false }: Props) {
  // roll is rehydrated back to D20Test class instance
  const bonus = roll.getBonus();  // Methods work!
  // ... interactive logic with hooks
}
```

**How it works:**
1. `withAutoRehydration` wraps the client component in `ServerWrapper`
2. `ServerWrapper` (RSC) calls `dehydrate(props)` to serialize class instances to JSON
3. `ClientWrapper` (`"use client"`) calls `rehydrate(props)` to restore class instances
4. The client component receives fully functional class instances

**Pattern applies to:**
- `D20TestCell` - receives `D20Test` class, uses keyboard modifier hooks
- `AttackDamageCell` - receives `DiceString` class
- Components receiving class instances that need client interactivity

**Simple Client Components (no rehydration needed):**
- `HitPointsInput` - URL state, no class instances
- `HitDiceTable` - URL state
- `SpellSlotsTable` - URL state
- `InfoTooltip` - dialog interaction
- Components that only receive primitive props

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
// src/app/characters/Azamat/page.tsx
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
// src/app/classes/[class]/page.tsx
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

Remove Astro `client:load` directives - Next.js handles hydration automatically:

```diff
- <HitPointsInput client:load {...props} />
+ <HitPointsInput {...props} />  // Component has "use client" directive internally
```

For components receiving class instances, the `withAutoRehydration` HOC handles serialization:

```diff
- <D20TestCell client:load roll={d20Test} />
+ <D20TestCell roll={d20Test} />  // Uses withAutoRehydration pattern
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
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with CSS
│   │   ├── page.tsx                # Home page
│   │   ├── characters/
│   │   │   ├── Azamat/page.tsx
│   │   │   ├── Jacob/page.tsx
│   │   │   └── Adrik/page.tsx
│   │   ├── classes/
│   │   │   ├── page.tsx            # Classes index
│   │   │   └── [class]/page.tsx    # Dynamic class pages
│   │   ├── subclasses/
│   │   │   └── [subclass]/page.tsx
│   │   └── critical-role/
│   │       ├── page.tsx            # CR index
│   │       └── [character]/page.tsx
│   ├── components/                 # Shared components
│   ├── js/                         # Business logic
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
