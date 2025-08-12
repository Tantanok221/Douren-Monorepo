# Business Domain

## Purpose
This document provides comprehensive understanding of the Douren business domain, covering the doujin artist discovery ecosystem, core entities, business processes, and domain-specific requirements.

## Domain Overview

### What is Douren
Douren is a **doujin artist discovery platform** that serves as a central hub for:
- **Independent artists** (doujinshi creators, illustrators, merchandise creators)
- **Event organizers** (conventions, doujin markets, art fairs)
- **Art enthusiasts** (collectors, fans, potential commissioners)

### Core Value Proposition
- **Artist Discovery**: Help users find artists based on interests, art styles, and event participation
- **Event Coordination**: Track artist participation across multiple events and conventions
- **Portfolio Showcase**: Provide artists with a platform to display their work and social presence
- **Community Building**: Connect artists with fans and facilitate engagement

## Business Entities

### Artists (`authorMain`)

**Primary Entity**: Independent creators in the doujin ecosystem

**Core Attributes:**
- **Identity**: `uuid`, `author` (display name)
- **Biography**: `introduction` (artist statement/bio)
- **Portfolio**: `photo` (profile/avatar image)
- **Social Presence**: Multiple social media links
  - `twitterLink`, `pixivLink`, `instagramLink`
  - `youtubeLink`, `twitchLink`, `facebookLink`
  - `plurkLink`, `bahaLink` (Taiwan-specific platforms)
- **Commercial**: `storeLink`, `myacgLink`, `officialLink`
- **Contact**: `email` for business inquiries

**Business Rules:**
- Every artist must have a unique `uuid` and display `author` name
- Social links are optional but critical for discoverability
- Artists can be associated with multiple events and products
- Tag relationships define artist specialties and searchability

**Artist Lifecycle:**
1. **Discovery**: Artists are added to the platform (manual curation or submission)
2. **Profile Building**: Social links, introduction, and portfolio images are added
3. **Event Participation**: Artists participate in events, booth locations are tracked
4. **Product Creation**: Artists create products/artworks linked to their profile
5. **Community Engagement**: Users bookmark/collect favorite artists

### Products (`authorProduct`)

**Secondary Entity**: Artworks, merchandise, or creations by artists

**Core Attributes:**
- **Identity**: `id`, `title`
- **Visual**: `thumbnail` (required), `preview` (optional detail image)
- **Categorization**: `tag` (product type/category)
- **Relationship**: `artistId` (links to artist)

**Business Rules:**
- Every product must have a `thumbnail` image
- Products are always linked to exactly one artist
- Tags help categorize products for browsing/filtering
- Products serve as portfolio pieces for artists

**Product Types** (common tags):
- Illustrations, Manga/Comics, Merchandise
- Stickers, Prints, Digital Art
- Custom commissions, Original characters

### Events (`event` and `eventDm`)

**Domain-Critical Entity**: Conventions, markets, and gatherings where artists participate

**Event Structure:**
- **Event Master** (`event`): `id`, `name` (event identifier)
- **Event Participation** (`eventDm`): Artist participation details

