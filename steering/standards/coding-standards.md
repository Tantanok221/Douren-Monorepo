# Coding Standards

## Purpose
This document establishes coding conventions, formatting rules, and development practices for the Douren monorepo. These standards ensure consistency across all packages and applications.

## Code Formatting and Linting

### Primary Tool: Biome 1.9
The project uses **Biome 1.9** as the primary code quality tool for all TypeScript/JavaScript code.

**Formatting Rules:**
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: 120 characters maximum
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Trailing Commas**: Always include in multiline structures

**Commands (Package-Specific):**
```bash
# Format code (per package)
npx @biomejs/biome format --write ./src

# Lint with auto-fix (per package)
npx @biomejs/biome lint --write ./src

# Root-level commands
npm run format  # Formats all packages
npm run lint    # Lints all packages
```

**Configuration Files:**
- `biome.json` in each package root
- Consistent settings across all TypeScript packages
- Pre-commit hooks enforce formatting via Husky

### Secondary Tool: ESLint (Specific Packages)
ESLint is used in select packages for React-specific linting rules:

**Usage:**
- `lib/ui` package: React component linting
- Frontend packages: JSX and React Hook rules
- Works alongside Biome, not as replacement

```json
// Example eslint.config.js for React packages
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];
```

### File and Directory Naming

**Files:**
- **Components**: PascalCase (`ArtistCard.tsx`, `ImageContainer.tsx`)
- **Hooks**: camelCase with `use` prefix (`useArtistLoader.ts`, `useTagFilter.ts`)
- **Utilities**: camelCase (`processArtistData.ts`, `fetchHelper.ts`)
- **Types**: camelCase with `.ts` extension (`model.ts`, `utility.ts`)
- **Tests**: Match source file with `.test.ts` suffix (`Artist.test.ts`)

**Directories:**
- **Components**: PascalCase (`ArtistCard/`, `SearchContainer/`)
- **Feature Modules**: kebab-case (`multi-step-form/`, `image-upload/`)
- **Utility Folders**: camelCase (`helper/`, `context/`)

## TypeScript Standards

### Type Definitions

**Prefer Interfaces Over Types for Object Shapes:**
```typescript
// Good
interface ArtistCardProps {
  data: artistBaseSchemaWithTagType;
  index?: number;
  children?: React.ReactNode;
}

// Avoid for simple object shapes
type ArtistCardProps = {
  data: artistBaseSchemaWithTagType;
  index?: number;
}
```

**Use Type Unions for Discriminated Unions:**
```typescript
// Good
type ActionType = 
  | { action: "add"; data: eventArtistBaseSchemaType }
  | { action: "remove"; data: { uuid: string } }
  | { action: "clear" };
```

**Strict Null Checks:**
```typescript
// Always handle potential undefined/null values
const artist = data?.artists?.find(a => a.uuid === artistId);
if (!artist) {
  throw new Error(`Artist ${artistId} not found`);
}
```

### Import Organization

**Import Order:**
1. React and core libraries
2. Third-party packages
3. Internal packages (`@pkg/*`, `@lib/*`, `@be/*`)
4. Relative imports (`./*`, `../*`)
5. Type-only imports (separate group)

```typescript
import React from "react";
import { motion } from "framer-motion";
import classNames from "classnames/bind";

import { trpc } from "@/helper/trpc";
import { ArtistCard } from "@lib/ui";

import { processArtistData } from "../helper/processArtistData";
import styles from "./ArtistContainer.module.css";

import type { artistBaseSchemaWithTagType } from "@pkg/type";
```

### Barrel Exports (Automated)

**Barrelsby Configuration:**
The project uses automated barrel export generation via barrelsby:

```json
// barrelsby.json
{
  "directory": "./src",
  "exclude": [
    "__tests__",
    "__fixtures__", 
    "*.test.ts",
    "*.stories.tsx"
  ],
  "delete": true,
  "location": "below"
}
```

**Generated Index Files:**
```typescript
// Automatically generated index.ts files
export * from './ArtistCard/ArtistCard';
export * from './Button/Button';
export * from './DMButton/DMButton';
// ... other exports

// Manual exports when needed for re-exports
export { ArtistCard as Card } from './ArtistCard';
export type { ArtistCardProps } from './ArtistCard';
```

**Commands:**
```bash
# Generate barrel exports (per package)
npx barrelsby --config barrelsby.json

# Usually run as part of build process
npm run codegen
```

## Component Development Standards

### React Component Patterns

**Functional Components with TypeScript:**
```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  children?: React.ReactNode;
}

export const Component: React.FC<ComponentProps> = ({
  required,
  optional = 0,
  children
}) => {
  return (
    <div>
      {children}
    </div>
  );
};
```

