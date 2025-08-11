# Anti-Patterns

## Purpose
This document identifies problematic patterns, practices, and approaches that should be avoided in the Douren system. Learning from these anti-patterns helps maintain code quality, system performance, and development productivity.

## Component Anti-Patterns

### Massive Components

**Problem**: Single components trying to handle too many responsibilities

**Anti-Pattern Example:**
```typescript
// BAD: Component handling data fetching, state management, and multiple UI concerns
export const ArtistPageComponent = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  // 200+ lines of mixed logic...
  
  return (
    <div>
      {/* 300+ lines of JSX */}
    </div>
  );
};
```

**Better Approach:**
```typescript
// GOOD: Split into focused components
export const ArtistPage = () => {
  return (
    <div>
      <ArtistFilters />
      <ArtistGrid />
      <PaginationControls />
    </div>
  );
};

export const ArtistGrid = () => {
  const { artists, loading, error } = useArtistData();
  // Focused on display logic only
};
```

**Why It's Bad:**
- Hard to test individual pieces
- Difficult to reuse parts of the component
- Complex state management
- Poor performance due to unnecessary re-renders

### Prop Drilling Hell

**Anti-Pattern**: Passing props through multiple component layers unnecessarily

```typescript
// BAD: Passing data through many levels
export const App = () => {
  const userData = useUserData();
  return <Layout userData={userData} />;
};

export const Layout = ({ userData }) => {
  return <Content userData={userData} />;
};

export const Content = ({ userData }) => {
  return <ArtistCard userData={userData} />;
};

export const ArtistCard = ({ userData }) => {
  // Finally uses userData
};
```

**Better Approach**: Use Context or component composition
```typescript
// GOOD: Context for shared state
export const UserProvider = ({ children }) => {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export const ArtistCard = () => {
  const userData = useUserContext(); // Direct access
};
```

## State Management Anti-Patterns

### State Mutation

**Problem**: Directly mutating state objects instead of creating new ones

```typescript
// BAD: Direct mutation
const [artists, setArtists] = useState([]);

const addArtist = (newArtist) => {
  artists.push(newArtist); // Mutating existing array
  setArtists(artists); // React won't detect the change
};

const updateArtist = (id, updates) => {
  const artist = artists.find(a => a.id === id);
  artist.name = updates.name; // Mutating object
  setArtists(artists);
};
```

### Side Effects in Reducers (CURRENT CODEBASE ISSUE)

**Problem**: Performing side effects directly within reducers instead of keeping them pure

**Real Anti-Pattern Found in Codebase:**
```typescript
// BAD: Side effects in reducer (current implementation)
function reducer(
  draft: eventArtistBaseSchemaType[] | null,
  { action, keys: key, data }: ActionType,
) {
  switch (action) {
    case "add": {
      if (data && draft) {
        draft.push(data);
        localStorage.setItem(key, JSON.stringify(draft)); // SIDE EFFECT IN REDUCER
      }
      return draft;
    }
    case "remove": {
      if (draft && data) {
        const i = draft.findIndex((item) => item?.boothName === data.boothName);
        draft.splice(i, 1);
        localStorage.setItem(key, JSON.stringify(draft)); // SIDE EFFECT IN REDUCER
      }
      return draft;
    }
    case "clear": {
      localStorage.removeItem(key); // SIDE EFFECT IN REDUCER
      return [];
    }
  }
}
```

**Why It's Bad:**
- Reducers should be pure functions
- Makes testing difficult (localStorage dependency)
- Violates React state management principles
- Creates tight coupling between state logic and storage

**Better Approach**: Handle side effects in useEffect hooks
```typescript
// GOOD: Pure reducer + useEffect for side effects
function pureReducer(draft: T[] | null, { action, data }: ActionType) {
  switch (action) {
    case "add":
      if (data && draft) {
        draft.push(data);
      }
      break;
    case "remove":
      return draft?.filter(item => item.uuid !== data?.uuid) || null;
    case "clear":
      return [];
  }
}

// Handle side effects in component
export const CollectionProvider = ({ children, keys }: Props) => {
  const [collection, dispatch] = useImmerReducer(pureReducer, null);
  
  // Side effect handled properly in useEffect
  useEffect(() => {
    if (collection !== null) {
      localStorage.setItem(keys, JSON.stringify(collection));
    }
  }, [collection, keys]);
  
  return (
    <CollectionContext.Provider value={{ collection, dispatch }}>
      {children}
    </CollectionContext.Provider>
  );
};
```

