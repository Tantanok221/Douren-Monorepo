# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This guidance is also mirrored for other tools in `AGENTS.md` and `CODEX.md` (plus a few tool-specific rule files). Keep them aligned to avoid instruction drift.

## Development Commands

### Initial Setup
```bash
# Full setup (recommended for fresh clone or new worktree)
./setup.sh

# Quick setup (skip building packages)
./setup.sh --quick

# Setup with pnpm
pnpm run setup
pnpm run setup:quick
```

### Environment Setup
```bash
# Login to Infisical (first time only)
pnpm run env:login

# Pull environment variables and generate TypeScript bindings
pnpm run env:pull

# Or use Makefile
make copy-env
```

### Common Development Tasks
```bash
# Start all services in development mode
pnpm run dev

# Start specific services
pnpm run devfe    # Frontend applications only
pnpm run devbe    # Backend services only
pnpm run devpkg   # Package development
pnpm run devlib   # Library development

# Build all projects
pnpm run build

# Lint all projects
pnpm run lint

# Format all code
pnpm run format

# Run tests
pnpm run test

# Generate code (barrel exports, types)
pnpm run codegen
```

### Database Operations
```bash
# Generate database schema and migrations
pnpm run db:generate

# Run database migrations
pnpm run db:migrate

# Push schema changes to database
pnpm run db:push

# Sync production data to local database
pnpm run db:sync

# Connect to local database
pnpm run dev:db
```

### Package Management
```bash
# Build and install packages in correct order
pnpm run pkg && pnpm run lib && pnpm run be

# Build specific package types
pnpm run pkg     # Build all packages
pnpm run lib     # Build shared libraries
pnpm run be      # Build backend services
```

## Architecture Overview

### Monorepo Structure
- **Turborepo** orchestrates the entire monorepo with intelligent caching
- **4 main workspace types**: `fe/` (frontend), `be/` (backend), `pkg/` (packages), `lib/` (shared libraries)
- **Full-stack TypeScript** with end-to-end type safety via tRPC

### Key Applications
- **fe/Douren-frontend**: Main public website using Vite + React + TanStack Router
- **fe/cms**: Content management system using Vite + React + TanStack Router + Tailwind
- **be/douren-backend**: API server on Cloudflare Workers using Hono + tRPC + Drizzle ORM

### Shared Packages
- **pkg/database**: Drizzle ORM schema, migrations, and database utilities
- **pkg/type**: Shared TypeScript types across all applications
- **pkg/env**: Environment configuration with type-safe constants
- **lib/ui**: Design system and reusable React components with Storybook

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + TanStack (Router/Query)
- **Backend**: Hono.js + tRPC + Cloudflare Workers
- **Database**: PostgreSQL + Drizzle ORM + Zod validation
- **Styling**: Tailwind CSS (CMS) + CSS Modules (main frontend)
- **State**: Zustand for client state management
- **Tooling**: Biome + ESLint + Prettier for code quality

### Development Patterns
- **tRPC** provides end-to-end type safety from database to UI
- **Drizzle ORM** with automatic Zod schema generation
- **Barrel exports** via barrelsby for clean imports
- **Turborepo** handles build orchestration and caching
- **Environment management** via dotenv-vault with Makefile automation

### Database Schema
The application manages artists, products/artworks, events, and tags with many-to-many relationships. The schema includes:
- Artists/Authors with social links and portfolios
- Products associated with artists
- Events and exhibitions
- Tag categorization system

### Testing
- **Vitest** for unit testing
- Run `pnpm run test` to execute all tests
- Individual packages may have specific test commands

### Deployment
- Backend deploys to Cloudflare Workers via `turbo deploy`
- Frontend applications use static hosting
- Database migrations are handled separately via `pnpm run db:migrate`

## Important Notes
- **Node.js 22+** is required
- Always run `make copy-env` after environment variable changes
- Use `pnpm run codegen` after schema changes to regenerate types
- The monorepo uses exact workspace dependencies (`*`) for internal packages

