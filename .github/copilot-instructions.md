# DevPump - AI Agent Instructions

## Project Overview
DevPump is a pseudonymous professional network for Solana builders. It combines Web3 wallet authentication with traditional email/password signup, built on Next.js 15 with Supabase as the backend.

## Architecture

### Data Flow
1. **Client Components** (`'use client'`) → Custom API hooks (`hooks/use-api.ts`) → Next.js API Routes (`app/api/**`)
2. **API Routes** → Database layer (`lib/db.ts`) → Supabase client (`lib/supabase.ts`)
3. **Real-time updates** via Supabase WebSocket subscriptions (`hooks/use-realtime.ts`)

### Key Modules
- **`lib/db.ts`** - All database operations (CRUD for users, projects, teams, posts, messages, connections)
- **`lib/supabase.ts`** - Supabase client + TypeScript type definitions for all entities
- **`lib/schema.sql`** - PostgreSQL schema with RLS policies, triggers, and indexes
- **`providers/wallet-provider.tsx`** - Auth context combining wallet + traditional auth

## Development Commands
```bash
npm run dev          # Start with Turbopack (fast refresh)
npm run build        # Production build
npm run lint         # ESLint check
```

## Patterns & Conventions

### API Routes
- Located in `app/api/[resource]/route.ts`
- Use `NextRequest`/`NextResponse` from `next/server`
- Always validate required fields before database operations
- Strip sensitive fields (e.g., `password_hash`) before returning user data

```typescript
// Example pattern from app/api/auth/route.ts
const { password_hash, ...safeUser } = user
return NextResponse.json({ user: safeUser, success: true })
```

### Client Hooks
- Use custom hooks from `hooks/use-api.ts` for data fetching (provides loading/error state)
- Use `hooks/use-realtime.ts` for WebSocket subscriptions (messages, notifications, presence)

### UI Components
- shadcn/ui pattern with CVA variants in `components/ui/`
- Use `cn()` utility from `lib/utils.ts` for merging Tailwind classes
- Button variants include Web3-styled options: `gradient`, `glow`, `glass`, `purple`, `cyan`

### Path Aliases
Use `@/` prefix for imports (configured in tsconfig.json):
```typescript
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
```

## Database

### Schema Changes
1. Update `lib/schema.sql` with new tables/columns
2. Run the SQL in Supabase SQL Editor
3. Update TypeScript types in `lib/supabase.ts`
4. Add CRUD functions to `lib/db.ts`

### Key Tables
- `users` - Supports both `wallet_address` and `email`/`password_hash` auth
- `connections` - Must be 'accepted' before users can message each other
- `posts` - Has `type` enum: question, news, discussion, tutorial, hiring
- `post_votes` - Unique constraint prevents duplicate votes

## Solana Integration

### Wallet Adapters
Configured in `providers/wallet-provider.tsx` with Phantom, Solflare, and Backpack. Webpack config in `next.config.ts` handles Node.js polyfills.

### Auto-Registration
When a new wallet connects, the auth endpoint auto-creates a user with username `user_[first8chars]`.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key (client-side)
SUPABASE_SERVICE_ROLE_KEY     # Service role key (API routes only)
NEXT_PUBLIC_SOLANA_NETWORK    # devnet or mainnet-beta
```

## File Organization
- **Pages**: `app/[route]/page.tsx`
- **API**: `app/api/[resource]/route.ts`
- **Reusable UI**: `components/ui/` (shadcn pattern)
- **Feature components**: `components/[feature]/`
- **Layout components**: `components/layout/`
