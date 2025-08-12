# Technical Constraints

## Purpose
This document outlines the technical constraints, limitations, and requirements that influence architectural and implementation decisions in the Douren system.

## Platform and Runtime Constraints

### Cloudflare Workers Limitations

**Runtime Environment**: Cloudflare Workers imposes specific constraints on backend operations

**Execution Limits:**
- **CPU Time**: 50ms for free tier, 30 seconds for paid (sufficient for current scale)
- **Memory**: 128MB limit per request (adequate for database operations)
- **Request Size**: 100MB maximum (suitable for image uploads)
- **Response Size**: 100MB maximum (handles paginated API responses)

**Storage Constraints:**
- **No Persistent File System**: Cannot store files locally between requests
- **No Native Database**: Requires external PostgreSQL database
- **Environment Variables**: Limited to 64KB total (managed via Infisical)

**Network Limitations:**
- **External Requests**: Limited to 6 simultaneous outbound requests
- **WebSocket**: Not supported (not required for current architecture)
- **Long-Running Connections**: Not supported (database connection pooling handled externally)

**Impact on Architecture:**
- All file storage must use external services (images handled separately)
- Database connections are established per request
- Cron jobs are limited to simple operations
- State must be managed externally (database or external storage)

### Node.js Version Requirements

**Node.js 22+ Requirement**: Leverages modern JavaScript features and performance improvements

**Required Features:**
- **Top-level await**: Used throughout async initialization code
- **Import assertions**: Used for JSON imports in configuration
- **Fetch API**: Native fetch used instead of external libraries
- **AbortController**: Used for request cancellation in tRPC

**Compatibility Considerations:**
- All dependencies must support Node.js 22+
- Development team must use compatible Node.js versions
- CI/CD pipelines configured for Node.js 22

## Database Constraints

### PostgreSQL Limitations

**Database Architecture**: Single PostgreSQL instance with environment separation

**Connection Constraints:**
- **Connection Pooling**: Required due to Cloudflare Workers stateless nature
- **Connection Limits**: Managed by database provider (Supabase/external)
- **Transaction Isolation**: Default READ COMMITTED isolation level

**Schema Constraints:**
- **Migration Versioning**: Linear migration history required
- **Column Limitations**: PostgreSQL column limits (1600 columns per table)
- **Index Limitations**: Reasonable index count to maintain performance

**Query Performance:**
- **Large Result Sets**: Pagination required for all list operations
- **Complex Joins**: Limited by connection timeout and memory
- **Full-Text Search**: Basic LIKE operations, no advanced search engine

### Data Volume Considerations

**Current Scale**: Small-scale application with growth planning

**Artist Data:**
- **Artist Count**: Hundreds to low thousands of artists expected
- **Product Images**: External storage, database stores URLs only
- **Tag Relationships**: Many-to-many relationships may grow complex

**Query Optimization Requirements:**
- **Pagination**: Required for all list endpoints (PAGE_SIZE = 10)
- **Indexing**: Critical for frequently queried columns (uuid, tags, event relationships)
- **Query Complexity**: Complex joins limited by execution time constraints

## Development Environment Constraints

### Monorepo Management

**Turborepo Limitations**: Orchestration constraints and build dependencies

**Build Dependencies:**
- **Dependency Order**: `pkg` → `lib` → `be`/`fe` build sequence required
- **Workspace Dependencies**: Exact version matching (`*`) for internal packages
- **Cache Management**: Turborepo cache must be managed for consistent builds

**Development Workflow Complexity:**

**Environment Setup Constraints:**
- **Infisical Dependency**: All services require Infisical authentication for environment variables
- **Multi-step Configuration**: `make copy-env` + Infisical setup + Node.js 22+ + Husky installation
- **Development Commands**: Must use `infisical run --env=dev -- [command]` pattern for all services
- **Fallback Complexity**: Manual `.env` file management when Infisical unavailable
- **Local Database**: Requires local PostgreSQL instance configuration and maintenance
- **Build Dependencies**: Complex package build order (pkg → lib → be/fe) must be maintained

**Infisical-Specific Constraints:**
- **Network Dependency**: Requires internet connection for environment variable access
- **Authentication Required**: Developers must authenticate with Infisical service before development
- **Team Access Management**: New developers need Infisical project access provisioning
- **Environment Separation**: Different Infisical configurations per environment (dev/staging/prod)
- **Export Pattern**: Workers require `infisical export > .dev.vars` file generation pattern