**Compound Component Pattern:**
```typescript
export const ArtistCard: React.FC<ArtistCardProps> & {
  ImageContainer: typeof ImageContainer;
  DMButton: typeof ArtistDMButton;
  TagContainer: typeof ArtistTagContainer;
} = ({ children, data }) => {
  return (
    <EventDataContext.Provider value={data}>
      <motion.div className="artistCard">
        {children}
      </motion.div>
    </EventDataContext.Provider>
  );
};

// Attach subcomponents
ArtistCard.ImageContainer = ImageContainer;
ArtistCard.DMButton = ArtistDMButton;
ArtistCard.TagContainer = ArtistTagContainer;
```

### Hook Development

**Custom Hook Naming:**
```typescript
// Always prefix with 'use'
export const useArtistLoader = (artistId: string) => {
  const { data, isLoading, error } = trpc.artist.getArtistById.useQuery(
    { id: artistId }
  );
  
  return {
    artist: data,
    isLoading,
    error,
    isReady: !isLoading && !error && data
  };
};
```

**Context Hook Pattern:**
```typescript
export const useCollectionContext = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollectionContext must be used within CollectionProvider');
  }
  return context;
};
```

## Backend Development Standards

### API Route Structure

**tRPC Route Organization:**
```typescript
export const trpcArtistRoute = router({
  // Queries (read operations)
  getArtist: publicProcedure
    .input(artistInputParams)
    .query(async (opts) => {
      // Implementation
    }),
    
  getArtistById: publicProcedure
    .input(GetArtistByIdSchema)
    .query(async (opts) => {
      // Implementation
    }),
    
  // Mutations (write operations)  
  createArtist: authProcedure
    .input(CreateArtistSchema)
    .mutation(async (opts) => {
      // Implementation
    }),
    
  updateArtist: authProcedure
    .input(UpdateArtistSchema)
    .mutation(async (opts) => {
      // Implementation
    })
});
```

**DAO Pattern Implementation:**
```typescript
export class ArtistDao implements BaseDao {
  constructor(private db: ReturnType<typeof initDB>) {}
  
  async Fetch(params: ArtistFetchParams) {
    try {
      // Implementation with error handling
      const result = await this.executeQuery(params);
      return this.formatResponse(result);
    } catch (error) {
      console.error('ArtistDao.Fetch error:', error);
      throw new Error('Failed to fetch artists');
    }
  }
  
  async Create(data: CreateArtistInput) {
    // Implementation
  }
  
  async Update(id: string, data: UpdateArtistInput) {
    // Implementation  
  }
  
  async Delete(id: string) {
    // Implementation
  }
}

export const NewArtistDao = (db: Database) => new ArtistDao(db);
```

### Database Standards

**Schema Definition:**
```typescript
export const tableName = pgTable("table_name", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  optionalField: text("optional_field"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const tableNameRelations = relations(tableName, ({ many, one }) => ({
  // Define relationships
}));
```

**Query Construction:**
```typescript
// Use Drizzle query builder, avoid raw SQL when possible
const artists = await db
  .select({
    uuid: s.authorMain.uuid,
    author: s.authorMain.author,
    tags: sql`jsonb_agg(${s.tag.tag})`.as("tags")
  })
  .from(s.authorMain)
  .leftJoin(s.authorTag, eq(s.authorMain.uuid, s.authorTag.authorId))
  .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
  .where(eq(s.authorMain.uuid, artistId))
  .groupBy(s.authorMain.uuid);
```

## CSS and Styling Standards

### CSS Modules Conventions

**Class Naming (BEM-inspired):**
```css
/* ArtistCard.module.css */
.artistCard {
  /* Base component styles */
}

.artistCard__header {
  /* Element within component */
}

.artistCard--featured {
  /* Modifier variant */
}

.artistCard__header--highlighted {
  /* Element with modifier */
}
```

**TypeScript Integration:**
```typescript
import styles from "./ArtistCard.module.css";
import classNames from "classnames/bind";

const sx = classNames.bind(styles);

export const ArtistCard = () => {
  return (
    <div className={sx("artistCard", { "artistCard--featured": isFeatured })}>
      <header className={sx("artistCard__header")}>
        {/* Content */}
      </header>
    </div>
  );
};
```

### Tailwind CSS (CMS Application)

**Utility Class Organization:**
```typescript
// Group related utilities
className="flex flex-col items-center w-full h-screen dark"

// Use consistent spacing scale
className="pt-20 py-4 px-40"

// Prefer semantic color names
className="bg-primary text-primary-foreground"
```

## Error Handling Standards

### Frontend Error Handling

**tRPC Query Errors:**
```typescript
const { data, error, isLoading, refetch } = trpc.artist.getArtist.useQuery(
  params,
  {
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error.data?.httpStatus >= 400 && error.data?.httpStatus < 500) {
        return false;
      }
      return failureCount < 3;
    },
    onError: (error) => {
      console.error('Query error:', error.message);
      // Handle user notification
    }
  }
);

if (error) {
  return <ErrorMessage error={error} onRetry={refetch} />;
}
```

