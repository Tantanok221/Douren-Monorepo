# Data Flow and State Management

## Purpose
This document details how data flows through the Douren system, state management patterns, and best practices for maintaining consistency across the monorepo.

## tRPC Data Flow

### Frontend to Backend Communication

**Query Flow (Read Operations)**
```typescript
// Frontend: TanStack Query + tRPC
const { data: artists } = trpc.artist.getArtist.useQuery({
  page: '1',
  search: 'artist-name',
  tag: 'illustration'
});

// Backend: tRPC Route
export const trpcArtistRoute = router({
  getArtist: publicProcedure
    .input(artistInputParams)
    .query(async (opts) => {
      const ArtistDao = NewArtistDao(opts.ctx.db);
      return await ArtistDao.Fetch(opts.input);
    })
});

// DAO Layer: Uses QueryBuilder Pattern
async Fetch(params: ArtistFetchParams) {
  try {
    const QueryBuilder = NewArtistQueryBuilder(params, this.db);
    const { SelectQuery, CountQuery } = QueryBuilder.BuildQuery();
    const [data, [counts]] = await Promise.all([
      SelectQuery.query,
      CountQuery.query,
    ]);
    return createPaginationObject(data, Number(params.page), PAGE_SIZE, counts.totalCount);
  } catch (error) {
    console.error('ArtistDao.Fetch error:', error);
    throw new Error('Failed to fetch artists');
  }
}
```

**Mutation Flow (Write Operations)**
```typescript
// Frontend: Optimistic Updates
const createArtist = trpc.artist.createArtist.useMutation({
  onMutate: async (newArtist) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['artist'] });
    
    // Snapshot previous value
    const previousArtists = queryClient.getQueryData(['artist']);
    
    // Optimistically update
    queryClient.setQueryData(['artist'], (old) => [...old, newArtist]);
    
    return { previousArtists };
  },
  onError: (err, newArtist, context) => {
    // Rollback on error
    queryClient.setQueryData(['artist'], context.previousArtists);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['artist'] });
  }
});
```

## State Management Patterns

### Client-Side State Architecture

**Global State: Zustand**
```typescript
// stores/useTagFilter.ts
interface TagFilterState {
  selectedTags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
}

export const useTagFilter = create<TagFilterState>()((set) => ({
  selectedTags: [],
  addTag: (tag) => set((state) => ({ 
    selectedTags: [...state.selectedTags, tag] 
  })),
  removeTag: (tag) => set((state) => ({ 
    selectedTags: state.selectedTags.filter(t => t !== tag) 
  })),
  clearTags: () => set({ selectedTags: [] })
}));
```

**Component State: React Context + Immer**
```typescript
// CollectionContext for bookmark management
export interface ActionType {
  action: "add" | "remove";
  keys: string;
  data: eventArtistBaseSchemaType | undefined;
}

function reducer(
  draft: eventArtistBaseSchemaType[] | null,
  { action, data }: ActionType,
) {
  switch (action) {
    case "add":
      if (data && draft) {
        draft.push(data);
      }
      break;
    case "remove":
      return draft?.filter(item => item.uuid !== data?.uuid) || null;
  }
}

export const CollectionProvider = ({ children, keys }: Props) => {
  const [collection, dispatch] = useImmerReducer(reducer, null);
  const [value] = useLocalStorage({ key: keys, defaultValue: [] });
  
  return (
    <CollectionContext.Provider value={{ collection, dispatch }}>
      {children}
    </CollectionContext.Provider>
  );
};
```

### Server-Side State Patterns

**Database Transaction Management**
```typescript
// Single Entity Operations
async Create(body: CreateArtistSchemaTypes) {
  return await this.db
    .insert(s.authorMain)
    .values(body)
    .onConflictDoUpdate({ target: s.authorMain.uuid, set: { ...body } })
    .returning();
}

// Complex Relationship Operations
async createArtistWithTags(artistData: ArtistInput, tags: string[]) {
  return await this.db.transaction(async (tx) => {
    // Create artist
    const [artist] = await tx.insert(s.authorMain)
      .values(artistData)
      .returning();
    
    // Create tag relationships
    const tagRelations = tags.map(tag => ({
      authorId: artist.uuid,
      tagId: tag
    }));
    
    await tx.insert(s.authorTag).values(tagRelations);
    
    return artist;
  });
}
```

