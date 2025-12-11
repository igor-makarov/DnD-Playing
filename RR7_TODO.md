# React Router 7 Migration Checkpoints

Full plan: @RR7_PLAN.md

## Checkpoint 1: RR7 Bootstrapped [COMPLETE]

**Goal:** React Router 7 runs with a minimal page

- [x] Add RR7 dependencies (`@react-router/dev`, `@react-router/node`, `@react-router/serve`, `react-router`, `vite`)
- [x] Create `react-router.config.ts`
- [x] Create `vite.config.ts`
- [x] Update `tsconfig.json` (use `@tsconfig/vite-react` base)
- [x] Update `package.json` scripts
- [x] Create `src/app/root.tsx` (root layout with CSS import)
- [x] Create `src/app/routes.ts` (route configuration)
- [x] Create `src/app/routes/index.tsx` (home page)

**Verify:**
- [x] `npm run dev` starts on localhost:3000
- [x] Index page renders
- [x] `npm run build` succeeds with pre-rendering

---

## Checkpoint 2: First Character Page with Loader [COMPLETE]

**Goal:** One character page works with loader pattern for server-only code

- [x] Create `src/app/routes/characters/Azamat.tsx`
- [x] Move server-only imports (`renderHTML`, `getClass`, `getSpecies`) to `loader` function
- [x] Use `useLoaderData` to access pre-rendered data
- [x] Remove `.server.tsx` wrapper files (not needed in RR7)
- [x] Update component imports to use base components directly

**Verify:**
- [x] `/characters/Azamat` renders correctly
- [x] Server-only code (renderHTML, getClass, getSpecies) works via loader
- [x] Styling looks correct
- [x] `npm run build` succeeds with pre-rendering
- [x] `npm run check` passes

---

## Checkpoint 3: Interactive Components Work [COMPLETE]

**Goal:** Client-side state and interactivity function

- [x] Verify `HitPointsInput` works (URL state updates)
- [x] Verify `HitDiceTable` works
- [x] Verify `WeaponAttackTable` works
- [x] Verify `SpellSlotsTables` works
- [x] Verify keyboard modifiers (A/D/S/C) work for rolls

**Verify:**
- [x] Change HP → URL query param updates
- [x] Refresh page → state persists from URL
- [x] Click roll links → correct dice roller URLs
- [x] `npm test` passes

---

## Checkpoint 4: All Static Pages [COMPLETE]

**Goal:** All non-dynamic pages work

- [x] Create `src/app/routes/characters/Jacob.tsx`
- [x] Create `src/app/routes/characters/Adrik.tsx`
- [x] Create `src/app/routes/classes/index.tsx` (classes index)
- [x] Create `src/app/routes/critical-role/index.tsx` (CR index)
- [x] Update main `index.tsx` with navigation links
- [x] Create Critical Role character pages (static)
- [x] Update `routes.ts` with all routes (now auto-discovers)
- [x] Update `prerender` config with all static paths (now uses `getStaticPaths()`)

**Verify:**
- [x] All static pages render
- [x] Navigation between pages works
- [x] `npm run build` succeeds

---

## Checkpoint 5: Dynamic Routes [COMPLETE]

**Goal:** Dynamic routes with pre-rendering work

- [x] Create `src/app/routes/classes/$class.tsx` with loader
- [x] Create `src/app/routes/subclasses/$subclass.tsx` with loader
- [x] Update `prerender` config to generate all dynamic paths
- [x] Update `routes.ts` to handle `$param` → `:param` conversion

**Verify:**
- [x] `/classes/Fighter-XPHB` renders
- [x] `/subclasses/Warlock-XPHB-Fiend-XPHB` renders
- [x] `npm run build` generates all static pages
- [x] Check `build/client/` folder has expected structure

---

## Checkpoint 6: E2E Tests Pass [COMPLETE]

**Goal:** Full functionality verified

- [x] E2E tests already pass (configured in previous checkpoints)

**Verify:**
- [x] `npm run test:e2e` passes all tests (36 passed)

---

## Checkpoint 7: Deployment Ready [COMPLETE]

**Goal:** GitHub Pages deployment works

- [x] Update `.github/workflows/deploy.yml` for RR7
- [x] Remove Next.js dependencies from `package.json`
- [x] Remove Astro dependencies from `package.json`
- [x] Delete old files (`astro.config.mjs`, `src/pages/`, `src/layouts/`, `.astro` components)
- [x] Clean up unused code (`.prettierrc`, `collectClasses.ts`, `collectSubclasses.ts`)

**Verify:**
- [x] `npm run format` passes
- [x] `npm run check` passes
- [x] `npm run build` succeeds
- [x] `npm test` passes (51 tests)
- [x] `npm run test:e2e` passes (36 tests)
- [ ] Push to branch → GitHub Actions succeeds
- [ ] Live site works
