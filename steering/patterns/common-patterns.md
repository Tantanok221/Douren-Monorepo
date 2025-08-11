# Common Patterns

## Purpose
This document outlines reusable implementation patterns used throughout the Douren system. These patterns provide proven solutions for common development challenges and ensure consistency across the codebase.

## Component Patterns

### Compound Component Pattern

**Used extensively for complex UI components that have multiple related parts:**

```typescript
// Main component with attached subcomponents
export const ArtistCard: React.FC<ArtistCardProps> & {
  ImageContainer: typeof ImageContainer;
  DMButton: typeof ArtistDMButton;
  LinkContainer: typeof ArtistLinkContainer;
  TagContainer: typeof ArtistTagContainer;
  DayContainer: typeof DayContainer;
  HeaderContainer: typeof HeaderContainer;
  RightContainer: typeof RightContainer;
  TitleContainer: typeof TitleContainer;
} = ({ index, children, data }: ArtistCardProps) => {
  return (
    <EventDataContext.Provider value={data}>
      <motion.div className="artistCard" custom={index}>
        {children}
      </motion.div>
    </EventDataContext.Provider>
  );
};

// Attach subcomponents
ArtistCard.ImageContainer = ImageContainer;
ArtistCard.DMButton = ArtistDMButton;
ArtistCard.LinkContainer = ArtistLinkContainer;
// ... more subcomponents

// Usage
<ArtistCard data={artistData}>
  <ArtistCard.ImageContainer />
  <ArtistCard.HeaderContainer>
    <ArtistCard.TitleContainer />
    <ArtistCard.DMButton />
  </ArtistCard.HeaderContainer>
  <ArtistCard.TagContainer />
</ArtistCard>
```

**Benefits:**
- Flexible composition
- Type-safe subcomponent access
- Clear component relationships
- Reusable subcomponents

### Context Provider Pattern

**For sharing data and state between related components:**

```typescript
// Context definition
export interface ActionType {
  action: "add" | "remove";
  keys: string;
  data: eventArtistBaseSchemaType | undefined;
}

interface ContextProps {
  collection: eventArtistBaseSchemaType[] | null;
  dispatch: React.Dispatch<ActionType>;
}

export const CollectionContext = createContext<null | ContextProps>(null);

// Current Provider Implementation (with localStorage side effects)
export const CollectionProvider = ({ children, keys }: Props) => {
  const [collection, dispatch] = useImmerReducer(reducer, null);
  const [value] = useLocalStorage({ key: keys, defaultValue: [] });
  
  // Initialize from localStorage
  useEffect(() => {
    dispatch({ action: "initialize", keys, data: value });
  }, [value, keys]);
  
  return (
    <CollectionContext.Provider value={{ collection, dispatch }}>
      {children}
    </CollectionContext.Provider>
  );
};

// Recommended Provider Pattern (cleaner separation of concerns)
export const CollectionProviderRecommended = ({ children, keys }: Props) => {
  const [collection, dispatch] = useImmerReducer(reducerWithoutSideEffects, null);
  const [value, setValue] = useLocalStorage({ key: keys, defaultValue: [] });
  
  // Initialize from localStorage
  useEffect(() => {
    dispatch({ action: "initialize", data: value });
  }, [value]);
  
  // Sync to localStorage on collection changes (side effect handled in effect)
  useEffect(() => {
    if (collection !== null) {
      setValue(collection);
    }
  }, [collection, setValue]);
  
  return (
    <CollectionContext.Provider value={{ collection, dispatch }}>
      {children}
    </CollectionContext.Provider>
  );
};

// Custom hook for consuming context
export const useCollectionContext = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollectionContext must be used within CollectionProvider');
  }
  return context;
};
```

**Usage Pattern:**
```typescript
// Wrap components that need access to collection data
<CollectionProvider keys="artist-collection">
  <ArtistGrid />
  <CollectionSidebar />
</CollectionProvider>

// Use in child components
const BookmarkButton = () => {
  const { collection, dispatch } = useCollectionContext();
  
  const handleBookmark = () => {
    dispatch({ action: "add", data: artistData });
  };
  
  return <button onClick={handleBookmark}>Bookmark</button>;
};
```

## State Management Patterns

### Immer Reducer Pattern

**For complex state updates with immutable operations:**

