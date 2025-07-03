# FlashPDF – Deck Creation / Deletion Feature

> Status : **development pinned** – build currently fails due to eslint rules. _(See "Current blockers" below.)_

---

## 1. Overview
This iteration introduces manual creation & deletion of **Decks** (with nested Flashcards) plus a debug-user seeder.

Major work-streams:
1. **Backend API** – REST endpoints under `/api/decks` for POST (create) & DELETE (destroy).
2. **Service layer** – `src/services/deck.service.ts` handles Prisma queries & local draft-card helpers.
3. **Frontend** –
   • `/dashboard/create` page now builds the deck in client state then persists via API.
   • Deck cards gain a *Delete* menu action.
   • Pages refactored to use `DeckWithFlashcards` type and Supabase auth context.
4. **Seeder** – `prisma/seed.ts` adds a Debug User via `npm run seed`.

---

## 2. Detailed file changes

### 2.1  `src/services/deck.service.ts`
| Lines | Change |
| ----: | ------ |
| 1-3   | Removed direct `Flashcard` type export (no longer required). |
| 9-24  | Added **`DeckWithFlashcards`** Prisma helper type. |
| 26-61 | Added **`createDeck(userId, data)`** – creates deck & related flashcards in one transaction. |
| 63-84 | Added **`deleteDeck(userId, deckId)`** – verifies ownership before delete. |
| 86-107| Introduced `DraftFlashcard` + rewrote `addFlashcard`, `removeFlashcard`, `updateFlashcard`. |

### 2.2 API routes
| File | Purpose |
| ---- | ------- |
| `src/app/api/decks/route.ts` | `POST /api/decks` – validates payload (≥2 cards) then calls `createDeck`. Returns 201 JSON deck. |
| `src/app/api/decks/[id]/route.ts` | `DELETE /api/decks/:id` – owner check → deleteDeck. Returns `{ ok: true }` or 404/401. |

### 2.3 Front-end pages / components
| File | Key modifications |
| --- | --- |
| `src/app/dashboard/create/page.tsx` | • Uses draft-card helpers.
• Client-side form validation.
• `fetch('/api/decks', {POST…})` then `router.push('/dashboard')`. |
| `src/components/deck.tsx` | • Added `"use client"`.
• Delete menu-item – calls DELETE route, refreshes dashboard. |
| `src/components/decks-section.tsx` | Type import switched to `DeckWithFlashcards`. |
| `src/app/dashboard/page.tsx` | Fetches decks for current Supabase user via `getDecks`. |
| `src/app/dashboard/decks/[id]/page.tsx` & `edit/page.tsx` | Similar user-context fetch & type updates. |
| `src/app/dashboard/decks/[id]/edit/edit-deck-form.tsx` | DraftFlashcard typing, helper usage. |

### 2.4 Seeder & package scripts
| File | Notes |
| ---- | ----- |
| `prisma/seed.ts` | Upserts debug user (`DEBUG_USER_ID` env-var or default `debug-user-id`). |
| `package.json` | Added script `"seed": "ts-node prisma/seed.ts"` + dev-dep `ts-node`. |

---

## 3. Usage instructions

```bash
# 1. Install deps & env
npm install

# 2. Run database migrations
npx prisma generate
npx prisma migrate dev

# 3. Seed debug user (optional)
DEBUG_USER_ID=debug-user-id npm run seed

# 4. Start development server (eslint blocking can be skipped)
NEXT_ESLINT_IGNORE=true npm run dev
# or build ignoring lint
NEXT_ESLINT_IGNORE=true npm run build
```

### Creating a deck
1. Navigate to `/dashboard/create` while signed-in.
2. Fill title, description, add **≥2** flashcards, hit *Save Flashcard Set*.
3. You're redirected to `/dashboard`; new deck is visible.

### Deleting a deck
1. On `/dashboard`, open deck's kebab-menu → *Delete*.
2. Confirmation dialog → deck removed, list refreshes.

---

## 4. Current blockers
*Running `npm run build` fails due to ESLint "error" severity*. Primary offenders:
1. Thousands of `no-unused-expressions` & `no-unused-vars` inside **generated Prisma WASM/client** bundles.
2. Minor unused variable (`options`) in `src/utils/supabase/middleware.ts`.

### Options to resolve
1. **Disable ESLint during builds** temporarily: `NEXT_ESLINT_IGNORE=true` env flag.
2. **Adjust `.eslintignore`** to ignore `src/generated/prisma/**` & runtime files.
3. Fix remaining unused vars / tailor ruleset (e.g., set problematic rules to "warn").

---

## 5. To-do / future work
- Persist edits in deck edit form (`/dashboard/decks/[id]/edit`).
- Add study session logic & progress tracking.
- Improve error handling + toast notifications.
- CI step to lint excluding generated code.

---

*Document generated on {{date}} during development pin.*
