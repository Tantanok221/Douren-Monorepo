# PR #207 Review

## Recommendation
**Request changes**

## Findings (ordered by severity)

1. **High: New frontend middleware imports a workspace package that is not declared in `fe/Douren-frontend` dependencies, and currently fails TypeScript resolution in this workspace setup.**
   - Files:
     - `fe/Douren-frontend/functions/_middleware.ts:1-6`
     - `fe/Douren-frontend/functions/auth.test.ts:3-8`
     - `fe/Douren-frontend/package.json` (no `@pkg/edge-auth` entry)
   - Evidence:
     - `pnpm --filter doujinbooth exec tsc --noEmit` reports:
       - `functions/_middleware.ts(6,8): error TS2307: Cannot find module '@pkg/edge-auth'...`
       - `functions/auth.test.ts(8,8): error TS2307: Cannot find module '@pkg/edge-auth'...`
   - Why this matters:
     - This can break typed builds/checks and is fragile for isolated installs/deploy contexts.
   - Suggested fix:
     - Add `"@pkg/edge-auth": "workspace:*"` to `fe/Douren-frontend/package.json` (as done for CMS).
     - Also consider exporting built artifacts from `pkg/edge-auth` (`dist`) to avoid resolver fragility under non-`NodeNext` consumers.

2. **Medium: Duplicate helper implementations were added in both apps (`functions/auth.ts`) but are not used by middleware/tests.**
   - Files:
     - `fe/Douren-frontend/functions/auth.ts`
     - `fe/cms/functions/auth.ts`
     - Middleware imports from `@pkg/edge-auth` instead (`fe/*/functions/_middleware.ts:1-6`)
   - Why this matters:
     - Dead duplicated logic increases maintenance risk and future divergence from the shared package.
   - Suggested fix:
     - Remove both local `functions/auth.ts` files unless they are intentionally part of a follow-up migration.

3. **Medium: Test coverage validates helper functions only, not middleware behavior or both app integrations.**
   - Files:
     - `fe/Douren-frontend/functions/auth.test.ts`
     - No matching CMS middleware tests in this PR
   - Why this matters:
     - Core behavior is in `onRequest` middleware (branch gating + 401 response + `X-Robots-Tag` propagation), but this is currently untested.
   - Suggested fix:
     - Add middleware-level tests (at least one per app or shared test harness) for:
       - unprotected branch passes through
       - protected branch + invalid/missing auth returns 401 with `WWW-Authenticate`
       - protected branch + valid auth calls `next()` and returns `X-Robots-Tag`

## Correctness / Regression Assessment
- The intended behavior (protect `stg` and `pr-*`, add noindex headers) is logically sound.
- No obvious runtime performance concerns; middleware operations are O(1) per request.
- Main risk is integration robustness (dependency/resolution + lack of middleware-level tests).

## Verification Performed
- Inspected full PR diff against `main`.
- Ran:
  - `pnpm install`
  - `pnpm --filter doujinbooth build` (pass)
  - `pnpm --filter cms build` (pass)
  - `pnpm exec vitest run fe/Douren-frontend/functions/auth.test.ts` (pass, 6 tests)
  - `pnpm --filter @pkg/edge-auth build` (pass)
  - `pnpm --filter doujinbooth exec tsc --noEmit` (fails; includes new TS2307 errors on `@pkg/edge-auth` imports)

## Final Merge Call
**Request changes** until dependency/resolution robustness is fixed for `fe/Douren-frontend` and middleware-level coverage is improved enough to protect this auth gate from regressions.
