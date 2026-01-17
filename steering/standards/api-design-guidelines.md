# API Design Guidelines

## Purpose
This document establishes patterns and conventions for designing APIs in the Douren system, covering both tRPC procedures and traditional REST endpoints.

## API Documentation (OpenAPI)

REST endpoints should be documented via OpenAPI generated from Zod schemas (so the docs stay in sync with runtime validation).

- Backend dev server exposes the spec at `/openapi.json` and a viewer at `/docs`.
- When adding/changing REST routes, prefer `OpenAPIHono` + `createRoute` with explicit request/response schemas.
- Reuse existing Zod schemas from `@pkg/type` (API-level shapes) and `@pkg/database/zod` (table shapes) where possible.

## tRPC Design Patterns

### Procedure Naming Conventions

**Query Procedures (Read Operations):**
- Use descriptive verbs: `getArtist`, `getArtistById`, `getArtistPageDetails`
- Follow pattern: `get[Entity][OptionalSpecifier]`
- Return data without side effects

**Mutation Procedures (Write Operations):**
- Use action verbs: `createArtist`, `updateArtist`, `deleteArtist`
- Follow pattern: `[action][Entity]`
- Always validate input and return meaningful responses

```typescript
export const trpcArtistRoute = router({
  // Queries
  getArtist: publicProcedure.input(artistInputParams).query(async (opts) => {
    // Implementation
  }),
  
  getArtistById: publicProcedure.input(GetArtistByIdSchema).query(async (opts) => {
    // Implementation
  }),
  
  // Mutations
  createArtist: authProcedure.input(CreateArtistSchema).mutation(async (opts) => {
    // Implementation
  }),
  
  updateArtist: authProcedure.input(UpdateArtistSchema).mutation(async (opts) => {
    // Implementation
  })
});
```

### Input Validation

**Always Use Zod Schemas for Input Validation:**
```typescript
import { z } from "zod";

export const GetArtistByIdSchema = z.object({
  id: z.string().min(1, "Artist ID is required")
});

export const CreateArtistSchema = z.object({
  author: z.string().min(1, "Author name is required"),
  introduction: z.string().optional(),
  twitterLink: z.string().url().optional(),
  tags: z.array(z.string()).optional()
});

export const UpdateArtistSchema = z.object({
  id: z.string(),
  data: CreateArtistSchema.partial() // All fields optional for updates
});
```

**Complex Validation Logic:**
```typescript
export const ArtistInputParams = z.object({
  page: z.string().default("1").transform((val) => {
    const num = parseInt(val, 10);
    return num > 0 ? num : 1;
  }),
  search: z.string().optional(),
  tag: z.string().optional().transform((val) => 
    val ? val.split(',').filter(Boolean) : undefined
  ),
  sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
  searchTable: z.enum(['author', 'tags']).default('author')
});
```

### Response Patterns

**Consistent Response Structure:**
```typescript
// Single entity response
interface SingleEntityResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// List response with pagination
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  success: boolean;
}

// Error response
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

**Implementation in DAO Layer:**
```typescript
export const createPaginationObject = <T>(
  data: T[],
  currentPage: number,
  pageSize: number,
  totalCount: number
): PaginatedResponse<T> => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    data,
    pagination: {
      currentPage,
      totalPages,
      totalCount,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    },
    success: true
  };
};
```

## REST API Design (Legacy/External Integration)

### URL Structure

**Resource-Based URLs:**
```
GET    /artist                    # Get all artists
GET    /artist/:artistId          # Get specific artist
POST   /artist                    # Create new artist
PUT    /artist/:artistId          # Update artist
DELETE /artist/:artistId          # Delete artist

GET    /event                     # Get all events
GET    /event/:eventName          # Get specific event

