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
- Dynamic routes use `async params`: `{ params }: { params: Promise<{ id: string }> }`
- Always validate required fields before database operations
- Strip sensitive fields (e.g., `password_hash`) before returning user data
- Standard error responses: `NextResponse.json({ error: 'message' }, { status: code })`

```typescript
// Example pattern from app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const { password_hash, ...safeUser } = user
  return NextResponse.json({ user: safeUser, success: true })
}
```

### Client Hooks
- Use custom hooks from `hooks/use-api.ts` for data fetching (provides loading/error state)
- Use `hooks/use-realtime.ts` for WebSocket subscriptions (messages, notifications, presence)
- All hooks return `{ data, error, isLoading, ...methods }`

### Session Management
- Sessions stored in HTTP-only cookies via `cookies()` from `next/headers`
- Auth flow: login/signup → set `session` cookie → check via `/api/auth/session`
- `WalletProvider` checks session on mount and when wallet connects
- Logout clears cookie via `/api/auth/logout`

### UI Components
- shadcn/ui pattern with CVA variants in `components/ui/`
- Use `cn()` utility from `lib/utils.ts` for merging Tailwind classes
- Button variants include Web3-styled options: `gradient`, `glow`, `glass`, `purple`, `cyan`
- All pages in `app/` use `'use client'` directive for interactivity

### Path Aliases
Use `@/` prefix for imports (configured in tsconfig.json):
```typescript
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
```

## Database

### Profile Type System
DevPump supports 4 distinct profile types with customizable layouts:
- **Personal:** Individual developers (max 10 blocks, requires wallet-display + skills)
- **Team:** Development teams (max 15 blocks, requires team-members)
- **Community:** DAOs and communities (max 12 blocks, requires text)
- **Project:** Individual projects (max 12 blocks, requires text + roadmap)

Configuration defined in `types/profile.ts` - use `getProfileConfig(type)` to access.

### Profile Builder System
Located in `components/profile-builder/`:
- **`profile-builder.tsx`** - Main builder component with edit/preview modes
- **`builder-canvas.tsx`** - Drag-and-drop canvas using @dnd-kit
- **`block-palette.tsx`** - Sidebar showing available content blocks
- **`content-blocks.tsx`** - Individual block components (text, wallet, skills, etc.)
- **`hooks/use-profile-builder.ts`** - State management with Zustand

Usage: `<ProfileBuilder userId={user.id} initialProfileType="personal" />`

### Schema Changes
1. Update `lib/schema.sql` with new tables/columns
2. Run the SQL in Supabase SQL Editor
3. Update TypeScript types in `lib/supabase.ts`
4. Add CRUD functions to `lib/db.ts`

### Key Tables
- `users` - Supports both `wallet_address` and `email`/`password_hash` auth (either field can be null)
- `connections` - Must be 'accepted' before users can message each other
- `posts` - Has `type` enum: question, news, discussion, tutorial, hiring
- `post_votes` - Unique constraint on `(user_id, post_id)` prevents duplicate votes
- All tables use UUID primary keys via `uuid_generate_v4()`

### Supabase Client Pattern
- Client-side: `supabase` from `lib/supabase.ts` (uses anon key)
- Server-side: `createServerClient()` (uses service role key for bypassing RLS)
- API routes use server client for full database access

## Solana Integration

### Wallet Adapters
Configured in `providers/wallet-provider.tsx` with Phantom, Solflare, and Backpack. Webpack config in `next.config.ts` handles Node.js polyfills:
```typescript
// next.config.ts fallbacks required for Solana
config.resolve.fallback = {
  fs: false, net: false, tls: false, crypto: false, stream: false, buffer: false
}
```

### Auto-Registration
When a new wallet connects, `app/api/auth/wallet/route.ts` auto-creates a user with username `user_[first8chars]`.

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL      # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY # Supabase anon key (client-side)
SUPABASE_SERVICE_ROLE_KEY     # Service role key (API routes only)
NEXT_PUBLIC_SOLANA_NETWORK    # devnet or mainnet-beta
```

## File Organization
- **Pages**: `app/[route]/page.tsx` (all use `'use client'`)
- **API**: `app/api/[resource]/route.ts` (server-side)
- **Reusable UI**: `components/ui/` (shadcn pattern)
- **Feature components**: `components/[feature]/`
- **Layout components**: `components/layout/`
