-- Profile Builder Database Migration
-- Run this in your Supabase SQL Editor to add profile builder support

BEGIN;

-- Add new columns to users table
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS profile_type TEXT 
    CHECK (profile_type IN ('personal', 'team', 'community', 'project')) 
    DEFAULT 'personal',
  ADD COLUMN IF NOT EXISTS profile_layout JSONB 
    DEFAULT '{"blocks": [], "theme": "default", "columns": 12}',
  ADD COLUMN IF NOT EXISTS privacy_settings JSONB 
    DEFAULT '{"walletAddressVisible": true, "emailVisible": false, "anonymousMode": false}';

-- Create index for profile type queries
CREATE INDEX IF NOT EXISTS idx_users_profile_type ON users(profile_type);

-- Update existing users to have default profile type
UPDATE users 
SET profile_type = 'personal' 
WHERE profile_type IS NULL;

-- Update existing users to have default profile layout
UPDATE users
SET profile_layout = '{"blocks": [], "theme": "default", "columns": 12}'::jsonb
WHERE profile_layout IS NULL;

-- Update existing users to have default privacy settings
UPDATE users
SET privacy_settings = '{"walletAddressVisible": true, "emailVisible": false, "anonymousMode": false}'::jsonb
WHERE privacy_settings IS NULL;

COMMIT;

-- Verify the migration
SELECT 
  COUNT(*) as total_users,
  COUNT(profile_type) as users_with_type,
  COUNT(profile_layout) as users_with_layout
FROM users;
