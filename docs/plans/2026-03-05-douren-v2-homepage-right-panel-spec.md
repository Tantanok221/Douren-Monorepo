# Douren v2 Home Page Artist Card Right-Side Spec (Iteration 1)

**Goal:** Keep the homepage as a single artist list, but change each artist card so artist summary stays on the left and event artwork/DM information is shown on the right side of the card, without expanding downward.

**Status:** Draft v2 (updated from split-view assumption).

## 1. Current State (Code-Verified)

- Main listing route: `fe/douren-v2/src/routes/events/$eventName/index.tsx`
- Artist row currently renders:
  - `<ArtistCard.Summary />` (always visible)
  - `<ArtistCard.Details />` (inline expandable)
- Expand/collapse state is local (`isOpen`) in `fe/douren-v2/src/components/artist/ArtistCard/ArtistCardContext.tsx`.
- Details (`ArtistCardDetails.tsx`) animate height in-flow, which increases page height when opened.

## 2. Problem Statement

The card detail panel currently appears below the row and pushes content downward. Desired behavior is side-by-side information inside the same card row, not vertical expansion.

## 3. Product Premise for Iteration 1

- No page-level split view.
- The page remains a normal single list of artist cards.
- Inside each card:
  - left = artist summary info,
  - right = artwork/DM info for that event.
- Information should be visible in-card without requiring open/close expansion.

## 4. Options Considered

1. Keep current expandable details
- Minimal effort.
- Fails the requirement (still expands downward).

2. Page split view (list left, panel right)
- Works technically.
- Rejected by product direction.

3. In-card horizontal layout (Recommended)
- Matches requirement exactly.
- Keeps browsing context in one list flow.

Selected approach: **Option 3**.

## 5. Scope (In)

- Desktop/tablet (`md+`): each artist card becomes a two-column internal layout.
- Remove card-level expand/collapse interaction for this view.
- Right side contains:
  - event DM/booth location block,
  - artwork preview area.
- Keep filtering/search/day tabs/pagination behavior unchanged.

## 6. Scope (Out for Iteration 1)

- Major visual redesign of header/layout.
- Backend contract changes (unless required in later iteration for richer artwork data).
- Deep-linking selected artist states.

## 7. UX Behavior Spec

### 7.1 Desktop/Tablet (`md+`)
- Each card uses a horizontal structure (example ratio: left 5 / right 7).
- Card height remains stable; no animated open/close height transition.
- Left side includes current summary content:
  - avatar, artist name, handle,
  - tags,
  - social links,
  - basic booth/day location labels.
- Right side includes:
  - emphasized event DM/booth location summary,
  - artwork thumbnails grid (or placeholder if unavailable).

### 7.2 Mobile (`< md`)
- Allow stacked layout inside card (left content first, right content below) for readability.
- Still no expand/collapse interaction in Iteration 1.

## 8. Technical Design

### 8.1 Component Strategy
- Keep `ArtistCard.Root` as wrapper.
- Refactor rendering responsibility:
  - `ArtistCard.Summary` becomes left-column content.
  - `ArtistCard.Details` is replaced or transformed into right-column static content (non-collapsible).
- Remove `isOpen` dependency from the homepage card interaction path.

### 8.2 State and Interaction
- Remove plus/minus toggle behavior from summary row on homepage cards.
- Keep bookmark toggle behavior unchanged.
- Ensure social/bookmark clicks do not trigger unwanted card-level actions.

### 8.3 Data Strategy (UI-first)
- Iteration 1 is UI-first:
  - prioritize structural layout with currently available event/artist data.
  - if artwork data is missing per list item, show a clear placeholder state in right column.
- Next iteration can decide whether to:
  - enrich list API payload with artwork previews, or
  - fetch lightweight detail data per visible card.

### 8.4 Files Likely Touched
- `fe/douren-v2/src/components/artist/ArtistCard/ArtistCardSummary.tsx`
- `fe/douren-v2/src/components/artist/ArtistCard/ArtistCardDetails.tsx` (or replacement component)
- `fe/douren-v2/src/components/artist/ArtistCard/ArtistCardContext.tsx`
- `fe/douren-v2/src/routes/events/$eventName/index.tsx`

## 9. Acceptance Criteria

1. Artist cards no longer expand downward on click.
2. Each desktop card shows left-side artist summary and right-side artwork/DM area simultaneously.
3. Bookmark behavior still works as before.
4. Filters/search/day tabs/pagination continue to work unchanged.
5. Right-side artwork area shows valid empty placeholder if artwork data is unavailable.
6. No regressions in route loading/error states.

## 10. Test Plan (Iteration 1)

- Component tests:
  - card renders two-column structure on desktop classes.
  - plus/minus toggle is not rendered.
  - bookmark control still toggles correctly.
  - right-column empty-state renders when artworks are absent.
- Route-level checks:
  - list queries/filtering/pagination continue functioning.
- Manual checks:
  - scroll through list and verify no card causes page-height jump via expansion.

## 11. Risks and Mitigations

- **Risk:** artwork preview data may be incomplete from current list API.
  - **Mitigation:** render placeholder in Iteration 1 and formalize data enrichment in Iteration 2.
- **Risk:** denser card layout may reduce readability.
  - **Mitigation:** use clear column spacing and mobile stacked fallback.

## 12. Next Iteration Candidates

- Add richer artwork preview data to list payload for better right-column quality.
- Improve right-column DM hierarchy/typography.
- Introduce optional “view more artworks” lightweight interaction.
