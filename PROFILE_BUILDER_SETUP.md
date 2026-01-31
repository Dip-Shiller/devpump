# Profile Builder Setup

The profile builder is now installed but requires a database migration to work properly.

## Quick Setup (2 minutes)

### Step 1: Run the Migration

1. Open your Supabase project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** in the sidebar
3. Click **New Query**
4. Copy and paste the contents of `migrations/add-profile-builder.sql`
5. Click **Run** (or press Ctrl+Enter)

### Step 2: Verify Migration

Run this query to verify:

```sql
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('profile_type', 'profile_layout', 'privacy_settings');
```

You should see 3 rows returned.

### Step 3: Test the Builder

1. Navigate to `/profile` in your app
2. Click the **"Builder"** tab
3. Start adding blocks!

## Troubleshooting

### "Stuck on loading"
- **Cause:** Database columns not added yet
- **Fix:** Run the migration from Step 1

### "Failed to save profile"
- **Cause:** Database permissions or column types
- **Fix:** Verify migration ran successfully

### "Profile layout not saving"
- **Cause:** JSONB serialization issue
- **Fix:** Check browser console for errors

## Manual Migration (Alternative)

If the migration file doesn't work, run these commands individually:

```sql
-- Add profile_type column
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS profile_type TEXT 
    CHECK (profile_type IN ('personal', 'team', 'community', 'project')) 
    DEFAULT 'personal';

-- Add profile_layout column (stores drag-drop layout)
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS profile_layout JSONB 
    DEFAULT '{"blocks": [], "theme": "default", "columns": 12}';

-- Add privacy_settings column
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS privacy_settings JSONB 
    DEFAULT '{"walletAddressVisible": true, "emailVisible": false, "anonymousMode": false}';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_users_profile_type ON users(profile_type);

-- Update existing users with defaults
UPDATE users SET profile_type = 'personal' WHERE profile_type IS NULL;
UPDATE users SET profile_layout = '{"blocks": [], "theme": "default", "columns": 12}'::jsonb WHERE profile_layout IS NULL;
UPDATE users SET privacy_settings = '{"walletAddressVisible": true, "emailVisible": false, "anonymousMode": false}'::jsonb WHERE privacy_settings IS NULL;
```

## What Gets Added

The migration adds 3 new columns to the `users` table:

| Column | Type | Purpose |
|--------|------|---------|
| `profile_type` | TEXT | User's profile type (personal/team/community/project) |
| `profile_layout` | JSONB | Stores drag-drop block layout |
| `privacy_settings` | JSONB | User privacy preferences |

## Next Steps

After migration is complete:

1. ✅ Profile builder works immediately
2. ✅ Users can customize their profiles
3. ✅ Layouts are saved to database automatically
4. ✅ Different profile types have different allowed blocks

For more details, see [docs/PROFILE_BUILDER.md](../docs/PROFILE_BUILDER.md).
