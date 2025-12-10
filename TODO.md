# Next.js Migration Checkpoints (App Router)

## Checkpoint 1: Next.js Bootstrapped [COMPLETE]

**Goal:** Next.js runs with a minimal page

- [x] Add `next` dependency
- [x] Create `next.config.js`
- [x] Update `tsconfig.json` (use `@tsconfig/next` base)
- [x] Update `package.json` scripts

**Verify:**
- [x] `npm run dev` starts on localhost:3000
- [x] `npm run build` succeeds

---

## Checkpoint 1.5: Switch to App Router

**Goal:** Migrate from Pages Router to App Router

- [ ] Create `app/layout.tsx` (root layout with CSS import)
- [ ] Create `app/page.tsx` (minimal placeholder)
- [ ] Delete `pages/` directory
- [ ] Verify dev server works with App Router

**Verify:**
- [ ] `npm run dev` starts
- [ ] Index page renders
- [ ] `npm run build` succeeds

---

## Checkpoint 2: First Character Page (RSC)

**Goal:** One character page works with Server Components

- [ ] Create `app/characters/Azamat/page.tsx` as Server Component
- [ ] Add `"use client"` to interactive components:
  - [ ] `HitPointsInput`
  - [ ] `HitDiceTable`
  - [ ] `D20TestCell`
  - [ ] `WeaponAttackTable`
  - [ ] `SpellSlotsTable`
  - [ ] `WarlockSpellSlotsTable`
  - [ ] `InfoTooltip`
  - [ ] `ChannelDivinityCheckboxes`
  - [ ] `LayOnHandsInput`
  - [ ] `LevelledSpellLevelSelector`
  - [ ] `LevelledSpellDamageCell`
- [ ] Convert Astro components to React:
  - [ ] `AbilitiesTable.astro` → `AbilitiesTable.tsx`
  - [ ] `SkillsTable.astro` → `SkillsTable.tsx`
  - [ ] `SavesTable.astro` → `SavesTable.tsx`
  - [ ] `SaveRow.astro` → `SaveRow.tsx`
  - [ ] `SkillRow.astro` → `SkillRow.tsx`
  - [ ] `SpellSlotsTables.astro` → `SpellSlotsTables.tsx`
  - [ ] `LevelledSpellDamageRow.astro` → `LevelledSpellDamageRow.tsx`

**Verify:**
- [ ] `/characters/Azamat` renders correctly
- [ ] Server-only code (renderHTML, getClass, getSpecies) works
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

- [ ] Convert `app/page.tsx` (real home content)
- [ ] Create `app/characters/Jacob/page.tsx`
- [ ] Create `app/characters/Adrik/page.tsx`
- [ ] Create `app/classes/page.tsx` (classes index)
- [ ] Create `app/critical-role/page.tsx` (CR index)
- [ ] Create `src/components/Link.tsx` using `next/link`

**Verify:**
- [ ] All static pages render
- [ ] Navigation between pages works
- [ ] `npm run build` succeeds

---

## Checkpoint 5: Dynamic Routes

**Goal:** `generateStaticParams` pages generate correctly

- [ ] Create `app/classes/[class]/page.tsx` with `generateStaticParams`
- [ ] Create `app/subclasses/[subclass]/page.tsx` with `generateStaticParams`
- [ ] Create `app/critical-role/[character]/page.tsx` with `generateStaticParams`
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
