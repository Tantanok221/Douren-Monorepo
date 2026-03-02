# Booth-First Backend/CMS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add first-class booth support so one booth can contain multiple event artists, and update CMS submissions/edits to create and manage booth-linked event artist memberships.

**Architecture:** Introduce a new `booth` table keyed by event, add `booth_id` to `event_dm` (treated as event artist membership), and expose booth CRUD + booth-scoped membership routes in backend. Keep Douren v2 UI unchanged for now, but preserve compatibility with existing event artist list by deriving booth fields via joins. Update CMS step-2 payload from single `eventArtist` object to booth + membership-oriented data flow while retaining current 3-step UX.

**Tech Stack:** TypeScript, Drizzle ORM, Hono + tRPC, Zod, React Hook Form, Vitest.

---

### Task 1: Add failing backend tests for booth support

**Files:**
- Modify: `be/douren-backend/src/__tests__/Dao/EventArtist.test.ts`
- Modify: `be/douren-backend/src/__tests__/QueryBuilder/QueryBuilder.test.ts`
- Create: `be/douren-backend/src/__tests__/Dao/Booth.test.ts`

1. Add tests expecting event artist create/upsert to require/use `boothId`.
2. Add tests expecting query builder to join booth table for booth name/day locations.
3. Add booth DAO tests for `Create`, `Update`, `Delete`, `FetchByEventId`.
4. Run targeted tests and verify expected RED failures.

### Task 2: Implement DB/schema/zod types for booth

**Files:**
- Modify: `pkg/database/src/db/schema.ts`
- Modify: `pkg/type/src/model.ts`
- Modify: `pkg/database/src/zod/index.ts`
- Create: `pkg/database/src/zod/booth.ts`
- Create: `pkg/database/supabase/migrations/0016_booth_entity.sql`

1. Add `booth` table and relations.
2. Add `boothId` FK in `eventDm`.
3. Keep old booth columns temporarily for compatibility.
4. Add booth zod schemas and register in zod index.
5. Add SQL migration creating booth table and linking/backfilling `event_dm.booth_id`.

### Task 3: Implement backend booth DAO/routes

**Files:**
- Create: `be/douren-backend/src/Dao/Booth.ts`
- Modify: `be/douren-backend/src/Dao/index.ts`
- Modify: `be/douren-backend/src/schema/event.zod.ts`
- Modify: `be/douren-backend/src/routes/event.ts`
- Modify: `be/douren-backend/src/index.ts`

1. Add booth schemas for create/update/delete/get.
2. Add trpc procedures for booth management and booth memberships.
3. Add REST endpoints for booth CRUD.
4. Update event artist create/upsert flows to accept boothId.

### Task 4: Update query/DAO compatibility for event artist listing

**Files:**
- Modify: `be/douren-backend/src/QueryBuilder/index.ts`
- Modify: `be/douren-backend/src/Dao/EventArtist.ts`
- Modify: `pkg/type/src/model.ts`

1. Join `booth` in event artist query.
2. Read booth name/day location from booth table while retaining response shape.
3. Keep existing event artist endpoints functional for non-v2 clients.

### Task 5: Update CMS flow to submit booth + membership

**Files:**
- Modify: `fe/cms/src/components/EntityForm/schema/schema.ts`
- Modify: `fe/cms/src/components/EntityForm/eventartist.tsx`
- Modify: `fe/cms/src/components/EntityForm/constant.ts`
- Modify: `fe/cms/src/routes/new/index.tsx`
- Modify: `fe/cms/src/routes/edit.$artistId/index.tsx`
- Modify: `fe/cms/src/hooks/useNewArtistSubmission.ts`
- Modify: `fe/cms/src/hooks/useUpdateArtistSubmission.ts`
- Modify: `fe/cms/src/utils/transformData.ts`

1. Change step-2 form model to booth-first fields.
2. For create: create booth first, then create event artist with `boothId`.
3. For edit: resolve existing booth/membership and upsert membership with booth linkage.
4. Keep current screen layout as much as possible.

### Task 6: Verification

**Files:**
- N/A

1. Run targeted backend/CMS tests.
2. Run `pnpm run lint`, `pnpm run test`, `pnpm run build`.
3. Run dev server with `nr dev` via tmux/background and check:
   - `curl -s http://localhost:5173 | grep -q 'id="root"'`
   - `curl -s http://localhost:5174 | grep -q 'id="root"'`
4. Stop dev server session and report outcomes.
