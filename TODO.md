# Next.js Migration Checkpoints

## Checkpoint 1: Next.js Bootstrapped

**Goal:** Next.js runs with a minimal page

- [ ] Add `next` dependency
- [ ] Create `next.config.js`
- [ ] Update `tsconfig.json` (remove Astro extension)
- [ ] Create `pages/_app.tsx` with global CSS import
- [ ] Create `pages/index.tsx` (minimal placeholder)
- [ ] Update `package.json` scripts

**Verify:**
- [ ] `npm run dev` starts on localhost:3000
- [ ] Index page renders
- [ ] `npm run build` succeeds

---

## Checkpoint 2: First Static Page

**Goal:** One character page works end-to-end

- [ ] Convert `pages/characters/Azamat.astro` → `pages/characters/Azamat.tsx`
- [ ] Convert `AbilitiesTable.astro` → React
- [ ] Convert `SkillsTable.astro` → React
- [ ] Convert `SavesTable.astro` → React
- [ ] Convert `SaveRow.astro` → React
- [ ] Convert `SkillRow.astro` → React
- [ ] Convert `SpellSlotsTables.astro` → React
- [ ] Convert `WeaponAttackTable.astro` → React
- [ ] Convert `LevelledSpellDamageRow.astro` → React

**Verify:**
- [ ] `/characters/Azamat` renders correctly
- [ ] Styling looks correct
- [ ] `npm run build` succeeds

---

## Checkpoint 3: Interactive Components Work

**Goal:** Client-side state and interactivity function

- [ ] Verify `HitPointsInput` works (URL state updates)
- [ ] Verify `HitDiceTable` works
- [ ] Verify `WeaponAttackTable` works
- [ ] Verify `SpellSlotsTables` works
- [ ] Verify keyboard modifiers (A/D/S/C) work for rolls

**Verify:**
- [ ] Change HP → URL query param updates
- [ ] Refresh page → state persists from URL
- [ ] Click roll links → correct dice roller URLs
- [ ] `npm test` passes

---

## Checkpoint 4: All Static Pages

**Goal:** All non-dynamic pages work

- [ ] Convert `pages/index.tsx` (real content)
- [ ] Convert `pages/characters/Jacob.tsx`
- [ ] Convert `pages/characters/Adrik.tsx`
- [ ] Convert `pages/classes/index.tsx`
- [ ] Convert `pages/critical-role/index.tsx`
- [ ] Convert `Link.astro` → `src/components/Link.tsx` using `next/link`

**Verify:**
- [ ] All static pages render
- [ ] Navigation between pages works
- [ ] `npm run build` succeeds

---

## Checkpoint 5: Dynamic Routes

**Goal:** `getStaticPaths` pages generate correctly

- [ ] Create `src/components/ReferenceLayout.tsx` (for class/subclass pages)
- [ ] Convert `pages/classes/[class].tsx` with `getStaticPaths`
- [ ] Convert `pages/subclasses/[subclass].tsx` with `getStaticPaths`
- [ ] Convert `pages/critical-role/[character].tsx` with `getStaticPaths`
- [ ] Update `routes.ts` for Next.js (if needed)

**Verify:**
- [ ] `/classes/Fighter-XPHB` renders
- [ ] `/subclasses/Fighter-XPHB-Champion-XPHB` renders
- [ ] `/critical-role/[character]` renders
- [ ] `npm run build` generates all static pages
- [ ] Check `out/` folder has expected structure

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

- [ ] Update `.github/workflows/deploy.yml` for Next.js
- [ ] Remove Astro dependencies from `package.json`
- [ ] Delete Astro files (`astro.config.mjs`, `src/pages/`, `src/layouts/`)
- [ ] Clean up unused Astro-related code

**Verify:**
- [ ] `npm run format` passes
- [ ] `npm run check` passes
- [ ] `npm run build` succeeds
- [ ] `npm test` passes
- [ ] `npm run test:e2e` passes
- [ ] Push to branch → GitHub Actions succeeds
- [ ] Live site works
