# Douren v2 Layout Decoupling Spec: Event Context Bar

**Goal:** Decouple global page layout from event-specific UI by moving the event selector out of the global header into an event-only context bar.

**Status:** Draft v1 (selected direction: Option 2, two-tier header).

## 0. Worktree Initialization

Before implementation in a fresh worktree, initialize the repository:

```bash
./setup.sh
```

This ensures dependencies, environment bindings, package builds, and codegen are ready.

## 1. Current State (Code-Verified)

- Root layout is globally event-aware in `fe/douren-v2/src/routes/__root.tsx`.
  - Fetches all events and derives `selectedEvent`.
  - Passes event data into `Layout.Header`.
- `Layout.Header` currently includes:
  - Event selector dropdown.
  - Event nav tabs (`所有創作者`, `我的收藏`).
  - Logic keyed by event route/bookmarks state.
  - File: `fe/douren-v2/src/components/layout/Layout.tsx`.
- Current route tree is event-only (`/events/$eventName`, `/events/$eventName/bookmarks`), which reinforces event-first layout assumptions.

## 2. Problem Statement

The global layout is currently event-driven. This makes future non-event experiences harder to introduce because the top-level header assumes event context (selected event, event switch behavior, event tabs) even though that context is not universally applicable.

## 3. Selected Approach

### Option Chosen: Two-Tier Header

1. Keep a **global header** focused on brand/global controls.
2. Move event selector + event-level navigation into a separate **Event Context Bar**.
3. Render Event Context Bar only on event routes (`/events/*`).

This keeps visual continuity while removing event coupling from the global shell.

## 4. Scope

### In Scope

- Layout restructuring only.
- Event selector relocation from global header to event-only context bar.
- Event-level nav relocation (`所有創作者`, `我的收藏`) to event-only context bar.
- Route-aware visibility logic for context bar.

### Out of Scope

- Creating a new non-event page.
- Directory filter/day/pagination redesign.
- Bookmark data model changes.
- Backend API changes.

## 5. UX Spec

### 5.1 Global Header (All Routes)

- Always visible.
- Contains:
  - Logo/title.
  - Global descriptive subtitle.
  - Dark mode toggle.
- Does **not** contain:
  - Event selector.
  - Event list navigation tabs.

### 5.2 Event Context Bar (Event Routes Only)

- Visible only when route is under `/events/*`.
- Contains:
  - Event selector dropdown.
  - Event-scoped navigation tabs:
    - `/events/$eventName`
    - `/events/$eventName/bookmarks`
- Behavior:
  - Changing selector navigates within event route namespace.
  - Maintains bookmark/list tab where possible.
- v1 position behavior:
  - Non-sticky (normal document flow) to minimize implementation risk.

## 6. Technical Design

### 6.1 Component Structure

- Split existing `Layout.Header` into:
  - `Layout.GlobalHeader` (route-agnostic).
  - `Layout.EventContextBar` (event-route-only).
- Keep `Layout.Root`, `Layout.Footer`, `Layout.Banner` unchanged.

### 6.2 Route-Aware Rendering

- In `__root.tsx`:
  - Continue deriving current pathname.
  - Determine `isEventRoute` via path prefix check (`/events/`).
  - Render:
    - `Layout.GlobalHeader` always.
    - `Layout.EventContextBar` only when `isEventRoute && selectedEvent`.

### 6.3 Data Flow

- Root route still owns event fetch and selected event derivation for event pages.
- `EventContextBar` receives:
  - `events`
  - `selectedEvent`
  - `onEventChange`
  - `isBookmarks`
- Global header only receives global concerns (`isDark`, toggle handler, static text/branding).

### 6.4 Navigation Rules

- `onEventChange` preserves current event sub-view:
  - If in bookmarks, navigate to `/events/$eventName/bookmarks`.
  - Else navigate to `/events/$eventName`.
- Invalid event route correction logic in page routes remains unchanged.

## 7. Files Likely Touched

- `fe/douren-v2/src/components/layout/Layout.tsx`
- `fe/douren-v2/src/routes/__root.tsx`
- `fe/douren-v2/src/components/layout/Layout.test.ts`

## 8. Acceptance Criteria

1. Global header renders on all routes without event selector or event tabs.
2. Event context bar renders on `/events/$eventName` and `/events/$eventName/bookmarks`.
3. Event context bar does not render on non-event routes.
4. Event selector still switches events correctly.
5. Event tab highlighting still reflects list vs bookmarks route.
6. Existing directory content (filters/day tabs/pagination/cards) remains unchanged.

## 9. Test Plan

- Unit/component checks:
  - Header assertions for absence of event controls.
  - Event context bar renders only for event route path.
  - Event selector change navigates with expected target.
  - Bookmark/list tab active-state logic remains correct.
- Manual checks:
  - `/events/<valid>/` shows global header + event context bar.
  - `/events/<valid>/bookmarks` shows global header + event context bar.
  - Event switching preserves current sub-route type.

## 10. Risks and Mitigations

- Risk: visual hierarchy feels too segmented after split.
  - Mitigation: keep typography and spacing tokens consistent between global header and context bar.
- Risk: duplicated path logic between root/layout and route pages.
  - Mitigation: centralize `isEventRoute` and tab-state derivation in root/layout layer.

## 11. Future Compatibility

This change prepares for non-event pages by ensuring the base layout no longer requires event context. Future routes can use `Layout.GlobalHeader` directly and opt out of `Layout.EventContextBar`.

