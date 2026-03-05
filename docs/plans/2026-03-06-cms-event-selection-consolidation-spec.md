# CMS Event Selection Consolidation Spec

**Goal:** Consolidate event selection into a reusable select-field pattern, aligned with how link metadata is centralized, while keeping current behavior unchanged.

**Status:** Draft v1 (needs @kai validation)

## 1. Current State (Code-Verified)

- Event selection UI lives in `fe/cms/src/components/RichForm/RichForm.tsx` (`EventField`).
- `EventField` already uses shared `SelectComponent` from `@lib/ui`.
- `EventField` currently owns three concerns in one component:
  - Data fetch (`trpc.eventArtist.getAllEvent.useQuery()`)
  - Default-selection side effect (`useEffect` picks first event)
  - Select rendering + option mapping (`id/name -> value/text`)
- Link metadata is centralized in `fe/cms/src/components/RichForm/type/LinkFormSchema.ts` via `AllAvailableLinkType`, `LinkTypeEnum`, and label mapping (`GetLinkLabelFromKey`).

## 2. Problem

Event selection behavior is currently coupled to one UI component (`EventField`), making it harder to reuse, test, and keep consistent if additional event pickers are added later.

## 3. Design Options

### Option A: Keep current `EventField`, only tidy internals
- Lowest effort.
- Leaves query/defaulting/rendering coupled.

### Option B (Recommended): Introduce reusable CMS select field + thin event wrapper
- Add a generic CMS form select wrapper.
- Keep event-specific data fetching/default logic in a dedicated event hook/wrapper.
- Aligns with link pattern: one source of truth + thin UI composition.

### Option C: Broad form-system rewrite for all selects and links
- Highest consistency, highest risk.
- Too large for current request.

## 4. Selected Approach

Choose **Option B**.

This gives immediate consolidation for event selection and a clear path to reuse for future select-style fields without rewriting unrelated form areas.

## 5. Scope

### In Scope

- Extract a reusable form select primitive for CMS forms.
- Move event option mapping/defaulting logic out of inline JSX where practical.
- Keep existing event-selection UX and submission contract (`eventId: number`).

### Out of Scope

- Backend/TRPC changes.
- Changing link input UX to dropdown-based editing.
- Broad refactor of all form components.

## 6. Proposed Technical Design

### 6.1 New/Updated Components

- Add reusable select form field in CMS layer:
  - Suggested path: `fe/cms/src/components/Forms/subcomponent/FormSelect.tsx`
- Keep/rename event-specific wrapper:
  - Suggested path: `fe/cms/src/components/RichForm/EventField.tsx`
  - Responsibilities:
    - fetch events (`getAllEvent`)
    - enforce default event selection if value missing
    - pass normalized options into `FormSelect`

### 6.2 Data Contract

- Event API input remains unchanged (`getAllEvent`).
- Internal normalized option shape:
  - `{ value: string, label: string }`
- Form value behavior:
  - UI emits string from select.
  - Wrapper converts to `number` for `react-hook-form` `eventId`.

### 6.3 State Behavior

- Loading: select disabled (or skeleton placeholder label).
- Empty event list: select disabled + explicit empty label.
- Missing selected event after refetch: reset to first available event (same defaulting rule as today).
- Error: keep current field validation handling and surface minimal inline message.

## 7. File Impact (Expected)

- `fe/cms/src/components/Forms/subcomponent/FormSelect.tsx` (new)
- `fe/cms/src/components/Forms/subcomponent/index.ts` (export new subcomponent)
- `fe/cms/src/components/Forms/Forms.tsx` (expose `Forms.Select` if needed)
- `fe/cms/src/components/RichForm/RichForm.tsx` (remove inlined select rendering; consume wrapper)
- `fe/cms/src/components/index.ts` / barrel exports as needed

## 8. Acceptance Criteria

1. Event picker still renders as a dropdown with the same selectable events and labels.
2. Default event selection behavior is preserved when no value is set.
3. Form submits `eventId` as `number` exactly as before.
4. Event option mapping is no longer duplicated/inlined in form JSX.
5. Loading/empty states are explicit and non-crashing.

## 9. Validation Checklist (Pre-Implementation)

- Confirm whether any event picker exists outside `EventField` that should migrate in the same change.
- Confirm desired empty-state copy for no events available.
- Confirm whether to expose generic `Forms.Select` publicly now, or keep internal until second use.

## 10. Rollout Notes

- This refactor is UI-layer only and can be shipped without schema/API migration.
- Low risk if wrapper preserves `eventId` number conversion and default-selection semantics.
