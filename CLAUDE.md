# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Initial Setup
```bash
# Full setup (recommended for fresh clone or new worktree)
./setup.sh

# Quick setup (skip building packages)
./setup.sh --quick

# Setup with npm
npm run setup
npm run setup:quick
```

### Environment Setup
```bash
# Login to Infisical (first time only)
npm run env:login

# Pull environment variables and generate TypeScript bindings
npm run env:pull

# Or use Makefile
make copy-env
```

### Common Development Tasks
```bash
# Start all services in development mode
npm run dev

# Start specific services
npm run devfe    # Frontend applications only
npm run devbe    # Backend services only
npm run devpkg   # Package development
npm run devlib   # Library development

# Build all projects
npm run build

# Lint all projects
npm run lint

# Format all code
npm run format

# Run tests
npm run test

# Generate code (barrel exports, types)
npm run codegen
```

### Database Operations
```bash
# Generate database schema and migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Push schema changes to database
npm run db:push

# Sync production data to local database
npm run db:sync

# Connect to local database
npm run dev:db
```

### Package Management
```bash
# Build and install packages in correct order
npm run pkg && npm run lib && npm run be

# Build specific package types
npm run pkg     # Build all packages
npm run lib     # Build shared libraries
npm run be      # Build backend services
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
- Run `npm run test` to execute all tests
- Individual packages may have specific test commands

### Deployment
- Backend deploys to Cloudflare Workers via `turbo deploy`
- Frontend applications use static hosting
- Database migrations are handled separately via `npm run db:migrate`

## Important Notes
- **Node.js 22+** is required
- Always run `make copy-env` after environment variable changes
- Use `npm run codegen` after schema changes to regenerate types
- The monorepo uses exact workspace dependencies (`*`) for internal packages

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
npm run worktree:list
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

## Commit History Notes
- On DR-90 Jira ticket, remember to update commit history accordingly

## Development Workflow
- After each commit, a pre-commit hook automatically formats code - only commit the formatted files that were originally being committed, not other unrelated formatted files. 

## Development Practices
- Each time you update your claude.md you should commit it via "[DR-00] dev: update claude.md", a simple commit is enough

## Commit Habits
- Remember to commit via micro commit habits