## Data Synchronization

### Real-time Updates

**TanStack Query Cache Management**
```typescript
// Automatic background refetching
const { data, isLoading, error } = trpc.artist.getArtist.useQuery(
  { page: '1' },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  }
);

// Manual cache invalidation
const queryClient = useQueryClient();
const invalidateArtists = () => {
  queryClient.invalidateQueries({ queryKey: ['artist'] });
};
```

### Background Synchronization

**Cron Job Data Sync**
```typescript
// Daily tag count synchronization
export default {
  scheduled(_event: ScheduledEvent, env: ENV_BINDING, ctx: ExecutionContext) {
    const delayedProcessing = async () => {
      const db = initDB(env.DATABASE_URL);
      await syncAuthorTag(db); // Update tag counts from artist relationships
    };
    ctx.waitUntil(delayedProcessing());
  }
};
```

## Search and Filtering

### Advanced Query Builder Architecture

**QueryBuilder Inheritance Pattern**
The system uses an abstract base class for all query builders, ensuring consistency and reusability:

```typescript
// Abstract base class for all query builders
abstract class IQueryBuilder<T extends FetchParams> {
  public fetchParams: T;
  public derivedFetchParams: DerivedFetchParams;
  public db: ReturnType<typeof initDB>;
  
  constructor(params: T, db: ReturnType<typeof initDB>) {
    this.fetchParams = params;
    this.db = db;
    
    // Process common derived parameters
    this.derivedFetchParams = {
      table: processTableName(params.sort?.split(',')[0]),
      sortBy: params.sort?.split(',')[1] === 'asc' ? asc : desc,
      searchTable: processTableName(params.searchTable),
      tagConditions: processTagConditions(params.tag),
    };
  }
  
  abstract BuildQuery(): { SelectQuery: unknown; CountQuery: unknown };
}

// Concrete implementation for Artist queries
export class ArtistQueryBuilder extends IQueryBuilder<ArtistFetchParams> {
  BuildQuery() {
    let selectQuery = this.db
      .select({
        ...FETCH_ARTIST_BASE_OBJECT,
        ...FETCH_TAG_OBJECT
      })
      .from(s.authorMain)
      .leftJoin(s.authorTag, eq(s.authorMain.uuid, s.authorTag.authorId))
      .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
      .groupBy(s.authorMain.uuid)
      .$dynamic();
    
    // Apply filters using derived parameters
    selectQuery = this.applySearchFilters(selectQuery);
    selectQuery = this.applyTagFilters(selectQuery);
    selectQuery = this.applySorting(selectQuery);
    selectQuery = this.applyPagination(selectQuery);
    
    return {
      SelectQuery: { query: selectQuery },
      CountQuery: { query: this.buildCountQuery() }
    };
  }
  
  private applyTagFilters(query: any) {
    if (this.fetchParams.tag) {
      return query.where(this.derivedFetchParams.tagConditions);
    }
    return query;
  }
  
  private applySearchFilters(query: any) {
    if (!this.fetchParams.search) return query;
    
    const searchCondition = this.fetchParams.searchTable === 'tags' 
      ? like(s.tag.tag, `%${this.fetchParams.search}%`)
      : like(s.authorMain.author, `%${this.fetchParams.search}%`);
      
    return query.where(searchCondition);
  }
  
  private buildCountQuery() {
    return this.db
      .select({ totalCount: countDistinct(s.authorMain.uuid) })
      .from(s.authorMain)
      .leftJoin(s.authorTag, eq(s.authorMain.uuid, s.authorTag.authorId))
      .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
      .where(this.derivedFetchParams.tagConditions);
  }
}

// Factory function for dependency injection
export const NewArtistQueryBuilder = (params: ArtistFetchParams, db: Database) => 
  new ArtistQueryBuilder(params, db);
```

