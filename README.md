# DevPump - The LinkedIn for Solana Builders

Where **Transparency** and **Anonymity** meets **Clarity**

DevPump is a professional network for Solana builders. Showcase your work, find elite projects, and build your reputation—all while staying pseudonymous.

**🚀 [Quick Start Guide](./QUICK_START.md)** | **📖 [Supabase Setup](./SUPABASE_SETUP.md)**

## Features

- **Wallet Authentication** - Connect with Phantom, Solflare, Backpack, or Ledger
- **Email/Password Signup** - Create accounts with traditional authentication
- **User Profiles** - Build your pseudonymous reputation with on-chain verification
- **Team Building** - Create groups, manage teams, and collaborate with builders
- **Project Showcase** - Promote your projects and find contributors
- **Community Feed** - Post questions, share news, and engage with the community
- **Direct Messaging** - Connect with builders and communicate privately
- **Connection System** - Send/accept connection requests before messaging
- **Real-time Updates** - WebSocket support via Supabase Realtime for live messages, notifications, and presence

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **UI Components**: Custom shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier works - [sign up here](https://supabase.com))
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/devpump.git
cd devpump
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   
   **Follow the complete setup guide**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   
   Quick steps:
   - Create a Supabase project at [app.supabase.com](https://app.supabase.com)
   - Run the SQL schema from `lib/schema.sql` in Supabase SQL Editor
   - Get your API keys from Supabase Settings → API

4. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Supabase (get these from your Supabase project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

5. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
devpump/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── users/        # User CRUD operations
│   │   ├── projects/     # Project management
│   │   ├── teams/        # Team operations
│   │   ├── messages/     # Direct messaging
│   │   ├── connections/  # Connection requests
│   │   └── posts/        # Feed posts
│   ├── feed/             # Community feed page
│   ├── messages/         # Direct messages page
│   ├── profile/          # User profile page
│   ├── signup/           # Registration page
│   ├── teams/            # Teams page
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── wallet-button.tsx # Wallet connection button
├── hooks/
│   └── use-api.ts        # API hooks for data fetching
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database operations (Supabase)
│   ├── supabase.ts       # Supabase client & types
│   ├── schema.sql        # PostgreSQL database schema
│   ├── solana.ts         # Solana utilities
│   └── utils.ts          # General utilities
├── providers/
│   └── wallet-provider.tsx # Solana wallet context
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth` - Register or login (wallet/email)

### Users
- `GET /api/users` - List users with filters
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user by ID
- `PATCH /api/users/[id]` - Update user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project

### Teams
- `GET /api/teams` - List teams
- `POST /api/teams` - Create team

### Messages
- `GET /api/messages` - Get conversations/messages
- `POST /api/messages` - Send message

### Connections
- `GET /api/connections` - Get connection requests
- `POST /api/connections` - Send connection request
- `PATCH /api/connections` - Accept/decline request

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create post

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## Database

DevPump uses **Supabase** (PostgreSQL) for its database:

- Complete schema in `lib/schema.sql`
- Row Level Security (RLS) policies for access control
- Real-time subscriptions support
- Automatic backups included

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana network (devnet/mainnet-beta) | Yes |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom RPC endpoint | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `DATABASE_URL` | Direct PostgreSQL connection string | Optional |
| `NEXTAUTH_SECRET` | Auth secret for sessions | Optional |

See `.env.example` for a complete template.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- Discord: [Join our community](#)
- Twitter: [@devpump](#)
- GitHub Issues: [Report bugs](https://github.com/your-username/devpump/issues)

---

Built with love on Solana
