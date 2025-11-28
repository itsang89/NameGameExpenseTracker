# Game & Expense Tracker

## Overview

A mobile-first web application that combines social finance tracking with multiplayer game score management. Users can log shared expenses and loans with friends, record game session results (Poker, Mahjong, Blackjack), and view analytics on their financial and gaming activities. The app features a Neumorphism 2.0 design aesthetic with soft, tactile UI elements and dual-shadow effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, built using Vite for fast development and optimized production builds.

**UI Library**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable components. The design implements a custom Neumorphism 2.0 theme with soft shadows, tactile elements, and monochromatic color schemes.

**Styling**: Tailwind CSS with extensive custom configuration for neumorphic design system. Custom CSS variables define light/dark mode color schemes, neumorphic shadows (raised, inset, pressed states), and theme-specific accent colors (positive/negative for finances, game colors for gaming features).

**State Management**: React Context API for global application state (DataContext) managing users, transactions, and balances. Local component state for UI interactions. TanStack Query (React Query) configured for future server-side data fetching.

**Routing**: Client-side view management without traditional routing library - uses state-based view switching between Dashboard, Friends, Analytics, Profile, and logging screens.

**Design System**: 
- Typography: Spline Sans font family with systematic scale (hero numbers, section titles, card headers, body text, labels)
- Color system: Monochromatic base (soft gray #E8ECEF light, deep charcoal #1A1D21 dark) with strategic accent colors for positive/negative balances and game elements
- Neumorphic shadows: Dual-shadow system creating convex (raised) and concave (pressed) effects
- Component library: Custom components (StatCard, FriendAvatar, GameCard, LeaderboardItem) following neumorphic principles

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Structure**: RESTful API design with `/api` prefix for all application routes. Currently uses placeholder route registration pattern awaiting implementation.

**Session Management**: Infrastructure prepared for express-session with connect-pg-simple for PostgreSQL-backed sessions.

**Development Server**: Vite middleware integration for hot module replacement during development. Custom error overlay and development tooling for Replit environment.

**Build Process**: Custom build script using esbuild for server bundling and Vite for client bundling. Server dependencies are selectively bundled (allowlist pattern) to reduce syscalls and improve cold start performance.

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach.

**Database**: PostgreSQL (via Neon Database serverless driver) - configuration present but schema minimally defined with only users table.

**Schema Design**: Current schema includes basic users table with UUID primary keys. Application logic suggests need for:
- Users/Friends table with avatar, balance tracking
- Groups table with member relationships  
- Transactions table supporting multiple types (loan, expense, game, payment)
- Transaction participants junction table for many-to-many relationships

**In-Memory Storage**: MemStorage class implements IStorage interface for development/testing without database dependency. Stores users in memory with CRUD operations.

**Data Rounding**: All monetary calculations strictly rounded to 1 decimal place ($0.1 precision) to prevent floating-point errors.

### External Dependencies

**UI Component Libraries**:
- Radix UI: Comprehensive set of unstyled, accessible primitives (Dialog, Dropdown, Select, Toast, etc.)
- shadcn/ui: Pre-built components following Radix patterns with Tailwind styling
- Lucide React: Icon library for consistent iconography

**Avatar Generation**: DiceBear API (api.dicebear.com) for generating cartoon avatars with multiple style options (adventurer, avataaars, bottts, etc.)

**Charting**: Recharts library for data visualization (AreaChart for net profit trends, analytics displays)

**Form Handling**: React Hook Form with Zod resolver for type-safe form validation

**Date Utilities**: date-fns for date manipulation and formatting

**Development Tools**:
- Replit-specific plugins for cartographer, dev banner, runtime error overlay
- TypeScript for type safety across full stack
- ESBuild for fast production builds

**Fonts**: Google Fonts (Spline Sans) and Material Symbols for iconography

**Styling Utilities**:
- clsx and tailwind-merge (via cn utility) for conditional className composition
- class-variance-authority for component variant patterns
- PostCSS with Tailwind and Autoprefixer