**Better Approach**: Immutable updates (use Immer when complexity grows)
```typescript
// GOOD: Immutable updates
const addArtist = (newArtist) => {
  setArtists(prev => [...prev, newArtist]);
};

const updateArtist = (id, updates) => {
  setArtists(prev => 
    prev.map(artist => 
      artist.id === id ? { ...artist, ...updates } : artist
    )
  );
};

// BETTER: Use Immer for complex updates
const updateArtistWithImmer = (id, updates) => {
  setArtists(produce(draft => {
    const artist = draft.find(a => a.id === id);
    if (artist) {
      Object.assign(artist, updates);
    }
  }));
};
```

### Global State Abuse

**Problem**: Putting everything in global state when local state would suffice

```typescript
// BAD: Form state in global store
interface GlobalState {
  artists: Artist[];
  events: Event[];
  // Form-specific state shouldn't be global
  artistFormData: ArtistFormData;
  artistFormErrors: FormErrors;
  artistFormStep: number;
}
```

**Better Approach**: Use local state for component-specific data
```typescript
// GOOD: Local form state
export const ArtistForm = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  
  // Only put data in global state that needs to be shared
  const createArtist = trpc.artist.create.useMutation();
};
```

## Data Fetching Anti-Patterns

### Waterfall Requests

**Problem**: Sequential API calls when they could be parallel

```typescript
// BAD: Sequential requests
export const ArtistPage = ({ artistId }) => {
  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState(null);
  const [events, setEvents] = useState(null);
  
  useEffect(() => {
    fetchArtist(artistId).then(artistData => {
      setArtist(artistData);
      
      // Waiting for artist before fetching products
      fetchArtistProducts(artistId).then(productData => {
        setProducts(productData);
        
        // Waiting for products before fetching events
        fetchArtistEvents(artistId).then(eventData => {
          setEvents(eventData);
        });
      });
    });
  }, [artistId]);
};
```

**Better Approach**: Parallel requests when possible
```typescript
// GOOD: Parallel requests using tRPC
export const ArtistPage = ({ artistId }) => {
  const artistQuery = trpc.artist.getById.useQuery({ id: artistId });
  const productsQuery = trpc.artist.getProducts.useQuery({ artistId });
  const eventsQuery = trpc.artist.getEvents.useQuery({ artistId });
  
  // All requests happen in parallel
  const isLoading = artistQuery.isLoading || productsQuery.isLoading || eventsQuery.isLoading;
};
```

### Fetch on Every Render

**Problem**: Making API calls without proper dependency management

```typescript
// BAD: Fetching on every render
export const ArtistList = ({ filters }) => {
  const [artists, setArtists] = useState([]);
  
  // This runs on EVERY render
  fetchArtists(filters).then(setArtists);
  
  return <div>{/* render artists */}</div>;
};
```

**Better Approach**: Proper dependency management
```typescript
// GOOD: Proper useEffect dependencies
export const ArtistList = ({ filters }) => {
  const { data: artists } = trpc.artist.getAll.useQuery(filters, {
    // TanStack Query handles caching and deduplication
  });
  
  return <div>{/* render artists */}</div>;
};
```

## Database and API Anti-Patterns

### N+1 Query Problem

**Problem**: Making separate database queries for related data

```typescript
// BAD: N+1 queries in DAO
export class ArtistDao {
  async getArtistsWithTags() {
    const artists = await this.db.select().from(s.authorMain);
    
    // N+1: One query per artist for tags
    for (const artist of artists) {
      artist.tags = await this.db
        .select()
        .from(s.authorTag)
        .where(eq(s.authorTag.artistId, artist.uuid));
    }
    
    return artists;
  }
}
```

**Better Approach**: Single query with joins
```typescript
// GOOD: Single query with proper joins
export class ArtistDao {
  async getArtistsWithTags() {
    return await this.db
      .select({
        ...FETCH_ARTIST_BASE_OBJECT,
        tags: sql`jsonb_agg(${s.tag.tag})`.as("tags")
      })
      .from(s.authorMain)
      .leftJoin(s.authorTag, eq(s.authorMain.uuid, s.authorTag.authorId))
      .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag))
      .groupBy(s.authorMain.uuid);
  }
}
```

