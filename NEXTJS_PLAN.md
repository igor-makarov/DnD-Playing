# Astro → Next.js Migration Plan (Pages Router)

## Overview

Migrate from Astro to Next.js Pages Router for a D&D Character Sheet application. The project uses React components with URL-based state management and static site generation.

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

Update to remove Astro extension, keep path aliases.

## Routing Migration

| Astro | Next.js Pages Router |
|-------|---------------------|
| `src/pages/index.astro` | `pages/index.tsx` |
| `src/pages/characters/Azamat.astro` | `pages/characters/Azamat.tsx` |
| `src/pages/characters/Jacob.astro` | `pages/characters/Jacob.tsx` |
| `src/pages/characters/Adrik.astro` | `pages/characters/Adrik.tsx` |
| `src/pages/classes/index.astro` | `pages/classes/index.tsx` |
| `src/pages/classes/[class].astro` | `pages/classes/[class].tsx` |
| `src/pages/subclasses/[subclass].astro` | `pages/subclasses/[subclass].tsx` |
| `src/pages/critical-role/index.astro` | `pages/critical-role/index.tsx` |
| `src/pages/critical-role/[character].astro` | `pages/critical-role/[character].tsx` |
| `src/layouts/ReferenceLayout.astro` | `src/components/Layout.tsx` |

## Page Structure Pattern

### Static Page

```tsx
// pages/characters/Azamat.tsx
import type { GetStaticProps } from 'next'
import Layout from '@/components/Layout'

interface Props {
  // props from getStaticProps
}

export default function AzamatPage(props: Props) {
  return (
    <Layout title="Azamat">
      {/* content */}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return { props: { /* ... */ } }
}
```

### Dynamic Page

```tsx
// pages/classes/[class].tsx
import type { GetStaticPaths, GetStaticProps } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const classes = collectAllClassReferences()
  return {
    paths: classes.map(c => ({ params: { class: `${c.name}-${c.source}` } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // load class data
  return { props: { /* ... */ } }
}

export default function ClassPage(props: Props) {
  return (
    <Layout title={props.className}>
      {/* content */}
    </Layout>
  )
}
```

## Layout Structure

**No shared layout wrapper** - each page is self-contained (like current Astro setup).

### pages/_app.tsx

Just imports global CSS:

```tsx
import '@/styles/style.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

### Character Pages (self-contained)

Each character page has its own structure with `next/head`:

```tsx
// pages/characters/Azamat.tsx
import Head from 'next/head'

export default function AzamatPage() {
  return (
    <>
      <Head>
        <title>{process.env.NODE_ENV === 'development' ? '[dev] ' : ''}Azamat</title>
        <base target="_blank" />
      </Head>
      <div className="row six-across">
        {/* content */}
      </div>
    </>
  )
}
```

### src/components/ReferenceLayout.tsx (class/subclass pages only)

Small wrapper component only for class/subclass reference pages:

```tsx
import Head from 'next/head'

interface Props {
  title: string
  children: React.ReactNode
}

export default function ReferenceLayout({ title, children }: Props) {
  return (
    <>
      <Head>
        <title>{process.env.NODE_ENV === 'development' ? '[dev] ' : ''}{title}</title>
      </Head>
      <div className="info-tooltip-dialog" style={{ margin: '0 auto' }}>
        {children}
      </div>
    </>
  )
}
```

## Component Migration

### Astro Components → React

| Astro File | React File |
|------------|------------|
| `ReferenceLayout.astro` | `src/components/ReferenceLayout.tsx` (class/subclass only) |
| `AbilitiesTable.astro` | `src/components/AbilitiesTable.tsx` |
| `SkillsTable.astro` | `src/components/SkillsTable.tsx` |
| `SavesTable.astro` | `src/components/SavesTable.tsx` |
| `SaveRow.astro` | `src/components/SaveRow.tsx` |
| `SkillRow.astro` | `src/components/SkillRow.tsx` |
| `WeaponAttackTable.astro` | Merge into existing React component |
| `SpellSlotsTables.astro` | `src/components/SpellSlotsTables.tsx` |
| `Link.astro` | `src/components/Link.tsx` (use `next/link`) |

### Hydration Changes

Remove Astro `client:load` directives - everything is React:

```diff
- <HitPointsInput client:load {...props} />
+ <HitPointsInput {...props} />
```

## What Stays the Same

- **URL query state management** - Custom store system in `src/js/stores/primitives/`
- **Static data loading** - SSG via `getStaticProps` / `getStaticPaths`
- **React components** - All existing `.tsx` components
- **Character logic** - `src/js/character/` unchanged
- **Utilities** - `src/js/utils/` mostly unchanged
- **CSS** - `src/styles/style.css` (import in `_app.tsx`)
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
├── pages/
│   ├── _app.tsx
│   ├── index.tsx
│   ├── characters/
│   │   ├── Azamat.tsx
│   │   ├── Jacob.tsx
│   │   └── Adrik.tsx
│   ├── classes/
│   │   ├── index.tsx
│   │   └── [class].tsx
│   ├── subclasses/
│   │   └── [subclass].tsx
│   └── critical-role/
│       ├── index.tsx
│       └── [character].tsx
├── src/
│   ├── components/
│   ├── js/
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
