# System Overview

## Purpose
This document provides a high-level architectural overview of the Douren monorepo, a small-scale doujin artist discovery platform. Use this as the foundational reference for understanding system components, data flow, and technology choices.

## Architecture Overview

### Monorepo Structure
The system uses **Turborepo** to orchestrate four workspace types:
- `fe/` - Frontend applications (public website + CMS)
- `be/` - Backend services (Cloudflare Workers API)
- `pkg/` - Shared packages (database, types, environment)
- `lib/` - UI component libraries with Storybook

### Core Applications

**Backend: `be/douren-backend`**
- **Runtime**: Cloudflare Workers with Hono.js framework
- **API Layer**: tRPC for type-safe APIs + traditional REST endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Features**: Artist/event CRUD operations, image uploads, cron jobs for tag sync
- **Deployment**: Multi-environment (staging: `stg.api.douren.net`, production: `api.douren.net`)

**Frontend: `fe/Douren-frontend`** (Public Website)
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: TanStack Router with file-based routing
- **Styling**: CSS Modules with component-scoped styles
- **Features**: Artist discovery, event browsing, collection management, responsive masonry layouts

**Frontend: `fe/cms`** (Content Management)
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Tailwind CSS + Radix UI primitives
- **Features**: Artist/product/event management, multi-step forms, image upload workflows

### Shared Infrastructure

**Database Package: `pkg/database`**
- **Schema Management**: Drizzle ORM with PostgreSQL
- **Type Generation**: Automatic Zod schema generation from database schema
- **Migrations**: Stored in `supabase/migrations/` directory
- **Environments**: Separate dev/staging/production databases

**Type Package: `pkg/type`**
- **Shared Types**: Common TypeScript interfaces and types
- **API Contracts**: tRPC input/output type definitions
- **Domain Models**: Artist, Event, Product, and Tag type definitions

**UI Library: `lib/ui`**
- **Component System**: Compound components with subcomponent patterns
- **Animation**: Framer Motion integration for page transitions and interactions
- **State Management**: Context-based patterns with custom hooks

## Technology Stack

### Core Framework Stack
- **Frontend**: React 18 + TypeScript + Vite + TanStack (Router/Query)
- **Backend**: Hono.js + tRPC + Cloudflare Workers
- **Database**: PostgreSQL + Drizzle ORM + Zod validation
- **Styling**: Tailwind CSS (CMS) + CSS Modules (main frontend)
- **State Management**: Zustand for client state + Context for component state

### Development Tooling
- **Code Quality**: Biome 1.9 (primary) + ESLint (React-specific rules)
- **Environment Management**: Infisical for secrets + dotenv fallback
- **Testing**: Vitest with comprehensive mocking strategies
- **Build System**: Turborepo with intelligent caching
- **Component Development**: Storybook for lib/ui documentation
- **Code Generation**: Barrelsby for automatic barrel exports

### Deployment Stack
- **Backend Hosting**: Cloudflare Workers with multi-environment support
- **Frontend Hosting**: Static hosting with CDN distribution
- **Database Hosting**: External PostgreSQL provider (Supabase-compatible)
- **Secret Management**: Infisical with environment-specific configurations

## Data Flow Architecture

### Read Operations (Artist Discovery)
1. Frontend requests artist data via tRPC client
2. Backend tRPC route calls appropriate DAO (Data Access Object)
3. DAO uses QueryBuilder to construct dynamic SQL with filtering/pagination
4. Drizzle ORM executes query against PostgreSQL
5. Results flow back through tRPC with full type safety

### Write Operations (CMS Management)
1. CMS submits form data through multi-step form workflow
2. Data validated using Zod schemas (shared between client/server)
3. tRPC mutation routes handle CRUD operations
4. DAO layer manages database transactions and relationships
5. Success/error responses flow back to CMS with optimistic updates

### Background Processing
- **Daily Cron Jobs**: Tag count synchronization runs at midnight UTC
- **Image Processing**: Handled through separate image service routes
- **Data Sync**: Production to local/staging database synchronization via Makefile

## Technology Decisions

### Why Turborepo
- **Build Orchestration**: Manages complex dependency order (pkg → lib → be/fe)
- **Intelligent Caching**: Build artifact caching with remote cache support
- **Workspace Management**: Handles monorepo complexity with exact dependencies (`*`)
- **Development Workflow**: Parallel development across workspaces with task dependencies

### Why Cloudflare Workers
- **Simplicity**: No server management overhead for small-scale application
- **Global Distribution**: Built-in CDN for improved performance
- **Cost-Effective**: Pay-per-request model suitable for variable traffic

### Why tRPC
- **Type Safety**: End-to-end type safety from database to UI
- **Developer Experience**: Auto-completion and compile-time error catching
- **Small Bundle Size**: Minimal runtime overhead compared to GraphQL

### Why Drizzle ORM
- **Type-First**: Schema defines types, not the reverse
- **Performance**: Minimal overhead, close to raw SQL
- **Migrations**: Simple migration system with version control

## Deployment Architecture

### Development Environment
- **Local Database**: PostgreSQL instance with development data
- **Environment Management**: Infisical-first with `infisical run --env=dev` pattern
- **Workers Development**: `infisical export > .dev.vars` for Cloudflare Workers
- **Fallback Strategy**: Manual `.env` files when Infisical unavailable
- **Hot Reload**: All applications support hot module replacement
- **Code Quality**: Pre-commit hooks via Husky enforce Biome formatting
- **Barrel Exports**: Automatic generation via barrelsby configuration

### Staging Environment
- **API**: `stg.api.douren.net` (Cloudflare Workers)
- **Database**: Separate staging PostgreSQL instance
- **Data Sync**: Can sync from production for testing

### Production Environment
- **API**: `api.douren.net` (Cloudflare Workers with observability)
- **Database**: Production PostgreSQL instance
- **Monitoring**: Cloudflare observability enabled
- **Cron Jobs**: Daily tag synchronization

## Scaling Considerations

### Current Scale
- Small-scale artist discovery platform
- Seasonal traffic patterns during convention seasons
- No strict SLA requirements
- Focus on developer productivity over enterprise scalability

### Future Considerations
- **Internationalization**: Planned for future but not current priority
- **Image Storage**: Currently handled through separate service, may need optimization
- **Search Performance**: Tag-based search may need optimization as artist count grows
- **Mobile Experience**: Responsive design in place, dedicated mobile app not planned

## Implementation Guidelines

### Adding New Features
1. Start with type definitions in `pkg/type`
2. Add database schema changes in `pkg/database`
3. Generate migration: `npm run db:generate`
4. Implement DAO layer with comprehensive error handling
5. Create tRPC routes with proper input validation and Zod schemas
6. Build UI components in `lib/ui` if reusable, include Storybook stories
7. Add comprehensive tests with mocking strategies (vi.mock patterns)
8. Integrate in appropriate frontend application
9. Update steering documentation if new patterns emerge

### Database Changes
1. Modify schema in `pkg/database/src/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Test migration locally: `npm run db:migrate`
4. Update Zod schemas: `npm run codegen`
5. Update TypeScript types and DAO layers

### Component Development
1. Build reusable components in `lib/ui`
2. Use compound component pattern for complex UI
3. Include Storybook stories for component documentation
4. Implement responsive design with CSS modules or Tailwind

## Related Documents
- [Data Flow Patterns](data-flow.md) - Detailed data flow and state management
- [Integration Patterns](integration-patterns.md) - External service integration approaches
- [Security Architecture](security-architecture.md) - Authentication and authorization patterns