**Form Validation Errors:**
```typescript
const form = useForm({
  resolver: zodResolver(CreateArtistSchema),
  defaultValues: {
    author: "",
    introduction: ""
  }
});

const onSubmit = async (data: FormData) => {
  try {
    await createArtist.mutateAsync(data);
    // Handle success
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle validation errors
      error.errors.forEach(err => {
        form.setError(err.path[0] as keyof FormData, {
          message: err.message
        });
      });
    }
  }
};
```

### Backend Error Handling

**DAO Layer Errors:**
```typescript
async FetchById(artistId: string) {
  try {
    const result = await this.db
      .select()
      .from(s.authorMain)
      .where(eq(s.authorMain.uuid, Number(artistId)));
      
    if (!result.length) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Artist with ID ${artistId} not found`
      });
    }
    
    return result[0];
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error; // Re-throw tRPC errors
    }
    
    console.error('Database error in FetchById:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch artist'
    });
  }
}
```

## Testing Standards

### Testing Infrastructure (Vitest)

**Testing Framework: Vitest with Comprehensive Mocking**

**Mock Setup Patterns:**
```typescript
// Advanced mocking with vi.mock()
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external dependencies
vi.mock("@pkg/database/db", () => ({
  initDB: vi.fn(),
  s: {
    authorMain: { uuid: "uuid", author: "author", tags: "tags" },
    authorTag: { authorId: "authorId", tagId: "tagId" },
    tag: { tag: "tag", count: "count" }
  }
}));

// Mock database operations
const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({ leftJoin: vi.fn(() => ({ where: vi.fn() })) }));
const mockDb = {
  select: mockSelect.mockReturnValue({ from: mockFrom }),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn()
};
```

**Test File Organization:**
```typescript
// Artist.test.ts
describe('Artist DAO', () => {
  let dao: ArtistDao;
  
  beforeEach(() => {
    vi.clearAllMocks();
    dao = new ArtistDao(mockDb as any);
  });
  
  describe('Fetch', () => {
    it('should return paginated artist data', async () => {
      // Arrange
      const mockData = [{ uuid: 1, author: 'Test Artist' }];
      const mockCount = [{ totalCount: 1 }];
      
      mockSelect
        .mockReturnValueOnce({ from: vi.fn().mockResolvedValue(mockData) })
        .mockReturnValueOnce({ from: vi.fn().mockResolvedValue(mockCount) });
      
      // Act
      const result = await dao.Fetch({ page: '1', search: '', tag: '' });
      
      // Assert
      expect(result.data).toEqual(mockData);
      expect(result.pagination.currentPage).toBe(1);
    });
    
    it('should handle database errors gracefully', async () => {
      // Arrange
      mockSelect.mockImplementation(() => {
        throw new Error('Database connection failed');
      });
      
      // Act & Assert
      await expect(dao.Fetch({ page: '1' })).rejects.toThrow('Failed to fetch artists');
    });
  });
});
```

**Mock Data Patterns:**
```typescript
// __fixtures__/artistData.ts - Centralized test data
export const mockArtistData = [
  {
    uuid: 1,
    author: "Test Artist 1",
    introduction: "Test introduction",
    photo: "test-photo.jpg",
    tags: [{ tag: "illustration", count: 5 }]
  },
  // ... more test data
];

// __fixtures__/mockDatabase.ts - Database mocking utilities
export const createMockDatabase = () => ({
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  // Helper methods for test setup
  setupArtistData: (data: any[]) => {
    // Setup mock responses
  }
});
```

**Component Testing:**
```typescript
// ArtistCard.test.tsx
describe('ArtistCard Component', () => {
  const mockData = {
    uuid: 1,
    author: 'Test Artist',
    tags: [{ tag: 'illustration', count: 5 }]
  };
  
  it('renders artist information correctly', () => {
    render(<ArtistCard data={mockData} />);
    
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('illustration')).toBeInTheDocument();
  });
});
```

## Performance Guidelines

### Bundle Size Optimization
- Use dynamic imports for heavy components
- Implement lazy loading for routes and images
- Avoid importing entire libraries when only specific functions are needed

### Database Query Optimization
- Always use pagination for list queries
- Include only necessary fields in SELECT statements
- Use appropriate database indexes for frequently queried columns
- Implement query result caching where appropriate

## Implementation Guidelines

### Adding New Features
1. Define types in `pkg/type`
2. Create database schema changes
3. Generate and test migrations
4. Implement DAO layer with comprehensive error handling
5. Add tRPC routes with proper input validation
6. Build reusable UI components in `lib/ui`
7. Integrate components in appropriate applications
8. Add comprehensive tests for all layers

### Code Review Checklist
- [ ] TypeScript types are properly defined
- [ ] Error handling is comprehensive
- [ ] Tests cover happy path and edge cases
- [ ] Performance considerations are addressed
- [ ] Code follows established patterns
- [ ] Documentation is updated where necessary

## Related Documents
- [System Overview](../architecture/system-overview.md) - Architecture context
- [API Design Guidelines](api-design-guidelines.md) - API-specific standards
- [Testing Standards](testing-standards.md) - Comprehensive testing approaches
- [Common Patterns](../patterns/common-patterns.md) - Implementation patterns