**Development Command Examples:**
```bash
# Standard development flow
infisical run --env=dev -- npm run dev

# Workers-specific development
infisical export > .dev.vars && wrangler dev src/index.ts --port 2000

# Testing with environment
infisical run --env=dev -- npm run test

# Fallback when Infisical unavailable
cp .env.example .env && npm run dev
```

### Testing Constraints

**Testing Complexity: Vitest with Advanced Mocking**

**Current Testing Infrastructure:**
- **Primary Framework**: Vitest with comprehensive mocking capabilities
- **Mock Strategy**: Extensive use of `vi.mock()` for external dependencies
- **Test Data**: Centralized fixtures in `__fixtures__/` directories
- **Database Mocking**: Complex database operation mocking required

**Testing Limitations:**
- **Integration Tests**: Limited due to database setup complexity and Infisical dependencies
- **End-to-End Tests**: Not implemented (manual testing primary)
- **Performance Tests**: Basic load testing only
- **Environment Dependencies**: Tests require careful mocking of Infisical environment variables

**Mock Complexity Examples:**
```typescript
// Extensive dependency mocking required
vi.mock("@pkg/database/db", () => ({
  initDB: vi.fn(),
  s: {
    authorMain: { uuid: "uuid", author: "author", tags: "tags" },
    authorTag: { authorId: "authorId", tagId: "tagId" },
    tag: { tag: "tag", count: "count" }
  }
}));

// Complex database operation mocking
const mockDb = {
  select: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      leftJoin: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockData)
      })
    })
  })
};
```

**Testing Infrastructure Requirements:**
- **Mock Data Management**: Centralized test fixtures for consistency
- **Database Mock Setup**: Sophisticated mocking of Drizzle ORM operations
- **Environment Isolation**: Tests must not depend on real Infisical configuration
- **CI/CD Integration**: Pipeline testing with mocked dependencies

## Security Constraints

### Authentication and Authorization

**Simple Authentication Model**: No complex user roles or permissions

**Current Limitations:**
- **Admin Authentication**: Simple token-based system
- **User Management**: No user registration or complex user roles
- **Session Management**: Stateless authentication only

**Security Requirements:**
- **API Security**: Admin endpoints protected by middleware
- **Image Upload Security**: Basic validation and size limits
- **Data Validation**: Zod schemas for all input validation
- **SQL Injection**: Prevented by Drizzle ORM parameterized queries

### Data Privacy and Compliance

**Minimal Personal Data**: Limited personal information collected

**Data Handling:**
- **Artist Data**: Publicly available information only
- **User Collections**: Stored in browser localStorage (no server-side user data)
- **Social Links**: Public social media profiles only
- **Contact Information**: Optional email addresses for business purposes

**Compliance Considerations:**
- **GDPR**: Minimal personal data reduces compliance complexity
- **Data Retention**: No automatic data deletion policies implemented
- **User Rights**: No user data deletion mechanisms (manual only)

## Performance Constraints

### Response Time Requirements

**No Strict SLAs**: Small-scale application without enterprise performance requirements

**Acceptable Performance Levels:**
- **API Response Time**: < 2 seconds for most operations
- **Database Queries**: < 1 second for paginated results
- **Image Loading**: Dependent on external image service
- **Page Load Time**: < 3 seconds for initial page load

### Scalability Limitations

**Current Architecture Scaling Limits:**

**Database Scaling:**
- **Read Performance**: Limited by single PostgreSQL instance
- **Write Performance**: Adequate for current write volume
- **Connection Scaling**: Limited by database connection pool

**API Scaling:**
- **Cloudflare Workers**: Auto-scaling handles traffic spikes
- **Database Connections**: Bottleneck during high concurrent usage
- **Image Serving**: External service handles image scaling

**Frontend Scaling:**
- **Static Hosting**: Easily scalable
- **Bundle Size**: No current optimization, may impact performance
- **Client-Side Performance**: Limited optimization for low-end devices

## Integration Constraints

### Third-Party Services

**External Dependencies**: Limited external service integrations

**Current Integrations:**
- **Database Provider**: PostgreSQL hosting service
- **Image Storage**: Separate image upload/storage service
- **Secret Management**: Infisical for environment variables
- **Deployment**: Cloudflare Workers and static hosting

**Integration Limitations:**
- **API Rate Limits**: Must respect third-party service limits
- **Service Availability**: Dependent on external service uptime
- **Data Format Compatibility**: Must adapt to external service formats

### Social Media Integration

**Read-Only Social Integration**: Links to external social profiles only

