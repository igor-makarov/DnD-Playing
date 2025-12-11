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

## Checkpoint 4: All Static Pages

**Goal:** All non-dynamic pages work

- [ ] Create `src/app/routes/characters/Jacob.tsx`
- [ ] Create `src/app/routes/characters/Adrik.tsx`
- [ ] Create `src/app/routes/classes/index.tsx` (classes index)
- [ ] Create `src/app/routes/critical-role/index.tsx` (CR index)
- [ ] Update `routes.ts` with all routes
- [ ] Update `prerender` config with all static paths

**Verify:**
- [ ] All static pages render
- [ ] Navigation between pages works
- [ ] `npm run build` succeeds

---

## Checkpoint 5: Dynamic Routes

**Goal:** Dynamic routes with pre-rendering work

- [ ] Create `src/app/routes/classes/$class.tsx` with loader
- [ ] Create `src/app/routes/subclasses/$subclass.tsx` with loader
- [ ] Create `src/app/routes/critical-role/$character.tsx` with loader
- [ ] Update `prerender` config to generate all dynamic paths

**Verify:**
- [ ] `/classes/Fighter-XPHB` renders
- [ ] `/subclasses/Fighter-XPHB-Champion-XPHB` renders
- [ ] `/critical-role/[character]` renders
- [ ] `npm run build` generates all static pages
- [ ] Check `build/client/` folder has expected structure

---

## Checkpoint 6: E2E Tests Pass

**Goal:** Full functionality verified

- [ ] Update `playwright.config.ts` (port, start command)
- [ ] Fix any test selectors if needed

**Verify:**
- [ ] `npm run test:e2e` passes all tests

---

## Checkpoint 7: Deployment Ready

**Goal:** GitHub Pages deployment works

- [ ] Update `.github/workflows/deploy.yml` for RR7
- [ ] Remove Next.js dependencies from `package.json`
- [ ] Remove Astro dependencies from `package.json`
- [ ] Delete old files (`next.config.js`, `src/app/layout.tsx`, `src/app/page.tsx`, etc.)
- [ ] Clean up unused code

**Verify:**
- [ ] `npm run format` passes
- [ ] `npm run check` passes
- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `npm run test:e2e` passes
- [ ] Push to branch → GitHub Actions succeeds
- [ ] Live site works