GET    /tag                       # Get all tags
POST   /tag                       # Create new tag
```

### HTTP Methods and Status Codes

**GET Requests:**
- `200 OK` - Successful retrieval
- `404 Not Found` - Resource doesn't exist
- `400 Bad Request` - Invalid query parameters

**POST Requests:**
- `201 Created` - Resource successfully created
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Resource already exists

**PUT Requests:**
- `200 OK` - Resource successfully updated
- `404 Not Found` - Resource doesn't exist
- `400 Bad Request` - Invalid input data

**DELETE Requests:**
- `200 OK` - Resource successfully deleted
- `404 Not Found` - Resource doesn't exist

### REST Endpoint Implementation

```typescript
const ArtistRoute = new Hono<HonoEnv>()
  .get("/", zValidator("query", artistInputParams), async (c) => {
    try {
      const ArtistDao = NewArtistDao(c.var.db);
      const { page, search, tag, sort, searchTable } = c.req.query();
      
      const result = await ArtistDao.Fetch({
        page, search, tag, sort, searchTable
      });
      
      return c.json(result);
    } catch (error) {
      console.error('Artist fetch error:', error);
      return c.json({ 
        success: false, 
        error: { message: 'Failed to fetch artists' } 
      }, 500);
    }
  })
  
  .post("/", zValidator("json", CreateArtistSchema), async (c) => {
    try {
      const ArtistDao = NewArtistDao(c.var.db);
      const body = await c.req.json();
      
      const result = await ArtistDao.Create(body);
      
      return c.json({ 
        success: true, 
        data: result 
      }, 201);
    } catch (error) {
      console.error('Artist creation error:', error);
      return c.json({ 
        success: false, 
        error: { message: 'Failed to create artist' } 
      }, 500);
    }
  });
```

## Authentication and Authorization

### Procedure-Level Security

**Public vs Authenticated Procedures:**
```typescript
// Public procedures (no auth required)
export const publicProcedure = t.procedure;

// Authenticated procedures (auth required)
export const authProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  
  // Verify authentication
  const isAuthenticated = verifyAdminUser(ctx.honoContext);
  if (!isAuthenticated) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
  }
  
  return opts.next();
});
```

**Authentication Middleware Implementation:**
```typescript
// Admin authentication middleware
const adminAuthMiddleware = async (c: Context<HonoEnv>, next: () => Promise<void>) => {
  const verified = verifyAdminUser(c);
  if (!verified) {
    return c.json({ message: "You are not authorized to perform this actions" }, 401);
  }
  await next();
};

// Image upload authentication middleware  
const imageAuthMiddleware = async (c: Context<HonoEnv>, next: () => Promise<void>) => {
  const verified = verifyImageUser(c);
  if (!verified) {
    return c.json({ message: "Image upload not authorized" }, 401);
  }
  await next();
};
```

**Route-Level Middleware Application:**
```typescript
// Apply middleware to specific routes and methods
app.on(["POST", "PUT", "DELETE"], "/artist/*", adminAuthMiddleware);
app.on(["POST", "PUT", "DELETE"], "/event/*", adminAuthMiddleware);
app.on(["POST"], "/image/*", imageAuthMiddleware);

// Different auth levels for different operations
app.on(["GET"], "/artist/*", /* public routes - no auth */);
app.on(["POST", "PUT", "DELETE"], "/artist/*", adminAuthMiddleware);
```

### Authentication Helpers

**Authentication Helper Implementation:**
```typescript
export const verifyAdminUser = (c: Context<HonoEnv>): boolean => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return validateAuthToken(token);
};

export const verifyImageUser = (c: Context<HonoEnv>): boolean => {
  // Image operations require admin privileges
  return verifyAdminUser(c);
};

// Token validation logic (implement based on your auth system)
const validateAuthToken = (token: string): boolean => {
  // Implement JWT validation, API key checking, or other auth logic
  // This would typically verify against environment variables or external auth service
  return token === process.env.ADMIN_API_TOKEN; // Simplified example
};
```

**Using Authentication in Route Handlers:**
```typescript
// Manual authentication check in individual routes
const artistRoute = new Hono<HonoEnv>()
  .post("/", async (c) => {
    if (!verifyAdminUser(c)) {
      return c.json({ message: "Unauthorized" }, 401);
    }
    
    // Proceed with protected operation
    const body = await c.req.json();
    // ... rest of the logic
  });
```

## Error Handling Patterns

### tRPC Error Handling

**Standardized Error Types:**
```typescript
import { TRPCError } from '@trpc/server';

// Not found errors
throw new TRPCError({
  code: 'NOT_FOUND',
  message: `Artist with ID ${artistId} not found`
});

// Validation errors
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid input data',
  cause: zodError
});

// Authorization errors
throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'Admin access required'
});