## Git Action Policy
- Use the `but` skill (GitButler) for **all** git actions instead of raw `git` commands.
- This includes status, add/stage, commit, push/pull, branch, merge/rebase, tag, stash, and worktree operations.
- Keep using repository worktree helpers (`./scripts/worktree.sh`, `make worktree-*`, `pnpm run worktree:*`) when available.

## Git Worktree Workflow
Git worktrees allow working on multiple branches simultaneously in separate directories.

### Creating a New Worktree
```bash
# Using the worktree script (recommended)
./scripts/worktree.sh create ../my-feature feature/my-feature

# Create with a new branch
./scripts/worktree.sh create ../my-feature feature/my-feature -b

# Using Makefile
make worktree-create PATH=../my-feature BRANCH=feature/my-feature
make worktree-create PATH=../my-feature BRANCH=feature/my-feature NEW=1  # new branch
```

### Managing Worktrees
```bash
# List all worktrees
./scripts/worktree.sh list
pnpm run worktree:list
make worktree-list

# Remove a worktree
./scripts/worktree.sh remove ../my-feature
make worktree-remove PATH=../my-feature

# Clean up all worktrees
./scripts/worktree.sh clean
```

### Worktree Tips
- Each worktree has its own `node_modules` and `.env` files
- Git hooks are shared with the main repository
- Run `./setup.sh` after creating a worktree to initialize it
- Use `--quick` flag for faster setup when you don't need to build packages

---

## Code Quality Guidelines

### TypeScript Strictness
- **NEVER use `any` type** - Always use proper types, generics, or `unknown` with type guards
- **Prefer `unknown` over `any`** - When type is truly unknown, use `unknown` and narrow with type guards
- **Use explicit return types** for public functions and exported APIs
- **Leverage path aliases** - Use `@/` for workspace-local imports and `@pkg/` for internal packages
- **Enable strict mode** - All TypeScript configs extend strict base configurations

```typescript
// ❌ BAD - Never do this
const data: any = fetchData();
function process(input: any) { ... }

// ✅ GOOD - Use proper types
const data: UserData = fetchData();
function process(input: unknown): ProcessedData {
  if (isUserData(input)) { ... }
}
```

### Linting Best Practices
- **NEVER ignore lint errors** - Fix the underlying issue instead
- **NEVER use `// @ts-ignore` or `// @ts-expect-error`** without a detailed justification comment
- **NEVER use `eslint-disable` comments** - Fix the code to comply with rules
- **Run `pnpm run lint`** before committing to catch issues early
- **Run `pnpm run format`** to auto-fix formatting issues

```typescript
// ❌ BAD - Don't suppress lint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;

// ✅ GOOD - Fix the actual type
interface ApiResponse { id: string; name: string; }
const data: ApiResponse = response;
```

### React Best Practices (Vercel Guidelines)
When writing React code, follow Vercel-style React best practices:

**Component Patterns:**
- Use functional components with explicit `React.FC` typing
- Keep components small and focused on a single responsibility
- Use component composition over prop drilling
- Extract reusable logic into custom hooks

**Performance Optimization:**
- Use `React.memo()` for expensive pure components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for callback functions passed to children
- Avoid inline object/array creation in render

**State Management:**
- Prefer local state when possible
- Use Context API for shared state across component trees
- Use Zustand for complex global state

**Data Fetching:**
- Use TanStack Query (via tRPC) for server state
- Leverage query caching and invalidation patterns
- Handle loading and error states explicitly

```typescript
// ✅ GOOD - Proper React patterns
const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { data, isLoading, error } = trpc.artist.getArtist.useQuery({ id: artist.id });

  const formattedName = useMemo(() => formatArtistName(artist), [artist]);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorDisplay error={error} />;

  return <Card data={data} name={formattedName} />;
};
```

### Import Conventions
- Use barrel exports via `@pkg/*` for internal packages
- Use `@/` alias for workspace-local imports
- Group imports: external → internal packages → local modules
- Use `import type` for type-only imports

```typescript
// ✅ GOOD - Organized imports
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import type { ArtistData } from "@pkg/type";
import { formatDate } from "@pkg/helper";

import { useArtistContext } from "@/contexts/ArtistContext";
import styles from "./ArtistCard.module.css";
```

