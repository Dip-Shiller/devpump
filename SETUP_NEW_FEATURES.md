# Quick Setup Guide - New Features

## What's New?
- **Collabs** - Friend/collaboration system  
- **Group Chats** - Group messaging
- **Profile Photos** - Photo gallery
- **Daily Updates** - Status/feed posts
- All integrated into the app with easy navigation

## Setup Steps

### 1. Database Migration (REQUIRED)
Run the updated schema in Supabase SQL Editor:
```bash
# Option A: Copy entire updated schema
1. Go to Supabase Dashboard → SQL Editor
2. Open lib/schema.sql
3. Copy the ENTIRE file content
4. Paste into SQL Editor
5. Click "Run"

# Option B: Run only new tables
If you want to preserve existing data, run just the new sections:
- DROP/CREATE new tables only
- Update RLS policies
```

**Note:** The schema includes all previous tables + new ones. Check existing data first!

### 2. Type Definitions
Types are auto-updated in:
- `lib/supabase.ts` - TypeScript interfaces
- Ready to use immediately

### 3. Database Functions
Already added to `lib/db.ts` - no additional setup needed

### 4. API Routes
New routes automatically available:
- `/api/collabs`
- `/api/group-chats`
- `/api/profile-photos`
- `/api/profile-updates`

### 5. Frontend Access
All features accessible immediately:
- New pages available at `/collabs`, `/group-chats`, `/feed/daily-updates`
- Updated profile page at `/profile`
- New sidebar menu items under "Collaborate & Connect"

## Testing Immediately

### Test Collabs
1. Navigate to `/builders`
2. Click "Add Collab" on any builder card
3. Go to `/collabs` to see requests

### Test Group Chats
1. Go to `/group-chats`
2. Click "+ New Group Chat"
3. Create and manage groups

### Test Profile Photos
1. Go to `/profile`
2. Click "Photos" tab
3. Add photo URL to upload

### Test Daily Updates
1. Go to `/profile` → "Daily Updates" tab
2. Post an update
3. View feed at `/feed/daily-updates`

## Environment Variables
No new environment variables needed - uses existing Supabase setup.

## Troubleshooting

### "Permission denied" errors
- Check RLS policies in Supabase
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set

### "User ID not found"
- Ensure user is logged in before accessing features
- Check auth token is valid

### Database errors
- Run schema SQL again in Supabase Editor
- Check for duplicate key errors in existing data
- Verify foreign key constraints aren't violated

### Components not rendering
- Ensure hooks are used in client components (`'use client'`)
- Check browser console for TypeScript errors
- Verify all imports are correct

## Next Steps

1. **Test all features thoroughly** in development
2. **Deploy to staging** to verify functionality
3. **Get user feedback** on UX/flow
4. **Deploy to production** when ready
5. **Monitor for issues** in production

## Key Files to Reference

| Purpose | File |
|---------|------|
| Database | `lib/schema.sql` |
| API Routes | `app/api/{feature}/route.ts` |
| Hooks | `hooks/use-api.ts` |
| Types | `lib/supabase.ts` |
| Components | `components/ui/{feature}.tsx` |
| Pages | `app/{feature}/page.tsx` |
| Full Docs | `NEW_FEATURES_IMPLEMENTATION.md` |

## Git Workflow

```bash
# If using Git
git add .
git commit -m "feat: Add collabs, group chats, photos, and daily updates"
git push

# Create PR and review before merging to main
```

## Performance Notes

- All pages use pagination/lazy loading where applicable
- Indexes added to frequently queried columns
- WebSocket support ready for real-time updates

## Support

If you encounter issues:
1. Check the error message in console
2. Verify database schema was applied correctly
3. Check that all API routes exist
4. Review `NEW_FEATURES_IMPLEMENTATION.md` for detailed info
5. Look at specific page implementations for patterns