// Server errors
throw new TRPCError({
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Database operation failed'
});
```

**Error Handling in Procedures:**
```typescript
getArtistById: publicProcedure
  .input(GetArtistByIdSchema)
  .query(async (opts) => {
    try {
      const ArtistDao = NewArtistDao(opts.ctx.db);
      const result = await ArtistDao.FetchById(opts.input.id);
      
      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Artist with ID ${opts.input.id} not found`
        });
      }
      
      return result;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Unexpected error in getArtistById:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch artist'
      });
    }
  })
```

## Query Optimization Patterns

### Efficient Data Fetching

**Selective Field Loading:**
```typescript
// Only fetch required fields
const artistSummary = await db
  .select({
    uuid: s.authorMain.uuid,
    author: s.authorMain.author,
    photo: s.authorMain.photo
  })
  .from(s.authorMain);

// Full artist details when needed
const artistDetails = await db
  .select({
    ...FETCH_ARTIST_BASE_OBJECT,
    ...FETCH_TAG_OBJECT
  })
  .from(s.authorMain)
  .leftJoin(/* joins for related data */);
```

**Pagination Implementation:**
```typescript
export class ArtistQueryBuilder {
  private applyPagination(query: SelectQueryBuilder) {
    const offset = (this.params.page - 1) * PAGE_SIZE;
    return query
      .limit(PAGE_SIZE)
      .offset(offset);
  }
  
  buildCountQuery() {
    // Separate count query for pagination
    return this.db
      .select({ totalCount: count() })
      .from(s.authorMain)
      .where(/* same filters as main query */);
  }
}
```

**Query Batching:**
```typescript
async Fetch(params: ArtistFetchParams) {
  const QueryBuilder = NewArtistQueryBuilder(params, this.db);
  const { SelectQuery, CountQuery } = QueryBuilder.BuildQuery();
  
  // Execute both queries in parallel
  const [data, [counts]] = await Promise.all([
    SelectQuery.query,
    CountQuery.query,
  ]);
  
  return createPaginationObject(data, params.page, PAGE_SIZE, counts.totalCount);
}
```

## Frontend Integration

### tRPC Client Usage

**Query Implementation:**
```typescript
// Basic query
const { data: artists, isLoading, error } = trpc.artist.getArtist.useQuery({
  page: '1',
  search: searchTerm,
  tag: selectedTags.join(',')
});

// Query with options
const { data: artist } = trpc.artist.getArtistById.useQuery(
  { id: artistId },
  {
    enabled: !!artistId, // Only run when artistId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3
  }
);
```

**Mutation Implementation:**
```typescript
const createArtist = trpc.artist.createArtist.useMutation({
  onMutate: async (newArtist) => {
    // Optimistic update
    await queryClient.cancelQueries({ queryKey: ['artist'] });
    
    const previousArtists = queryClient.getQueryData(['artist']);
    queryClient.setQueryData(['artist'], (old: any) => ({
      ...old,
      data: [...(old?.data || []), { ...newArtist, uuid: Date.now() }]
    }));
    
    return { previousArtists };
  },
  
  onError: (err, newArtist, context) => {
    // Rollback optimistic update
    if (context?.previousArtists) {
      queryClient.setQueryData(['artist'], context.previousArtists);
    }
  },
  
  onSuccess: (data) => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['artist'] });
  }
});
```

## Performance Considerations

### Database Query Performance
- Use database indexes on frequently queried columns
- Implement connection pooling for database connections
- Cache expensive queries at the application level
- Use appropriate SQL joins instead of multiple queries

### API Response Optimization
- Implement pagination for all list endpoints
- Use compression for large responses
- Implement proper HTTP caching headers
- Consider implementing GraphQL-style field selection

### Monitoring and Observability
- Log all API requests with timing information
- Implement health check endpoints
- Use structured logging for better debugging
- Monitor database query performance

## Implementation Guidelines

### Adding New API Endpoints

**tRPC Procedure:**
1. Define input/output schemas with Zod
2. Choose appropriate procedure type (public/auth)
3. Implement with comprehensive error handling
4. Add input validation
5. Test with both success and error cases

**REST Endpoint:**
1. Define URL structure following conventions
2. Implement request validation middleware
3. Add proper HTTP status codes
4. Implement consistent error responses
5. Add authentication middleware if required

### API Evolution
- Use semantic versioning for breaking changes
- Maintain backward compatibility when possible
- Deprecate old endpoints gradually
- Document all changes in API changelog

## Related Documents
- [System Overview](../architecture/system-overview.md) - Architecture context
- [Data Flow Patterns](../architecture/data-flow.md) - Data flow and state management
- [Coding Standards](coding-standards.md) - General coding conventions
- [Common Patterns](../patterns/common-patterns.md) - Implementation patterns
