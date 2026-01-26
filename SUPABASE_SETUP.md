# Supabase Setup Guide for DevPump

This guide will walk you through setting up Supabase for the DevPump application.

## Prerequisites

- A [Supabase](https://supabase.com) account (free tier works)
- Node.js 18+ installed
- Git and the DevPump repository cloned

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: DevPump (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for your project to be provisioned

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, navigate to **Settings** → **API**
2. You'll need three values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: A long JWT token (starts with `eyJ...`)
   - **service_role key**: Another JWT token (keep this secret!)

## Step 3: Set Up the Database Schema

1. In your Supabase dashboard, navigate to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `lib/schema.sql` from this repository
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter`
6. You should see a success message and all tables created

The schema includes:
- ✅ 8 main tables (users, projects, teams, messages, etc.)
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-updating timestamps and vote counts
- ✅ Foreign key constraints

## Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and update with your Supabase credentials:
   ```env
   # Solana Configuration
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Optional
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. Replace the placeholder values with your actual Supabase credentials

## Step 5: Install Dependencies and Run

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 6: Verify the Setup

1. Click **"Sign Up"** or **"Connect Wallet"** on the landing page
2. Create a test user account
3. Try creating a post or project
4. Check your Supabase dashboard → **Table Editor** to see the data

## Common Issues & Troubleshooting

### Issue: "Failed to fetch" or connection errors
**Solution**: 
- Verify your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check that your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the **anon** key, not service_role
- Ensure there are no extra spaces or quotes in `.env.local`

### Issue: "JWT expired" or authentication errors
**Solution**:
- Your JWT keys may have been regenerated. Get fresh keys from Supabase Settings → API
- Clear your browser cache and cookies

### Issue: "Permission denied" or RLS policy errors
**Solution**:
- Make sure you ran the complete schema in `lib/schema.sql`
- Check that Row Level Security policies were created (see bottom of schema file)
- Verify you're authenticated when trying to insert/update data

### Issue: Database tables not found
**Solution**:
- Go to Supabase SQL Editor and run the `lib/schema.sql` file again
- Check the SQL Editor output for any error messages
- Verify you're connected to the correct project

### Issue: "relation does not exist" errors
**Solution**:
- Some queries may reference tables not yet created. Run the full schema.sql
- Check that foreign key constraints are properly set up

## Advanced Configuration

### Custom RLS Policies

If you need to customize access control, edit the RLS policies in the SQL Editor:

```sql
-- Example: Allow only verified users to create posts
DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Verified users can create posts" ON posts 
  FOR INSERT WITH CHECK (
    auth.uid()::text = author_id::text AND 
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND is_verified = true)
  );
```

### Enable Realtime Subscriptions

For real-time features (live messages, notifications):

1. Go to **Database** → **Replication**
2. Enable replication for tables: `messages`, `notifications`, `team_messages`
3. In your code, use Supabase realtime:
   ```typescript
   supabase
     .channel('messages')
     .on('postgres_changes', 
       { event: 'INSERT', schema: 'public', table: 'messages' },
       (payload) => console.log('New message:', payload)
     )
     .subscribe()
   ```

### Storage for User Avatars/Images

1. Go to **Storage** in Supabase dashboard
2. Create a bucket called `avatars` (public)
3. Create a bucket called `project-images` (public)
4. Update your upload code to use these buckets

## Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret, only for server-side)
- `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta` (for production)
- `NEXT_PUBLIC_SOLANA_RPC_URL` (use a paid RPC like Helius or QuickNode)

## Database Backups

Supabase automatically backs up your database:
- **Free tier**: Daily backups for 7 days
- **Pro tier**: Point-in-time recovery

To manually backup:
1. Go to **Database** → **Backups**
2. Click **"Create backup"**

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Support

If you encounter issues:
1. Check the [Supabase Discord](https://discord.supabase.com)
2. Open an issue on the DevPump GitHub repository
3. Review the Supabase logs in the dashboard → **Logs** → **Postgres Logs**

---

**Next Steps**: Once Supabase is set up, you can start building! Check out the main [README.md](./README.md) for more information about the DevPump platform.
