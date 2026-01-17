# Preview deployments (multiple staging)

PR previews use the default provider URLs (no custom `douren.net` preview domains required).

## URLs

For PR `#<number>`:

- Frontend (Cloudflare Pages): `https://pr-<number>.douren-frontend.pages.dev`
- CMS (Cloudflare Pages): `https://pr-<number>.douren-cms.pages.dev`
- Backend API (Cloudflare Workers): `https://douren-backend-pr-<number>.<WORKERS_DEV_SUBDOMAIN>.workers.dev`

## Where to find links quickly

Each deploy workflow comments on the PR with:

- the preview URLs
- `curl -I ...` commands for quick smoke checks

## `stg` branch (single shared staging)

Manual `workflow_dispatch` runs still deploy to:

- Pages branch `stg` (frontend + CMS)
- Backend `stg` environment (`https://stg.api.douren.net`)

## Backend isolation

- Compute isolation: PRs deploy to a unique Worker name `douren-backend-pr-<number>` so PRs don’t overwrite each other.
- DB isolation: PR previews currently use the shared staging database (no per-PR DB setup).

## Cleanup on PR close/merge

When a PR is closed, `​.github/workflows/pr-preview-destroy.yaml` deletes:

- Cloudflare Pages deployments for branch `pr-<number>` (both `douren-frontend` and `douren-cms`)
- The per-PR backend Worker script `douren-backend-pr-<number>`