### Testing Guidelines
- Write tests using **Vitest** with `describe`, `it`, `expect` patterns
- Use `vi.mock()` for mocking dependencies (Drizzle ORM, utilities)
- For React components, use `@testing-library/react`
- Mock external services and database calls in unit tests
- Place tests in `__tests__/` directories or use `*.test.ts(x)` naming

```typescript
// ✅ GOOD - Test pattern
describe("ArtistCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders artist name correctly", () => {
    const { getByText } = render(<ArtistCard artist={mockArtist} />);
    expect(getByText(mockArtist.name)).toBeInTheDocument();
  });
});
```

### Styling Guidelines
- **Frontend (Douren-frontend)**: Use CSS Modules with `classNames/bind`
- **CMS**: Use Tailwind CSS utility classes
- Keep styles scoped to components
- Use semantic class names

### tRPC and API Patterns
- Define procedures in router files under `src/trpc/`
- Use `publicProcedure` for public endpoints, `protectedProcedure` for authenticated
- Validate inputs with Zod schemas
- Return typed responses for end-to-end type safety

### Database Patterns (Drizzle ORM)
- Define schemas in `pkg/database/src/db/schema.ts`
- Use DAOs (Data Access Objects) to abstract database operations
- Always use parameterized queries (Drizzle handles this)
- Run `pnpm run db:generate` after schema changes

---

## Development Workflow
- After each commit, a pre-commit hook automatically formats code - only commit the formatted files that were originally being committed, not other unrelated formatted files.

## Development Practices
- Each time you update any agent instruction files (`CLAUDE.md`, `AGENTS.md`, `CODEX.md`, `.cursorrules`, `.github/copilot-instructions.md`), commit via `dev: update agent docs`.

## Commit Habits
- Remember to commit via micro commit habits

## PR Workflow
- After completing a feature or fix, always push and create a PR
- Use descriptive PR titles following the commit convention: `type: description`
- PR descriptions should include:
  - **Summary**: Brief bullet points of what changed
  - **Test plan**: Checklist of testing steps
- Target `main` branch for PRs unless otherwise specified
- Use `gh pr create` for creating PRs from the command line

### Pre-PR Verification
**Before creating a PR**, verify that frontend applications render correctly:

1. **Start the dev server**:
   ```bash
   pnpm run dev
   ```

2. **Verify frontend rendering** by fetching HTML from both apps:
   - **Douren-frontend** (port 5173): `curl -s http://localhost:5173 | head -50`
   - **CMS** (port 5174): `curl -s http://localhost:5174 | head -50`

3. **Check for**:
   - HTML response contains expected `<div id="root">` mount point
   - No server errors or blank responses
   - Vite dev server scripts are injected properly

4. **If using automated verification**, wait for dev server startup (~5 seconds) before fetching:
   ```bash
   # Start dev server in background, wait, then verify
   pnpm run dev &
   sleep 5
   curl -s http://localhost:5173 | grep -q 'id="root"' && echo "Douren-frontend: OK" || echo "Douren-frontend: FAILED"
   curl -s http://localhost:5174 | grep -q 'id="root"' && echo "CMS: OK" || echo "CMS: FAILED"
   ```

This ensures no breaking changes prevent the apps from loading before pushing code.

### Pre-Handover Verification
**Before handover to the user**, run and report all of the following:

1. **Quality gates**:
   ```bash
   pnpm run lint
   pnpm run test
   pnpm run build
   ```
2. **Frontend availability checks**:
   - Launch dev server with `nr dev` (not `pnpm run dev`).
   - Use tmux skill/session management to run the dev server in the background.
   - `curl -s http://localhost:5173 | grep -q 'id="root"'`
   - `curl -s http://localhost:5174 | grep -q 'id="root"'`
3. **Feature render checks (if possible)**:
   - Verify the specific feature element changed by the task is present in the rendered HTML (for example via `curl ... | grep -q '<selector-or-text>'`).
   - When the feature requires UI interaction/behavior checks, leverage the `agent-browser` skill for browser-based verification before handover.
4. **Shutdown requirement**:
   - Stop the dev server/tmux session after verification and before handover.
5. If any check fails, fix the issue first and re-run verification before handover.