### Missing Pagination

**Problem**: Returning unlimited results from list endpoints

```typescript
// BAD: No pagination
export const getArtists = async () => {
  // Returns ALL artists - could be thousands
  return await db.select().from(s.authorMain);
};
```

**Better Approach**: Always paginate list endpoints
```typescript
// GOOD: Proper pagination
export const getArtists = async (page: number, limit: number = PAGE_SIZE) => {
  const offset = (page - 1) * limit;
  
  const [data, [{ count }]] = await Promise.all([
    db.select().from(s.authorMain).limit(limit).offset(offset),
    db.select({ count: sql`COUNT(*)` }).from(s.authorMain)
  ]);
  
  return createPaginationObject(data, page, limit, count);
};
```

### SQL Injection Vulnerabilities

**Problem**: Building queries with string concatenation

```typescript
// BAD: String concatenation (vulnerable to SQL injection)
const searchArtists = async (searchTerm: string) => {
  const query = `
    SELECT * FROM author_main 
    WHERE author LIKE '%${searchTerm}%'
  `;
  return await db.execute(query);
};
```

**Better Approach**: Use ORM parameterized queries
```typescript
// GOOD: Parameterized queries with Drizzle
const searchArtists = async (searchTerm: string) => {
  return await db
    .select()
    .from(s.authorMain)
    .where(like(s.authorMain.author, `%${searchTerm}%`));
};
```

## Error Handling Anti-Patterns

### Silent Failures

**Problem**: Catching errors without proper handling or logging

```typescript
// BAD: Silent failure
export const ArtistCard = ({ artistId }) => {
  const [artist, setArtist] = useState(null);
  
  useEffect(() => {
    fetchArtist(artistId)
      .then(setArtist)
      .catch(() => {
        // Error is silently ignored
      });
  }, [artistId]);
  
  // Component might render empty with no indication of error
  return <div>{artist?.name}</div>;
};
```

### Inconsistent Error Handling (CURRENT CODEBASE ISSUE)

**Problem**: Inconsistent error handling patterns across the codebase

**Real Anti-Pattern Found in Backend:**
```typescript
// BAD: Inconsistent error handling in DAO layer (current implementation)
async Create(body: CreateArtistSchemaTypes) {
  try {
    const result = await this.db
      .insert(s.authorMain)
      .values(body)
      .onConflictDoUpdate({ target: s.authorMain.uuid, set: { ...body } })
      .returning();
    return result;
  } catch (error) {
    console.log(error); // BAD: Just console.log, no proper error handling
    // No throw or proper error propagation
  }
}

// BAD: Mixed error handling patterns
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
    console.error('ArtistDao.FetchById error:', error); // Inconsistent logging
    throw new Error('Failed to fetch artist'); // Good: proper error propagation
  }
}
```

**Why It's Bad:**
- Inconsistent error logging across methods
- Some methods don't propagate errors properly
- Basic console.log instead of structured error handling
- Makes debugging and monitoring difficult

**Better Approach**: Consistent error handling pattern
```typescript
// GOOD: Consistent error handling
async Create(body: CreateArtistSchemaTypes) {
  try {
    const result = await this.db
      .insert(s.authorMain)
      .values(body)
      .onConflictDoUpdate({ target: s.authorMain.uuid, set: { ...body } })
      .returning();
    return result;
  } catch (error) {
    console.error('ArtistDao.Create error:', error); // Consistent logging pattern
    throw new Error('Failed to create artist'); // Always propagate errors
  }
}

// BETTER: Structured error handling with context
async Create(body: CreateArtistSchemaTypes) {
  try {
    const result = await this.db
      .insert(s.authorMain)
      .values(body)
      .onConflictDoUpdate({ target: s.authorMain.uuid, set: { ...body } })
      .returning();
    return result;
  } catch (error) {
    const errorContext = {
      operation: 'ArtistDao.Create',
      input: body,
      error: error.message
    };
    console.error('Database operation failed:', errorContext);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create artist',
      cause: error
    });
  }
}
```