```typescript
// IMPORTANT: Current implementation has localStorage side effects in reducer
// This is being documented as-is but should be refactored to remove side effects

function reducer(
  draft: eventArtistBaseSchemaType[] | null,
  { action, keys: key, data }: ActionType,
) {
  switch (action) {
    case "add": {
      if (data && draft) {
        draft.push(data);
        localStorage.setItem(key, JSON.stringify(draft)); // Side effect in reducer
      }
      return draft;
    }
    case "remove": {
      if (draft && data) {
        const i = draft.findIndex((item) => item?.boothName === data.boothName);
        draft.splice(i, 1);
        localStorage.setItem(key, JSON.stringify(draft)); // Side effect in reducer
      }
      return draft;
    }
    case "clear": {
      localStorage.removeItem(key); // Side effect in reducer
      return [];
    }
    case "initialize": {
      return data || [];
    }
  }
}

// Better pattern (recommended for future refactoring)
function reducerWithoutSideEffects(
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
    case "clear":
      return [];
    case "initialize":
      return data || [];
  }
}

export const useCollectionReducer = (initialState: any) => {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  return [state, dispatch];
};
```

### Zustand Store Pattern

**For global state management:**

```typescript
interface TagFilterState {
  selectedTags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  clearTags: () => void;
  hasTag: (tag: string) => boolean;
}

export const useTagFilter = create<TagFilterState>()((set, get) => ({
  selectedTags: [],
  
  addTag: (tag) => set((state) => ({ 
    selectedTags: [...state.selectedTags, tag] 
  })),
  
  removeTag: (tag) => set((state) => ({ 
    selectedTags: state.selectedTags.filter(t => t !== tag) 
  })),
  
  clearTags: () => set({ selectedTags: [] }),
  
  hasTag: (tag) => get().selectedTags.includes(tag)
}));

// Persist store to localStorage
export const useTagFilterPersisted = create<TagFilterState>()(
  persist(
    (set, get) => ({
      // ... same implementation
    }),
    {
      name: 'tag-filter-storage',
    }
  )
);
```

## Data Access Patterns

### DAO (Data Access Object) Pattern

**Standardized database access with consistent error handling:**

```typescript
// Base interface for all DAOs
export interface BaseDao {
  Create?(data: any): Promise<any>;
  Fetch?(params: any): Promise<any>;
  FetchById?(id: string): Promise<any>;
  Update?(id: string, data: any): Promise<any>;
  Delete?(id: string): Promise<any>;
}

// Implementation
export class ArtistDao implements BaseDao {
  constructor(private db: ReturnType<typeof initDB>) {}
  
  async Fetch(params: ArtistFetchParams) {
    try {
      const QueryBuilder = NewArtistQueryBuilder(params, this.db);
      const { SelectQuery, CountQuery } = QueryBuilder.BuildQuery();
      
      const [data, [counts]] = await Promise.all([
        SelectQuery.query,
        CountQuery.query,
      ]);
      
      return createPaginationObject(
        data,
        Number(params.page),
        PAGE_SIZE,
        counts.totalCount,
      );
    } catch (error) {
      console.error('ArtistDao.Fetch error:', error);
      throw new Error('Failed to fetch artists');
    }
  }
  
  async Create(body: CreateArtistSchemaTypes) {
    try {
      return await this.db
        .insert(s.authorMain)
        .values(body)
        .onConflictDoUpdate({ 
          target: s.authorMain.uuid, 
          set: { ...body } 
        })
        .returning();
    } catch (error) {
      console.error('ArtistDao.Create error:', error);
      throw new Error('Failed to create artist');
    }
  }
}

// Factory function for dependency injection
export const NewArtistDao = (db: Database) => new ArtistDao(db);
```

### Query Builder Pattern

**Dynamic SQL query construction:**

```typescript
export class ArtistQueryBuilder {
  constructor(
    private params: ArtistFetchParams, 
    private db: ReturnType<typeof initDB>
  ) {}
  
  BuildQuery() {
    let selectQuery = this.db
      .select({
        ...FETCH_ARTIST_BASE_OBJECT,
        ...FETCH_TAG_OBJECT
      })
      .from(s.authorMain)
      .leftJoin(s.authorTag, eq(s.authorMain.uuid, s.authorTag.authorId))
      .leftJoin(s.tag, eq(s.authorTag.tagId, s.tag.tag));
    
    // Chain query modifications
    selectQuery = this.applySearchFilters(selectQuery);
    selectQuery = this.applyTagFilters(selectQuery);
    selectQuery = this.applySorting(selectQuery);
    selectQuery = this.applyPagination(selectQuery);
    selectQuery = this.applyGrouping(selectQuery);
    
    return {
      SelectQuery: { query: selectQuery },
      CountQuery: { query: this.buildCountQuery() }
    };
  }
  
  private applySearchFilters(query: SelectQueryBuilder) {
    if (!this.params.search) return query;
    
    const searchCondition = this.params.searchTable === 'tags' 
      ? like(s.tag.tag, `%${this.params.search}%`)
      : like(s.authorMain.author, `%${this.params.search}%`);
      
    return query.where(searchCondition);
  }
  
  private applyTagFilters(query: SelectQueryBuilder) {
    if (!this.params.tag) return query;
    
    const tags = this.params.tag.split(',');
    return query.where(
      processTagConditions(tags)
    );
  }
  
  private applySorting(query: SelectQueryBuilder) {
    switch (this.params.sort) {
      case 'newest':
        return query.orderBy(desc(s.authorMain.uuid));
      case 'oldest':
        return query.orderBy(asc(s.authorMain.uuid));
      case 'popular':
        return query.orderBy(desc(sql`COUNT(${s.authorProduct.id})`));
      default:
        return query.orderBy(desc(s.authorMain.uuid));
    }
  }
}

// Factory function
export const NewArtistQueryBuilder = (params: ArtistFetchParams, db: Database) => 
  new ArtistQueryBuilder(params, db);
```

