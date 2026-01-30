# Quick Start Guide - DevPump with Supabase

Get DevPump running in under 10 minutes!

## 1️⃣ Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/Dip-Shiller/devpump.git
cd devpump

# Install dependencies
npm install
```

## 2️⃣ Set Up Supabase (5 minutes)

### Create a Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com) and sign in/up
2. Click **"New Project"**
3. Fill in:
   - Name: `DevPump`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
4. Click **"Create new project"** and wait ~2 minutes

### Set Up the Database
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy ALL contents from `lib/schema.sql` (in this repo)
4. Paste and click **"Run"**
5. ✅ Success! All tables created

### Get Your API Keys
1. Go to **Settings** → **API** in Supabase
2. Copy these 3 values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Long key starting with `eyJ...`
   - **service_role**: Another long key (keep secret!)

## 3️⃣ Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your favorite editor
nano .env.local  # or code .env.local
```

Update these lines with your Supabase values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

## 4️⃣ Run DevPump (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 5️⃣ Test It Out

1. Click **"Sign Up"** or **"Connect Wallet"**
2. Create a profile
3. Make a post in the feed
4. Check Supabase dashboard → **Table Editor** → **users** to see your data!

## Troubleshooting

### "Failed to fetch" error?
- Double-check your `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- Make sure it's the **anon** key, not service_role

### "Relation does not exist"?
- Run the complete `lib/schema.sql` in Supabase SQL Editor again

### Still stuck?
- Read the full guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Check [Supabase docs](https://supabase.com/docs)

## Next Steps

- 📖 Read the full [README.md](./README.md)
- 🗄️ Detailed setup: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- 🚀 Deploy to Vercel (add env vars there too!)

---

**Need help?** Open an issue on GitHub or check the Supabase Discord!
