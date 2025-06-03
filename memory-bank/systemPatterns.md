# System Patterns - Community College Matcher

## Architecture Overview

### Application Structure
```
Next.js App Router Architecture
├── app/                    # App Router pages and API routes
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global styles
│   └── api/chat/          # AI chat API endpoint
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   └── [feature].tsx    # Feature-specific components
├── lib/                  # Utility libraries and services
├── types/               # TypeScript type definitions
├── data/                # Mock data and constants
└── hooks/               # Custom React hooks
```

### Key Design Patterns

#### 1. Component Composition Pattern
- **Base UI Components**: shadcn/ui provides consistent, accessible foundation
- **Feature Components**: Compose base components into domain-specific features
- **Page Components**: Orchestrate feature components into complete experiences

#### 2. Service Layer Pattern
- **CollegeMatchingService**: Encapsulates matching algorithm logic
- **GeocodingService**: Handles address-to-coordinates conversion
- **Separation of Concerns**: Business logic isolated from UI components

#### 3. State Management Pattern
- **Local State**: React useState for component-specific state
- **Prop Drilling**: Controlled prop passing for shared state
- **No Global State**: Intentionally simple - state flows down from main page

#### 4. Type-First Development
- **Comprehensive Types**: All data structures defined in types/index.ts
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Interface Contracts**: Clear contracts between components and services

## Core Data Flow

### 1. Assessment Flow
```
StudentAssessment Component
├── Form Validation (react-hook-form + zod)
├── Data Collection (StudentProfile)
└── onComplete Callback
    ├── Geocoding Service (address → coordinates)
    ├── Matching Service (profile → matches)
    └── State Update (setStudentProfile, setMatches)
```

### 2. Matching Algorithm Flow
```
CollegeMatchingService.findMatches()
├── For each college:
│   ├── calculateMatchScore() (weighted scoring)
│   ├── generateMatchReasons() (explanation)
│   ├── identifyConcerns() (potential issues)
│   ├── getRecommendedPrograms() (program filtering)
│   └── generateNextSteps() (action items)
└── Sort by match score (highest first)
```

### 3. AI Chat Flow
```
ChatInterface Component
├── Message Input
├── API Call (/api/chat/route.ts)
│   ├── Context Building (student + matches)
│   ├── OpenAI API Call (GPT-4o)
│   └── Response Generation
└── Message Display
```

## Component Architecture

### 1. Main Page Component (app/page.tsx)
**Responsibilities:**
- Application state management
- Flow orchestration
- Loading states
- Tab navigation

**Key Patterns:**
- Conditional rendering based on state
- Async operation handling
- Error boundary considerations

### 2. Feature Components
**StudentAssessment:**
- Multi-step form with validation
- Progressive disclosure
- Form state management

**MatchResults:**
- Data presentation with sorting/filtering
- Card-based layout
- Responsive design

**ChatInterface:**
- Real-time messaging UI
- API integration
- Conversation history

**CollegeMap:**
- Geographic visualization
- Interactive markers
- Distance calculations

### 3. UI Component Patterns
**Consistent Design System:**
- shadcn/ui base components
- Tailwind CSS utility classes
- Dark/light theme support
- Responsive breakpoints

## Service Layer Design

### CollegeMatchingService
**Core Algorithm:**
```typescript
calculateMatchScore(student, college) {
  // Weighted scoring system:
  // - Financial fit (25%)
  // - Program alignment (30%)
  // - Schedule compatibility (20%)
  // - Geographic fit (15%)
  // - Services match (10%)
}
```

**Key Methods:**
- `findMatches()`: Main entry point
- `calculateProgramAlignment()`: Academic interest matching
- `calculateGeographicFit()`: Distance-based scoring
- `generateMatchReasons()`: Human-readable explanations

### GeocodingService
**Functionality:**
- Address normalization
- Coordinate conversion
- Distance calculations
- Fallback handling

## Data Patterns

### Type Definitions
**Core Entities:**
- `StudentProfile`: Comprehensive user data
- `CommunityCollege`: Institution data structure
- `Program`: Academic program details
- `MatchResult`: Scoring and recommendations

**Design Principles:**
- Immutable data structures
- Optional fields for flexibility
- Nested objects for organization
- Consistent naming conventions

### Mock Data Strategy
**Current Approach:**
- Static mock data in `data/mock-colleges.ts`
- Representative sample of college types
- Realistic data for testing algorithms

**Future Integration:**
- API-ready data structure
- Easy migration path to real data
- Caching strategies for performance

## Performance Patterns

### 1. Optimization Strategies
- **Component Memoization**: React.memo for expensive renders
- **Lazy Loading**: Dynamic imports for large components
- **Image Optimization**: Next.js Image component
- **Bundle Splitting**: Automatic code splitting

### 2. Loading States
- **Progressive Loading**: Show content as it becomes available
- **Skeleton Screens**: Maintain layout during loading
- **Error Boundaries**: Graceful error handling

### 3. Caching Strategies
- **Static Generation**: Pre-build static content
- **API Caching**: Cache API responses
- **Browser Caching**: Leverage browser cache

## Security Patterns

### 1. API Security
- **Input Validation**: Zod schemas for all inputs
- **Rate Limiting**: Prevent API abuse
- **Error Handling**: Don't expose internal errors

### 2. Data Privacy
- **No Persistent Storage**: Student data not stored
- **Minimal Data Collection**: Only necessary information
- **Secure Transmission**: HTTPS for all communications

## Testing Patterns

### 1. Component Testing
- **Unit Tests**: Individual component behavior
- **Integration Tests**: Component interactions
- **Visual Tests**: UI consistency

### 2. Service Testing
- **Algorithm Testing**: Matching logic validation
- **Edge Case Testing**: Boundary conditions
- **Performance Testing**: Algorithm efficiency

## Deployment Patterns

### 1. Vercel Integration
- **Automatic Deployments**: Git-based deployments
- **Environment Variables**: Secure configuration
- **Edge Functions**: Global performance

### 2. Monitoring
- **Error Tracking**: Runtime error monitoring
- **Performance Metrics**: Core web vitals
- **User Analytics**: Usage patterns

## Future Architecture Considerations

### 1. Scalability
- **Database Integration**: Real college data storage
- **User Accounts**: Persistent user sessions
- **Microservices**: Service decomposition

### 2. Advanced Features
- **Real-time Updates**: Live data synchronization
- **Machine Learning**: Improved matching algorithms
- **Mobile Apps**: Native mobile experiences

### 3. Integration Points
- **College APIs**: Direct data integration
- **Payment Systems**: Application fee processing
- **Notification Systems**: Email/SMS alerts
