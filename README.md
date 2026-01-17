# Douren Monorepo

Douren is a full-stack TypeScript monorepo for a curated artist + event/exhibition platform (public site + CMS + API).

Production site: https://douren.net

## TL;DR (get it running)

```bash
# Prereqs: Node.js >= 22, pnpm
./setup.sh
pnpm run dev
```

Default dev ports:
- Public site (Vite): `http://localhost:5173`
- CMS (Vite): `http://localhost:5174`
- API (Cloudflare Workers / Wrangler): `http://localhost:2000`

## Repository Layout

This repo is a Turborepo with 4 workspace “lanes”:
- `fe/*` — Frontend apps
  - `fe/Douren-frontend` — Public website (Vite + React + TanStack Router)
  - `fe/cms` — Admin/CMS (Vite + React + TanStack Router + Tailwind)
- `be/*` — Backend services
  - `be/douren-backend` — API server (Cloudflare Workers + Hono + tRPC + Drizzle)
- `pkg/*` — Shared packages
  - `pkg/database` — Drizzle ORM schema/migrations + generated Zod
  - `pkg/env` — Type-safe environment bindings
  - `pkg/type` — Shared TypeScript types
  - `pkg/helper` — Shared helpers/utilities
  - `pkg/typescript-config` — Shared TS configs
- `lib/*` — Shared libraries
  - `lib/ui` — Design system / shared React components (Storybook)

## Onboarding

### Prerequisites
- Node.js `>= 22` (see `package.json#engines`)
- `pnpm` (repo uses `pnpm@10.x`)
- Infisical CLI (**required for the default `dev` scripts**) for pulling secrets/env

### First-time setup

```bash
./setup.sh
```

Quick setup (skips building packages):

```bash
./setup.sh --quick
```

### Environment variables (Infisical)

```bash
pnpm run env:login
pnpm run env:pull
```

If you prefer Make:

```bash
make copy-env
```

## Common Commands

```bash
pnpm run dev        # all services
pnpm run devfe      # frontends only
pnpm run devbe      # backend only

pnpm run build
pnpm run test
pnpm run lint
pnpm run format

pnpm run codegen    # barrels/types + rebuild packages
```

### Run a single workspace

```bash
pnpm --filter ./fe/cms dev
pnpm --filter ./fe/Douren-frontend dev
pnpm --filter ./be/douren-backend dev
pnpm --filter ./lib/ui dev # Storybook (port 6006)
```

### Database

```bash
pnpm run db:generate
pnpm run db:migrate
pnpm run db:push
pnpm run db:sync
pnpm run dev:db
```

## How The Pieces Fit

- **Type safety end-to-end**: `@be/douren-backend` exposes a tRPC API; frontends consume it using shared types (`@pkg/type`) and generated schemas (`@pkg/database` Zod).
- **Database access**: schema + migrations live in `pkg/database` (Drizzle ORM + drizzle-kit).
- **Local dev orchestration**: `turbo dev` runs all relevant workspace `dev` scripts.
- **Secrets**: local env files/bindings are generated from Infisical via `pnpm run env:pull` (see `scripts/generate-env-binding.js`).

## Git Worktrees (recommended workflow)

```bash
./scripts/worktree.sh create ../my-feature feature/my-feature -b
cd ../my-feature
./setup.sh --quick
```

## Troubleshooting

### CRLF / line ending noise

```bash
git add --renormalize .
```

### Infisical not installed / not logged in
- Install the Infisical CLI, then run `pnpm run env:login`.
- If you can’t use Infisical, you’ll need to provide env vars manually and run the underlying tools (Vite/Wrangler/etc.) without the `infisical ...` wrappers.

## Extra tooling

- `scripts/upload-db.py` — Python/Poetry script for uploading artist data from Excel (see `scripts/README.md`).