**Helper Functions for Query Processing**
```typescript
// Process table names for dynamic sorting
export const processTableName = (tableName?: string) => {
  switch (tableName) {
    case 'author': return s.authorMain;
    case 'tag': return s.tag;
    default: return s.authorMain;
  }
};

// Process tag conditions for filtering
export const processTagConditions = (tags?: string) => {
  if (!tags) return undefined;
  
  const tagArray = tags.split(',').filter(Boolean);
  return tagArray.length > 0 
    ? inArray(s.tag.tag, tagArray)
    : undefined;
};
```

## Error Handling and Loading States

### Frontend Error Boundaries
```typescript
// Query error handling
const { data, isLoading, error, refetch } = trpc.artist.getArtist.useQuery(
  params,
  {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('Failed to fetch artists:', error.message);
      // Show user-friendly error message
    }
  }
);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} onRetry={refetch} />;
```

### Backend Error Responses

**DAO Layer Error Handling (Current Implementation)**
```typescript
// Basic error handling pattern in DAO layer
async FetchById(artistId: string) {
  try {
    const result = await this.db
      .select()
      .from(s.authorMain)
      .where(eq(s.authorMain.uuid, Number(artistId)));
      
    if (!result.length) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    
    return result[0];
  } catch (error) {
    console.error('ArtistDao.FetchById error:', error);
    throw new Error('Failed to fetch artist');
  }
}

// Create operations with conflict handling
async Create(body: CreateArtistSchemaTypes) {
  try {
    const result = await this.db
      .insert(s.authorMain)
      .values(body)
      .onConflictDoUpdate({ 
        target: s.authorMain.uuid, 
        set: { ...body } 
      })
      .returning();
    return result;
  } catch (error) {
    console.log(error); // Note: Basic logging in current implementation
    throw new Error('Failed to create artist');
  }
}
```

**tRPC Error Propagation**
```typescript
// Error handling in tRPC routes
export const trpcArtistRoute = router({
  getArtistById: publicProcedure
    .input(GetArtistByIdSchema)
    .query(async (opts) => {
      try {
        const ArtistDao = NewArtistDao(opts.ctx.db);
        const result = await ArtistDao.FetchById(opts.input.id);
        return result;
      } catch (error) {
        // DAO errors are propagated to tRPC client
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Database operation failed'
        });
      }
    })
});
```

## Performance Optimization

### Query Optimization
- **Pagination**: Always use limit/offset for large result sets
- **Selective Loading**: Only fetch required fields using Drizzle select syntax
- **Join Optimization**: Use appropriate join types based on data relationships
- **Index Usage**: Ensure database indexes on frequently queried columns

### Caching Strategy
- **TanStack Query**: Automatic query result caching with configurable TTL
- **Local Storage**: Collection/bookmark data persisted locally
- **Cloudflare CDN**: Static assets automatically cached at edge

## Implementation Guidelines

### Adding New Data Flow
1. Define TypeScript types in `pkg/type`
2. Create Zod validation schemas
3. Implement DAO methods with proper error handling
4. Add tRPC routes with input validation
5. Create frontend hooks with TanStack Query
6. Handle loading/error states in components

### State Management Choice Guide
- **Server State**: Always use TanStack Query + tRPC
- **Global Client State**: Use Zustand for cross-component state
- **Component State**: Use React Context + Immer for complex local state
- **Form State**: Use React Hook Form with Zod validation
- **Persistent State**: Use Mantine hooks for localStorage integration

## Related Documents
- [System Overview](system-overview.md) - Overall architecture context
- [API Design Guidelines](../standards/api-design-guidelines.md) - API design patterns
- [Common Patterns](../patterns/common-patterns.md) - Reusable implementation patterns