**Better Approach**: Proper error handling and user feedback
```typescript
// GOOD: Proper error handling
export const ArtistCard = ({ artistId }) => {
  const { data: artist, error, isLoading } = trpc.artist.getById.useQuery(
    { id: artistId },
    {
      retry: 3,
      onError: (error) => {
        console.error('Failed to load artist:', error);
        // Could also show toast notification
      }
    }
  );
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{artist.name}</div>;
};
```

### Generic Error Messages

**Problem**: Showing unhelpful error messages to users

```typescript
// BAD: Generic error handling
const handleSubmit = async (data) => {
  try {
    await createArtist(data);
  } catch (error) {
    setError("Something went wrong"); // Unhelpful
  }
};
```

**Better Approach**: Specific, actionable error messages
```typescript
// GOOD: Specific error handling
const handleSubmit = async (data) => {
  try {
    await createArtist(data);
  } catch (error) {
    if (error instanceof ZodError) {
      setError("Please check the required fields and try again");
    } else if (error.code === 'CONFLICT') {
      setError("An artist with this name already exists");
    } else {
      setError("Failed to create artist. Please try again later");
    }
  }
};
```

## Performance Anti-Patterns

### Unnecessary Re-Renders

**Problem**: Components re-rendering when they don't need to

```typescript
// BAD: Object creation in render
export const ArtistGrid = ({ artists }) => {
  return (
    <div>
      {artists.map(artist => (
        <ArtistCard 
          key={artist.id}
          artist={artist}
          // New object created on every render
          style={{ margin: '10px' }}
          // New function created on every render
          onClick={() => handleClick(artist.id)}
        />
      ))}
    </div>
  );
};
```

**Better Approach**: Memoize expensive operations
```typescript
// GOOD: Stable references
export const ArtistGrid = ({ artists }) => {
  const cardStyle = useMemo(() => ({ margin: '10px' }), []);
  
  const handleClick = useCallback((artistId) => {
    // Handle click logic
  }, []);
  
  return (
    <div>
      {artists.map(artist => (
        <ArtistCard 
          key={artist.id}
          artist={artist}
          style={cardStyle}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};
```

### Loading Everything Upfront

**Problem**: Loading all data and components immediately

```typescript
// BAD: Loading everything immediately
export const App = () => {
  return (
    <div>
      <Header />
      <ArtistSection />
      <EventSection />
      <ProductSection />
      <GallerySection />
      {/* All components load immediately */}
    </div>
  );
};
```

**Better Approach**: Lazy loading and code splitting
```typescript
// GOOD: Lazy loading
const LazyEventSection = React.lazy(() => import('./EventSection'));
const LazyProductSection = React.lazy(() => import('./ProductSection'));
const LazyGallerySection = React.lazy(() => import('./GallerySection'));

export const App = () => {
  return (
    <div>
      <Header />
      <ArtistSection />
      
      <Suspense fallback={<div>Loading events...</div>}>
        <LazyEventSection />
      </Suspense>
      
      <Suspense fallback={<div>Loading products...</div>}>
        <LazyProductSection />
      </Suspense>
      
      <Suspense fallback={<div>Loading gallery...</div>}>
        <LazyGallerySection />
      </Suspense>
    </div>
  );
};
```

## Architecture Anti-Patterns

### Circular Dependencies

**Problem**: Modules importing each other creating circular references

```typescript
// BAD: Circular dependency
// artistHelper.ts
import { processEventData } from './eventHelper';

export const processArtistData = (artist) => {
  return {
    ...artist,
    events: processEventData(artist.events)
  };
};

// eventHelper.ts
import { processArtistData } from './artistHelper'; // Circular!

export const processEventData = (events) => {
  return events.map(event => ({
    ...event,
    artists: event.artists.map(processArtistData)
  }));
};
```

**Better Approach**: Extract shared dependencies
```typescript
// GOOD: Shared utilities
// dataProcessors.ts
export const processArtistBase = (artist) => {
  // Base artist processing
};

export const processEventBase = (event) => {
  // Base event processing
};

// artistHelper.ts
import { processArtistBase, processEventBase } from './dataProcessors';

// eventHelper.ts
import { processEventBase, processArtistBase } from './dataProcessors';
```

### God Objects/Classes

**Problem**: Single classes or objects handling too many responsibilities

