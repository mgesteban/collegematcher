# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Development**: `pnpm dev` or `npm run dev` - Start Next.js development server
- **Build**: `pnpm build` or `npm run build` - Build for production
- **Start**: `pnpm start` or `npm run start` - Start production server
- **Lint**: `pnpm lint` or `npm run lint` - Run Next.js linting

## Architecture

This is a Next.js 15 application for a Community College Matching Agent that helps students find suitable community colleges based on their preferences, academic interests, and personal circumstances.

### Core Components

**Main Application Flow**:
- `/app/page.tsx` - Root page with tab-based interface containing student assessment, match results, map view, financial calculator, application tracker, and AI counselor
- `/components/student-assessment.tsx` - Multi-step form for collecting student profile data
- `/lib/matching-service.ts` - Core matching algorithm that scores colleges based on student profile

**Data Models** (`/types/index.ts`):
- `StudentProfile` - Comprehensive student data including academic interests, career goals, financial constraints, schedule preferences, and personal factors
- `CommunityCollege` - College data with programs, costs, facilities, and location
- `MatchResult` - Scored match between student and college with reasons and recommendations

**Matching Algorithm** (`/lib/matching-service.ts`):
- Weighs factors: Financial (25%), Programs (30%), Schedule (20%), Geography (15%), Services (10%)
- Returns sorted matches with scores, reasons, concerns, and next steps

**AI Integration**:
- `/app/api/chat/route.ts` - OpenAI GPT-4o powered counselor API
- Uses student profile and match data to provide personalized advice

### UI Framework

- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React useState for local component state
- **Components**: Extensive use of Radix UI primitives via shadcn/ui
- **Path Alias**: `@/*` maps to project root

### Key Features

1. **Student Assessment**: Multi-step form collecting comprehensive profile
2. **AI Matching**: Algorithmic scoring system for college recommendations  
3. **Interactive Results**: Tabbed interface with matches, map, finances, applications, and chat
4. **AI Counselor**: Contextual chat assistant using student data and match results
5. **Mock Data**: Currently uses `/data/mock-colleges.ts` for demonstration

### Development Notes

- TypeScript throughout with strict configuration
- Component structure follows Next.js App Router conventions
- Uses React 19 and Next.js 15
- All components are client-side (`"use client"`) due to interactive nature
- Mock data currently drives the matching system - replace with real API when available