## Advanced Data Access Patterns

### QueryBuilder Inheritance Pattern

**Abstract Base Class for Query Builders:**

```typescript
// Abstract base class providing common query building functionality
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
  
  // Abstract method that concrete implementations must provide
  abstract BuildQuery(): { SelectQuery: unknown; CountQuery: unknown };
  
  // Common helper methods available to all query builders
  protected applyPagination(query: any): any {
    const offset = (Number(this.fetchParams.page) - 1) * PAGE_SIZE;
    return query.limit(PAGE_SIZE).offset(offset);
  }
  
  protected applySorting(query: any): any {
    return query.orderBy(this.derivedFetchParams.sortBy(this.derivedFetchParams.table.uuid));
  }
}

// Concrete implementation for Artist queries
export class ArtistQueryBuilder extends IQueryBuilder<ArtistFetchParams> {
  BuildQuery() {
    // Build main select query
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
    
    // Apply filters using base class methods and custom logic
    selectQuery = this.applyFilters(selectQuery);
    selectQuery = this.applySorting(selectQuery);
    selectQuery = this.applyPagination(selectQuery);
    
    return {
      SelectQuery: { query: selectQuery },
      CountQuery: { query: this.buildCountQuery() }
    };
  }
  
  private applyFilters(query: any) {
    // Apply tag conditions
    if (this.derivedFetchParams.tagConditions) {
      query = query.where(this.derivedFetchParams.tagConditions);
    }
    
    // Apply search conditions
    if (this.fetchParams.search) {
      const searchCondition = this.fetchParams.searchTable === 'tags' 
        ? like(s.tag.tag, `%${this.fetchParams.search}%`)
        : like(s.authorMain.author, `%${this.fetchParams.search}%`);
      query = query.where(searchCondition);
    }
    
    return query;
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
```

## Form Handling Patterns

### Multi-Step Form Pattern

**For complex forms broken into multiple steps:**

```typescript
// Step controller hook
export const useStepController = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);
  
  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);
  
  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, [totalSteps]);
  
  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100
  };
};

// Form context for sharing state
interface FormContextType {
  formData: any;
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
}

export const FormContext = createContext<FormContextType | null>(null);

// Multi-step form component
export const MultiStepForm = ({ children, onSubmit }: Props) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { currentStep, nextStep, prevStep, isLastStep } = useStepController(
    React.Children.count(children)
  );
  
  const updateFormData = useCallback((data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);
  
  const handleNext = async () => {
    // Validate current step
    const currentStepData = getCurrentStepData();
    const validationErrors = await validateStep(currentStepData);
    
    if (Object.keys(validationErrors).length === 0) {
      if (isLastStep) {
        onSubmit(formData);
      } else {
        nextStep();
      }
    } else {
      setErrors(validationErrors);
    }
  };
  
  return (
    <FormContext.Provider value={{ formData, updateFormData, errors, setErrors }}>
      <div className="multi-step-form">
        {React.Children.toArray(children)[currentStep]}
        <FormNavigation 
          onPrev={prevStep}
          onNext={handleNext}
          isLastStep={isLastStep}
        />
      </div>
    </FormContext.Provider>
  );
};
```

### Form Step Component Pattern

```typescript
interface FormStepProps {
  title: string;
  children: React.ReactNode;
  validationSchema?: ZodSchema;
}

export const FormStep = ({ title, children, validationSchema }: FormStepProps) => {
  const { formData, updateFormData, errors } = useFormContext();
  
  const form = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: formData
  });
  
  // Sync form data with context
  useEffect(() => {
    const subscription = form.watch((data) => {
      updateFormData(data);
    });
    return () => subscription.unsubscribe();
  }, [form, updateFormData]);
  
  return (
    <div className="form-step">
      <h2>{title}</h2>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </div>
  );
};
```

