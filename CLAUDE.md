# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Community College Matcher - An AI-powered Next.js application that helps students find suitable community colleges based on their preferences, academic goals, and personal circumstances.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form with zod validation
- **AI Integration**: OpenAI SDK with Vercel AI SDK
- **Maps**: react-leaflet for college location visualization

### Key Components

**Feature Components** (`/components/`):
- `student-assessment.tsx` - Multi-step questionnaire to collect student preferences
- `match-results.tsx` - Displays AI-matched colleges with scores
- `chat-interface.tsx` - AI counselor chatbot using OpenAI
- `college-map.tsx` - Interactive map showing college locations
- `financial-calculator.tsx` - Cost estimation and financial aid calculator
- `application-tracker.tsx` - Tracks application status for multiple colleges

**Services** (`/lib/`):
- `matching-service.ts` - Core matching algorithm that scores colleges based on student profile

**Data Flow**:
1. Student completes assessment → creates `StudentProfile`
2. `CollegeMatchingService` processes profile against college data
3. Returns `MatchResult[]` with compatibility scores
4. Results displayed across multiple views (list, map, financial, etc.)

### API Routes
- `/api/chat` - Handles AI counselor chat interactions using OpenAI

### Type System
All major types are defined in `/types/index.ts`:
- `StudentProfile` - Student preferences and information
- `College` - College data structure
- `MatchResult` - College with compatibility score
- `Application` - Application tracking data

