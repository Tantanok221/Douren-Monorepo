# Preview deployments (multiple staging)

Cloudflare Pages deployments for `fe/cms` and `fe/Douren-frontend` support multiple concurrent PR previews by deploying PRs to a **per-PR Pages branch**:

- `pr-<number>` (example: `pr-123`)

This avoids all PRs overwriting the single `stg` branch deployment (and its fixed custom domain).

## Where to find the preview URL

- Each PR run comments on the PR with the deployed preview URL (and any Cloudflare “aliases” returned by Wrangler).
- The URL is also written to the GitHub Actions job summary.

## `stg` branch (single fixed staging)

- The staging workflows still deploy to the `stg` branch when run via `workflow_dispatch`.
- If `stg.*.douren.net` is mapped in Cloudflare Pages to the `stg` branch, it remains a single shared staging URL.

## Note on backend staging

The repo supports a per-PR backend worker deployment and a per-PR Postgres schema (so PRs don’t fight over one shared staging worker or one shared schema).

## Custom domains on `douren.net` (required for PR preview URLs)

The workflows comment **both**:

- the default Cloudflare preview URL (works immediately), and
- the intended `douren.net` custom domain URL (works after Cloudflare wildcard routing is configured).

### Proposed preview hostnames

- Frontend (PR): `https://pr-<number>-stg.douren.net`
- CMS (PR): `https://pr-<number>-cms-stg.douren.net`
- Backend API (PR): `https://pr-<number>-api-stg.douren.net`

### How the `douren.net` previews are expected to work

Cloudflare Pages does not automatically serve unknown hostnames unless they are registered as Pages “custom domains”.
To avoid adding/removing a custom domain per PR, the expected setup is:

1. Add a wildcard DNS record (proxied) for:
   - `*.douren.net`
2. Point only the PR-preview hostnames at a Cloudflare Worker route that proxies to:
   - Pages branch preview URLs (`https://pr-<n>.douren-frontend.pages.dev`, `https://pr-<n>.douren-cms.pages.dev`)
   - Workers preview URLs for the backend (`douren-backend-pr-<n>` on `workers.dev`)

This repo includes a router worker implementation at `be/preview-router/src/index.ts`. Deploy it via `.github/workflows/main-preview-router-deploy.yaml`, then configure Cloudflare Worker routes to point the PR-preview hostnames at the deployed `douren-preview-router` script.

For API routing, the router also needs `WORKERS_DEV_SUBDOMAIN` (your Cloudflare `workers.dev` subdomain) set as a GitHub Actions variable `WORKERS_DEV_SUBDOMAIN`.

## Why the preview hostnames are single-label under `douren.net`

Cloudflare’s Universal SSL for a zone typically covers `douren.net` and `*.douren.net` (one label).
It does not cover multi-level hostnames like `pr-154.stg.douren.net` unless you provision an additional certificate for `*.stg.douren.net`.
Using `pr-154-stg.douren.net` keeps the preview within `*.douren.net` so TLS works on the free plan.

## Cleanup on PR close/merge

When a PR is closed, the workflow `​.github/workflows/pr-preview-destroy.yaml` deletes:

- Cloudflare Pages deployments for branch `pr-<number>` (for both `douren-frontend` and `douren-cms`)
- The per-PR backend Worker script `douren-backend-pr-<number>`

It does **not** drop the per-PR database schema.

If you don’t configure this, the `douren.net` preview URLs will 404 even though the deploy succeeded (the `.pages.dev` / `.workers.dev` URLs will still work).

## Backend “isolation” details

- **Compute isolation**: PRs deploy to a unique Worker name: `douren-backend-pr-<number>` (so deployments don’t overwrite each other).
- **DB isolation**: not enabled by default. PR previews currently use the shared staging database.

Limitations:
- True per-PR DB isolation would require either:
  - a **direct/unpooled** Postgres connection string that supports setting `search_path` at startup (Neon pooled connections reject `options=...search_path...`), or
  - provisioning a **separate database/Neon branch per PR** (requires extra automation + credentials).