## Animation Patterns

### Framer Motion List Animation

**Consistent animation for lists of items:**

```typescript
// Animation variants
export const listVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Usage in components
export const ArtistGrid = ({ artists }: Props) => {
  return (
    <motion.div
      className="artist-grid"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {artists.map((artist, index) => (
        <motion.div
          key={artist.uuid}
          variants={listVariants}
          custom={index}
          className="artist-item"
        >
          <ArtistCard data={artist} />
        </motion.div>
      ))}
    </motion.div>
  );
};
```

### Page Transition Pattern

```typescript
export const pageVariants = {
  initial: {
    opacity: 0,
    x: -200,
    scale: 0.8
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: 200,
    scale: 1.2
  }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Usage in route components
export const ArtistPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Page content */}
    </motion.div>
  );
};
```

## Error Handling Patterns

### Error Boundary Pattern

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### API Error Handling Pattern

```typescript
export const useApiErrorHandler = () => {
  const handleError = useCallback((error: any) => {
    if (error instanceof TRPCError) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          window.location.href = '/login';
          break;
        case 'NOT_FOUND':
          // Show not found message
          console.error('Resource not found:', error.message);
          break;
        case 'BAD_REQUEST':
          // Show validation errors
          console.error('Validation error:', error.message);
          break;
        default:
          // Generic error handling
          console.error('API error:', error.message);
      }
    } else {
      // Network or unexpected errors
      console.error('Unexpected error:', error);
    }
  }, []);
  
  return { handleError };
};
```

## Performance Optimization Patterns

### Lazy Loading Pattern

```typescript
// Component lazy loading
const LazyArtistDetails = React.lazy(() => import('./ArtistDetails'));
const LazyImageGallery = React.lazy(() => import('./ImageGallery'));

export const ArtistPage = () => {
  return (
    <div>
      <ArtistHeader />
      <Suspense fallback={<div>Loading details...</div>}>
        <LazyArtistDetails />
      </Suspense>
      <Suspense fallback={<div>Loading gallery...</div>}>
        <LazyImageGallery />
      </Suspense>
    </div>
  );
};

// Route-based lazy loading
const artistRoutes = [
  {
    path: '/artist',
    component: React.lazy(() => import('./pages/ArtistList'))
  },
  {
    path: '/artist/$artistId',
    component: React.lazy(() => import('./pages/ArtistDetails'))
  }
];
```

### Memoization Pattern

```typescript
// Component memoization
export const ArtistCard = React.memo(({ data, onBookmark }: Props) => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.data.uuid === nextProps.data.uuid &&
    prevProps.data.author === nextProps.data.author
  );
});

// Hook memoization
export const useProcessedArtists = (artists: Artist[], filters: Filters) => {
  return useMemo(() => {
    return artists
      .filter(artist => applyFilters(artist, filters))
      .sort((a, b) => sortArtists(a, b, filters.sort));
  }, [artists, filters]);
};

// Expensive calculation memoization
export const useExpensiveCalculation = (data: any[]) => {
  return useMemo(() => {
    return data.reduce((acc, item) => {
      // Expensive operation
      return acc + complexCalculation(item);
    }, 0);
  }, [data]);
};
```

## Implementation Guidelines

### When to Use These Patterns

**Compound Components:**
- Complex UI components with multiple related parts
- When you need flexible composition
- Reusable component systems

**Context Providers:**
- Sharing state between multiple components
- Avoiding prop drilling
- Theme or configuration data

**DAO Pattern:**
- All database interactions
- Consistent error handling
- Testable data access layer

**Query Builder:**
- Dynamic query construction
- Complex filtering requirements
- Reusable query logic

**Multi-Step Forms:**
- Complex user input workflows
- Form validation across multiple steps
- Progressive data collection

### Pattern Selection Guidelines

1. **Start Simple**: Use basic patterns first, add complexity only when needed
2. **Consistency**: Once you choose a pattern, use it consistently across similar use cases
3. **Type Safety**: Always include proper TypeScript types for pattern implementations
4. **Testing**: Ensure patterns are easily testable and mockable
5. **Performance**: Consider performance implications of chosen patterns

## Related Documents
- [Coding Standards](../standards/coding-standards.md) - Implementation standards
- [System Overview](../architecture/system-overview.md) - Architecture context
- [Data Flow Patterns](../architecture/data-flow.md) - State management context