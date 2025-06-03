# Technical Context - Community College Matcher

## Technology Stack

### Frontend Framework
**Next.js 15 with App Router**
- **Why**: Latest React features, excellent performance, built-in optimizations
- **Key Features**: Server components, streaming, automatic code splitting
- **Configuration**: TypeScript, ESLint, Tailwind CSS integration

**React 19**
- **Why**: Latest React features, improved performance, better developer experience
- **Key Features**: Concurrent features, automatic batching, improved hydration
- **Usage**: Functional components with hooks, no class components

### Language & Type Safety
**TypeScript 5**
- **Why**: Type safety, better developer experience, catch errors at compile time
- **Configuration**: Strict mode enabled, comprehensive type coverage
- **Patterns**: Interface-first design, utility types, generic constraints

### Styling & UI
**Tailwind CSS 3.4**
- **Why**: Utility-first, consistent design system, excellent performance
- **Configuration**: Custom theme, responsive design, dark mode support
- **Patterns**: Component-based styling, responsive-first approach

**shadcn/ui Components**
- **Why**: Accessible, customizable, consistent design system
- **Components**: 40+ pre-built components with Radix UI primitives
- **Customization**: Tailwind-based theming, easy modification

### State Management
**React Built-in State**
- **Why**: Simple application state, no need for complex state management
- **Patterns**: useState for local state, prop drilling for shared state
- **Future**: Consider Zustand or Redux Toolkit for complex features

### Forms & Validation
**React Hook Form 7**
- **Why**: Excellent performance, minimal re-renders, great developer experience
- **Features**: Built-in validation, error handling, form state management
- **Integration**: Works seamlessly with TypeScript and Zod

**Zod 3**
- **Why**: TypeScript-first schema validation, runtime type checking
- **Usage**: Form validation, API input validation, type inference
- **Patterns**: Schema composition, custom validators, error messages

### AI Integration
**OpenAI SDK (@ai-sdk/openai)**
- **Why**: Official SDK, excellent TypeScript support, streaming capabilities
- **Model**: GPT-4o for chat counselor functionality
- **Features**: Streaming responses, conversation context, error handling

**Vercel AI SDK**
- **Why**: Seamless integration with Next.js, streaming UI, excellent DX
- **Features**: generateText, streaming responses, React integration
- **Usage**: Chat interface, AI-powered recommendations

### Maps & Geolocation
**Leaflet 1.9 + React Leaflet 5**
- **Why**: Open source, lightweight, highly customizable
- **Features**: Interactive maps, custom markers, distance calculations
- **Integration**: TypeScript definitions, React component wrapper

**Custom Geocoding Service**
- **Why**: Address normalization, coordinate conversion, distance calculations
- **Features**: Haversine formula for distance, fallback coordinates
- **Future**: Integration with Google Maps API or Mapbox

### Development Tools
**ESLint + Prettier**
- **Why**: Code quality, consistent formatting, catch common errors
- **Configuration**: Next.js recommended rules, TypeScript support
- **Integration**: VS Code integration, pre-commit hooks

**PostCSS + Autoprefixer**
- **Why**: CSS processing, vendor prefixes, future CSS features
- **Configuration**: Tailwind CSS integration, browser compatibility

## Dependencies Analysis

### Core Dependencies
```json
{
  "next": "15.2.4",           // Framework
  "react": "^19",             // UI Library
  "typescript": "^5",         // Language
  "tailwindcss": "^3.4.17",  // Styling
  "@ai-sdk/openai": "latest", // AI Integration
  "react-hook-form": "^7.54.1", // Forms
  "zod": "^3.24.1",          // Validation
  "leaflet": "^1.9.4",       // Maps
  "lucide-react": "^0.454.0" // Icons
}
```

### UI Component Dependencies
```json
{
  "@radix-ui/react-*": "latest", // Accessible primitives
  "class-variance-authority": "^0.7.1", // Component variants
  "clsx": "^2.1.1",             // Conditional classes
  "tailwind-merge": "^2.5.5"    // Tailwind class merging
}
```

### Development Dependencies
```json
{
  "@types/node": "^22",        // Node.js types
  "@types/react": "^19",       // React types
  "@types/leaflet": "^1.9.18", // Leaflet types
  "postcss": "^8",             // CSS processing
  "autoprefixer": "^10.4.20"   // CSS vendor prefixes
}
```

## Development Environment

### Required Tools
- **Node.js**: 18+ (LTS recommended)
- **Package Manager**: pnpm (preferred), npm, or yarn
- **Editor**: VS Code with TypeScript, Tailwind CSS extensions
- **Browser**: Chrome/Firefox with React DevTools