**Event Participation Attributes:**
- **Location Tracking**: `locationDay01`, `locationDay02`, `locationDay03`
- **Booth Information**: `boothName` (artist's booth/table name)
- **Contact**: `dm` (direct message/contact info for the event)
- **Relationships**: Links to both `artist` and `event`

**Business Rules:**
- Events can span multiple days (up to 3 days supported)
- Artists can participate in multiple events
- Booth locations help attendees find artists at physical events
- Event participation is a key discovery mechanism

**Event Lifecycle:**
1. **Event Creation**: New events are added to the system
2. **Artist Registration**: Artists register for event participation
3. **Booth Assignment**: Location details are recorded for each day
4. **Event Execution**: Real-time information helps attendees find artists
5. **Post-Event**: Historical data for artist discovery and planning

### Tags (`tag` and `authorTag`)

**Classification System**: Hierarchical categorization for discovery and filtering

**Tag Structure:**
- **Tag Definition** (`tag`): `tag` (name), `count` (usage frequency), `index` (display order)
- **Artist-Tag Relations** (`authorTag`): Many-to-many relationships between artists and tags

**Tag Categories** (inferred from usage):
- **Art Styles**: "illustration", "manga", "digital art", "traditional"
- **Content Types**: "original", "fanart", "doujinshi", "merchandise"
- **Genres**: "fantasy", "sci-fi", "slice of life", "romance"
- **Specialties**: "character design", "backgrounds", "chibi", "realistic"

**Business Rules:**
- Tags have usage counts that are automatically maintained
- Tag popularity influences search rankings and suggestions
- Artists can have multiple tags to improve discoverability
- Tag index controls display order in filters and suggestions

## Business Processes

### Artist Discovery Workflow

**Primary User Journey**: Finding artists based on preferences

1. **Browse/Search Entry Points**:
   - Tag-based filtering (most common)
   - Text search by artist name
   - Event-based discovery
   - Random browsing/pagination

2. **Filtering and Refinement**:
   - Multiple tag selection (AND/OR logic)
   - Search within artist names vs. tags
   - Sorting by newest, oldest, or popularity
   - Event-specific filtering

3. **Artist Exploration**:
   - View artist profile and introduction
   - Browse artist's product portfolio
   - Check social media links for more content
   - See upcoming/past event participation

4. **Engagement Actions**:
   - Bookmark/collect favorite artists
   - Visit social media profiles
   - Contact for commissions or collaborations
   - Plan event visits based on booth locations

### Event Planning Workflow

**Artist and Attendee Journey**: Planning convention/event participation

1. **Event Setup**:
   - New events are created in the system
   - Artists register for participation
   - Booth assignments and locations are recorded

2. **Pre-Event Discovery**:
   - Attendees browse artists participating in specific events
   - Plan itineraries based on favorite artists' booth locations
   - Check day-specific location changes

3. **During Event**:
   - Real-time booth location lookup
   - Direct messaging/contact through provided DM information
   - Discovery of new artists through physical booth visits

4. **Post-Event**:
   - Update collections with newly discovered artists
   - Historical data for planning future event participation

### Content Management Workflow

**Admin/Curator Journey**: Managing platform content through CMS

1. **Artist Onboarding**:
   - Add new artists with basic information
   - Upload profile images and portfolio pieces
   - Set up social media links and contact information
   - Assign relevant tags for discoverability

2. **Product Management**:
   - Add new products/artworks for existing artists
   - Update thumbnails and preview images
   - Categorize with appropriate tags
   - Link products to artist profiles

3. **Event Management**:
   - Create new events in the system
   - Manage artist event participation
   - Update booth locations and contact information
   - Handle day-specific location changes

4. **Tag Curation**:
   - Create new tags for emerging art styles or categories
   - Merge duplicate or similar tags
   - Adjust tag display order and organization
   - Monitor tag usage and popularity

## Domain-Specific Requirements

### Doujin Culture Considerations

**Cultural Context**: The platform serves Japanese/Taiwanese doujin culture

- **Independent Creation Focus**: Emphasis on original and fan-created works
- **Event-Centric Discovery**: Physical events are primary discovery mechanisms
- **Community Relationships**: Artists often collaborate and cross-promote
- **Seasonal Patterns**: Major conventions drive content and user activity cycles

### Multi-Platform Social Integration

**Social Media Ecosystem**: Artists maintain presence across multiple platforms

- **Platform Diversity**: Different social platforms serve different purposes
  - Twitter/X: Real-time updates, WIP posts, community interaction
  - Pixiv: Portfolio hosting, finished artwork showcase
  - Instagram: Visual portfolio, behind-the-scenes content
  - YouTube/Twitch: Process videos, live drawing streams
- **Regional Platforms**: Taiwan-specific platforms (Plurk, Bahamut)
- **Business Integration**: Store links for commercial transactions

### Event Logistics

**Physical Event Management**: Supporting real-world convention participation

- **Multi-Day Events**: Events can span multiple days with location changes
- **Booth Management**: Artists may move locations or share booths
- **Contact Flexibility**: Different contact methods for different events
- **Real-Time Updates**: Location information must be current and accurate

### Discovery and Curation

**Content Discovery Mechanisms**: Multiple pathways for finding relevant artists

- **Tag-Based Discovery**: Primary discovery method through interest-based filtering
- **Event-Based Discovery**: Finding artists through event participation
- **Social Discovery**: Following social media links to find related artists
- **Serendipitous Discovery**: Random browsing and recommendations

## Seasonal Business Patterns

### Convention Seasons

**Peak Activity Periods**: Major doujin events drive platform usage

- **Summer Events** (Comiket, summer conventions): High activity, new artist additions
- **Winter Events** (December conventions): End-of-year discovery, gift planning
- **Regional Events**: Taiwan, Southeast Asia convention circuits
- **Preparation Periods**: Pre-event booth planning and artist research

### Content Creation Cycles

**Artist Activity Patterns**: Content publication follows event schedules

- **Pre-Event**: New product announcements, booth information updates
- **During Events**: Real-time location updates, social media activity
- **Post-Event**: New artist additions, portfolio updates, collaboration announcements

## Future Considerations

### Internationalization Planning

**Multi-Language Support**: Planned but not current priority

- **Content Localization**: Artist names, descriptions, tag translations
- **Cultural Adaptation**: Region-specific social platforms and conventions
- **Currency Handling**: Multiple currencies for international artist stores

### Platform Growth

**Scalability Considerations**: Preparing for increased usage

- **Search Performance**: Tag-based search optimization as artist count grows
- **Content Moderation**: Community guidelines and content curation
- **Artist Verification**: Authenticity verification for popular artists
- **Commercial Integration**: Enhanced store/commission integration

## Implementation Guidelines

### Domain Model Integrity

**Maintaining Business Rules in Code:**

1. **Entity Validation**: Use Zod schemas to enforce business rules
2. **Relationship Integrity**: Database constraints ensure valid associations
3. **Tag Consistency**: Automated tag count maintenance through cron jobs
4. **Event Logic**: Multi-day event support with proper date handling

### User Experience Priorities

**Domain-Driven UX Decisions:**

1. **Discovery First**: Tag filtering and search are primary navigation methods
2. **Visual Focus**: Image-heavy interface matches art-focused domain
3. **Event Integration**: Event participation is prominently displayed
4. **Social Connectivity**: Easy access to artist social media profiles

### Data Quality

**Ensuring Domain Data Accuracy:**

1. **Artist Verification**: Manual curation ensures quality artist profiles
2. **Tag Curation**: Regular tag cleanup and organization
3. **Event Accuracy**: Real-time booth location updates during events
4. **Link Validation**: Periodic verification of social media links

## Related Documents
- [System Overview](../architecture/system-overview.md) - Technical architecture supporting domain
- [Data Flow Patterns](../architecture/data-flow.md) - How domain data flows through the system
- [API Design Guidelines](../standards/api-design-guidelines.md) - API design for domain entities