**Limitations:**
- **No Social Login**: Users cannot log in via social media
- **No Social Data Sync**: Artist social data manually maintained
- **Link Validation**: No automatic validation of social media links
- **Platform Changes**: Must manually adapt to social platform changes

## Development Process Constraints

### Version Control and Deployment

**Git Workflow**: Standard Git flow with some constraints

**Repository Constraints:**
- **Monorepo Size**: Large repository due to multiple applications
- **Binary Files**: Images and assets increase repository size
- **Branch Strategy**: Feature branches with main branch deployment

**Deployment Constraints:**
- **Environment Parity**: Development/staging/production environment consistency
- **Database Migrations**: Must be applied in correct order across environments
- **Zero-Downtime Deployment**: Not currently implemented
- **Rollback Strategy**: Limited rollback capabilities for database changes

### Code Quality and Maintenance

**Code Quality Tools**: Biome for formatting and linting

**Quality Constraints:**
- **TypeScript Strict Mode**: Enabled, requires comprehensive typing
- **Biome Configuration**: Consistent formatting across all packages
- **Pre-commit Hooks**: Formatting enforced before commits
- **Code Review**: Manual process, no automated code review tools

### Documentation and Knowledge Management

**Documentation Constraints:**

**Current State:**
- **API Documentation**: Limited, mostly in code comments
- **User Documentation**: Minimal end-user documentation
- **Developer Onboarding**: Complex due to monorepo setup
- **Business Logic Documentation**: Limited domain knowledge documentation

**Knowledge Management:**
- **Team Knowledge**: Small team, knowledge concentrated
- **Decision Records**: No formal ADR (Architecture Decision Record) process
- **Change Documentation**: Limited change tracking beyond Git commits

## Future Constraint Considerations

### Internationalization Constraints

**Planned Feature**: Multi-language support creates additional constraints

**Technical Considerations:**
- **Database Schema**: Text fields may need localization support
- **URL Structure**: Language-specific routing requirements
- **Content Management**: Translation workflow complexity
- **Performance Impact**: Increased bundle size with multiple languages

### Mobile Application Constraints

**Potential Future Development**: Mobile app would introduce new constraints

**Technical Constraints:**
- **API Compatibility**: Current API may need mobile-specific optimizations
- **Data Synchronization**: Offline capability requirements
- **Push Notifications**: Real-time communication infrastructure
- **App Store Compliance**: Platform-specific requirements

### Commercial Feature Constraints

**Enhanced Commerce Integration**: Future e-commerce features

**Technical Requirements:**
- **Payment Processing**: PCI compliance requirements
- **Transaction Management**: Database transaction complexity
- **Inventory Management**: Real-time stock tracking
- **Order Processing**: Workflow management complexity

## Mitigation Strategies

### Performance Optimization

**Database Optimization:**
- **Query Optimization**: Regular query performance review
- **Index Management**: Strategic index creation for frequent queries
- **Connection Pooling**: Optimize database connection usage
- **Caching Strategy**: Implement query result caching where appropriate

**Application Optimization:**
- **Bundle Optimization**: Implement code splitting and lazy loading
- **Image Optimization**: Optimize image loading and caching
- **API Optimization**: Implement response compression and caching headers

### Monitoring and Observability

**Current Monitoring:**
- **Cloudflare Analytics**: Basic request/response monitoring
- **Database Monitoring**: Basic connection and query monitoring
- **Error Tracking**: Console logging for error tracking

**Improved Monitoring Needs:**
- **Application Performance Monitoring**: Real-time performance tracking
- **User Experience Monitoring**: Client-side performance tracking
- **Business Metrics**: Artist engagement and discovery metrics

## Implementation Guidelines

### Working Within Constraints

**Design Decisions:**
1. **Embrace Statelessness**: Design all operations to be stateless
2. **External Storage**: Use external services for file storage and complex operations
3. **Pagination First**: Always implement pagination for list operations
4. **Simple Authentication**: Keep authentication simple and stateless
5. **Manual Optimization**: Focus on manual optimization over automated tools

### Constraint-Driven Architecture

**Architectural Patterns:**
1. **Request-Response**: Design for short-lived request-response cycles
2. **Database-Centric**: Centralize complex logic in database queries
3. **Client-Side State**: Leverage client-side state management
4. **External Integration**: Design for external service integration
5. **Graceful Degradation**: Handle external service failures gracefully

## Related Documents
- [System Overview](../architecture/system-overview.md) - Overall architecture within constraints
- [Performance Optimization](../patterns/common-patterns.md) - Optimization patterns for constraints
- [Business Domain](business-domain.md) - Business requirements driving constraints