### Environment Variables
```env
# Required for AI chat functionality
OPENAI_API_KEY=your_openai_api_key_here

# Optional for enhanced features
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Development Scripts
```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint"          // Code linting
}
```

## Performance Considerations

### Bundle Size Optimization
- **Tree Shaking**: Automatic with Next.js and modern bundlers
- **Code Splitting**: Automatic route-based splitting
- **Dynamic Imports**: Lazy loading for large components
- **Image Optimization**: Next.js Image component with automatic optimization

### Runtime Performance
- **React 19 Features**: Concurrent rendering, automatic batching
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Intersection Observer for below-fold content
- **Caching**: Browser caching, API response caching

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Security Implementation

### Input Validation
- **Zod Schemas**: All user inputs validated with TypeScript schemas
- **Sanitization**: HTML sanitization for user-generated content
- **Rate Limiting**: API endpoint protection (future implementation)

### Data Privacy
- **No Persistent Storage**: Student data not stored server-side
- **HTTPS Only**: All communications encrypted
- **Minimal Data Collection**: Only necessary information collected

### API Security
- **Environment Variables**: Sensitive keys stored securely
- **CORS Configuration**: Proper cross-origin request handling
- **Error Handling**: No sensitive information in error messages

## Testing Strategy

### Current Testing Approach
- **Manual Testing**: Comprehensive user flow testing
- **TypeScript**: Compile-time error catching
- **ESLint**: Static code analysis

### Recommended Testing Implementation
```typescript
// Unit Testing
import { render, screen } from '@testing-library/react'
import { CollegeMatchingService } from '@/lib/matching-service'

// Integration Testing
import { test, expect } from '@playwright/test'

// Component Testing
import { composeStories } from '@storybook/react'
```

### Testing Tools (Future)
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **Storybook**: Component documentation and testing

## Deployment Configuration

### Vercel Deployment
```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "devCommand": "next dev"
}
```

### Environment Configuration
- **Production**: Vercel with automatic deployments
- **Staging**: Preview deployments for pull requests
- **Development**: Local development with hot reload

### Build Optimization
- **Static Generation**: Pre-build static pages where possible
- **Image Optimization**: Automatic image compression and format selection
- **Font Optimization**: Automatic font loading optimization
- **Bundle Analysis**: Regular bundle size monitoring

## Integration Points

### Current Integrations
- **OpenAI API**: Chat counselor functionality
- **Leaflet Maps**: Geographic visualization
- **Mock Data**: Static college information

### Future Integration Opportunities
- **College APIs**: Real-time college data
- **Payment Processors**: Application fee handling
- **Email Services**: Notification system
- **Analytics**: User behavior tracking
- **CRM Systems**: Lead management

## Development Workflow

### Code Organization
```
src/
├── app/           # Next.js App Router
├── components/    # React components
│   ├── ui/       # Base UI components
│   └── *.tsx     # Feature components
├── lib/          # Utility functions and services
├── types/        # TypeScript type definitions
├── data/         # Static data and constants
└── hooks/        # Custom React hooks
```

### Coding Standards
- **TypeScript**: Strict mode, comprehensive typing
- **ESLint**: Next.js recommended rules + custom rules
- **Prettier**: Consistent code formatting
- **Naming**: Descriptive names, consistent conventions

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: Individual feature development
- **Pull Requests**: Code review and testing
- **Conventional Commits**: Structured commit messages

## Monitoring & Observability

### Current Monitoring
- **Console Logging**: Development debugging
- **Error Boundaries**: React error catching
- **TypeScript**: Compile-time error prevention

### Recommended Monitoring (Future)
- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Core web vitals and user metrics
- **LogRocket**: Session replay and debugging
- **Hotjar**: User behavior analytics

## Scalability Considerations

### Current Architecture Limitations
- **No Database**: All data is static/mock
- **No User Accounts**: No persistent user state
- **Single Server**: No horizontal scaling

### Scalability Roadmap
1. **Database Integration**: PostgreSQL or MongoDB
2. **User Authentication**: NextAuth.js or Auth0
3. **Caching Layer**: Redis for session and data caching
4. **CDN**: Global content distribution
5. **Microservices**: Service decomposition for complex features

## Maintenance & Updates

### Dependency Management
- **Regular Updates**: Monthly dependency updates
- **Security Patches**: Immediate security update application
- **Breaking Changes**: Careful evaluation and testing

### Code Maintenance
- **Refactoring**: Regular code quality improvements
- **Documentation**: Keep documentation current
- **Performance**: Regular performance audits and optimizations