```typescript
// BAD: God class
export class ArtistManager {
  // Database operations
  async createArtist(data) { ... }
  async updateArtist(id, data) { ... }
  async deleteArtist(id) { ... }
  
  // Validation
  validateArtistData(data) { ... }
  
  // Image processing
  processArtistImages(images) { ... }
  
  // Social media integration
  syncSocialMediaData(artistId) { ... }
  
  // Email notifications
  sendArtistWelcomeEmail(artistId) { ... }
  
  // Search and filtering
  searchArtists(filters) { ... }
  
  // Analytics
  trackArtistEngagement(artistId) { ... }
}
```

**Better Approach**: Single Responsibility Principle
```typescript
// GOOD: Focused classes
export class ArtistDao {
  async create(data) { ... }
  async update(id, data) { ... }
  async delete(id) { ... }
}

export class ArtistValidator {
  validate(data) { ... }
}

export class ImageProcessor {
  processImages(images) { ... }
}

export class SocialMediaSync {
  syncData(artistId) { ... }
}
```

## Testing Anti-Patterns

### Testing Implementation Details

**Problem**: Tests that break when implementation changes but behavior stays the same

```typescript
// BAD: Testing internal state
test('artist form state management', () => {
  const { getByTestId } = render(<ArtistForm />);
  const component = getByTestId('artist-form');
  
  // Testing internal implementation details
  expect(component.state.formData).toEqual({});
  expect(component.state.errors).toEqual({});
  expect(component.state.isSubmitting).toBe(false);
});
```

**Better Approach**: Test behavior, not implementation
```typescript
// GOOD: Testing user-visible behavior
test('artist form submission', async () => {
  const mockSubmit = jest.fn();
  const { getByLabelText, getByRole } = render(
    <ArtistForm onSubmit={mockSubmit} />
  );
  
  // Test user interactions
  await userEvent.type(getByLabelText(/artist name/i), 'Test Artist');
  await userEvent.click(getByRole('button', { name: /submit/i }));
  
  // Test expected outcomes
  expect(mockSubmit).toHaveBeenCalledWith({ name: 'Test Artist' });
});
```

### No Error Case Testing

**Problem**: Only testing happy paths and ignoring error scenarios

```typescript
// BAD: Only testing success cases
test('fetches artist data', async () => {
  const mockArtist = { id: 1, name: 'Test Artist' };
  mockApiCall.mockResolvedValue(mockArtist);
  
  render(<ArtistCard artistId={1} />);
  
  expect(await screen.findByText('Test Artist')).toBeInTheDocument();
});
```

**Better Approach**: Test both success and failure cases
```typescript
// GOOD: Testing error scenarios
test('handles artist fetch error', async () => {
  mockApiCall.mockRejectedValue(new Error('Network error'));
  
  render(<ArtistCard artistId={1} />);
  
  expect(await screen.findByText(/failed to load artist/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
});

test('handles artist not found', async () => {
  mockApiCall.mockResolvedValue(null);
  
  render(<ArtistCard artistId={999} />);
  
  expect(await screen.findByText(/artist not found/i)).toBeInTheDocument();
});
```

## Implementation Guidelines

### Recognizing Anti-Patterns

**Warning Signs:**
- Components over 200 lines
- Functions with more than 10 parameters
- Deeply nested conditional logic (> 3 levels)
- Copy-pasted code blocks
- Functions that do multiple unrelated things
- Tests that break frequently with refactoring
- Performance issues that get progressively worse

### Prevention Strategies

**Code Review Checklist:**
- [ ] Single Responsibility: Does each function/component have one clear purpose?
- [ ] Error Handling: Are errors properly caught and communicated?
- [ ] Performance: Are there unnecessary re-renders or expensive operations?
- [ ] Testing: Are both success and error cases covered?
- [ ] Dependencies: Are circular dependencies avoided?
- [ ] State Management: Is state kept as local as possible?

**Refactoring Approach:**
1. **Identify**: Use code metrics and review to find problematic patterns
2. **Prioritize**: Focus on anti-patterns that impact performance or maintainability most
3. **Test First**: Ensure good test coverage before refactoring
4. **Small Steps**: Make incremental changes rather than large rewrites
5. **Review**: Have team members review anti-pattern fixes

## Related Documents
- [Common Patterns](common-patterns.md) - Preferred patterns to use instead
- [Coding Standards](../standards/coding-standards.md) - Standards that prevent anti-patterns
- [Performance Guidelines](../context/technical-constraints.md) - Performance-related constraints