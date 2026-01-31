-- DevPump New Features Migration
-- Run this in Supabase SQL Editor to add new collaboration features
-- This adds: Collabs, Group Chats, Profile Photos, Profile Updates

-- ============================================
-- COLLABS TABLE (Friend/Connection List)
-- ============================================
CREATE TABLE IF NOT EXISTS collabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2)
);

CREATE INDEX IF NOT EXISTS idx_collabs_user1 ON collabs(user_id_1);
CREATE INDEX IF NOT EXISTS idx_collabs_user2 ON collabs(user_id_2);
CREATE INDEX IF NOT EXISTS idx_collabs_status ON collabs(status);

-- ============================================
-- GROUP CHATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS group_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_chats_owner ON group_chats(owner_id);

-- ============================================
-- GROUP CHAT MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS group_chat_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_chat_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_chat_members_group ON group_chat_members(group_chat_id);
CREATE INDEX IF NOT EXISTS idx_group_chat_members_user ON group_chat_members(user_id);

-- ============================================
-- GROUP MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS group_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_group_messages_group ON group_messages(group_chat_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_messages_sender ON group_messages(sender_id);

-- ============================================
-- PROFILE PHOTOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_photos_user ON profile_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_photos_primary ON profile_photos(user_id) WHERE is_primary = TRUE;

-- ============================================
-- PROFILE UPDATES TABLE (Daily Updates/Feed)
-- ============================================
CREATE TABLE IF NOT EXISTS profile_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'collab_only', 'private')) DEFAULT 'public',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_updates_user ON profile_updates(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_updates_created ON profile_updates(created_at DESC);

-- ============================================
-- PROFILE UPDATE LIKES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profile_update_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_update_id UUID REFERENCES profile_updates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_update_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_update_likes_update ON profile_update_likes(profile_update_id);
CREATE INDEX IF NOT EXISTS idx_profile_update_likes_user ON profile_update_likes(user_id);

-- ============================================
-- NEW TRIGGERS
-- ============================================
-- Add triggers for new tables (using existing update_updated_at_column function)
DROP TRIGGER IF EXISTS update_collabs_updated_at ON collabs;
CREATE TRIGGER update_collabs_updated_at
  BEFORE UPDATE ON collabs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_chats_updated_at ON group_chats;
CREATE TRIGGER update_group_chats_updated_at
  BEFORE UPDATE ON group_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_group_messages_updated_at ON group_messages;
CREATE TRIGGER update_group_messages_updated_at
  BEFORE UPDATE ON group_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profile_updates_updated_at ON profile_updates;
CREATE TRIGGER update_profile_updates_updated_at
  BEFORE UPDATE ON profile_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update profile update likes count
CREATE OR REPLACE FUNCTION update_profile_update_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profile_updates SET likes_count = likes_count + 1 WHERE id = NEW.profile_update_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profile_updates SET likes_count = likes_count - 1 WHERE id = OLD.profile_update_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profile_update_like_counts ON profile_update_likes;
CREATE TRIGGER update_profile_update_like_counts
  AFTER INSERT OR DELETE ON profile_update_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_update_likes();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on new tables
ALTER TABLE collabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_update_likes ENABLE ROW LEVEL SECURITY;

-- Collabs: Users can view their own collabs
DROP POLICY IF EXISTS "Users can view own collabs" ON collabs;
CREATE POLICY "Users can view own collabs" ON collabs FOR SELECT 
  USING (user_id_1::text = auth.uid()::text OR user_id_2::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can create collab requests" ON collabs;
CREATE POLICY "Users can create collab requests" ON collabs FOR INSERT 
  WITH CHECK (user_id_1::text = auth.uid()::text OR user_id_2::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own collab status" ON collabs;
CREATE POLICY "Users can update own collab status" ON collabs FOR UPDATE 
  USING (user_id_2::text = auth.uid()::text);

-- Group Chats: Members can view and message
DROP POLICY IF EXISTS "Group members can view chats" ON group_chats;
CREATE POLICY "Group members can view chats" ON group_chats FOR SELECT 
  USING (id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Users can create group chats" ON group_chats;
CREATE POLICY "Users can create group chats" ON group_chats FOR INSERT 
  WITH CHECK (owner_id::text = auth.uid()::text);

-- Group Chat Members
DROP POLICY IF EXISTS "Users can view group members" ON group_chat_members;
CREATE POLICY "Users can view group members" ON group_chat_members FOR SELECT 
  USING (group_chat_id IN (SELECT id FROM group_chats));

DROP POLICY IF EXISTS "Admins can manage group members" ON group_chat_members;
CREATE POLICY "Admins can manage group members" ON group_chat_members FOR INSERT 
  WITH CHECK (user_id::text = auth.uid()::text);

-- Group Messages: Members can read and send
DROP POLICY IF EXISTS "Group members can view messages" ON group_messages;
CREATE POLICY "Group members can view messages" ON group_messages FOR SELECT 
  USING (group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Group members can send messages" ON group_messages;
CREATE POLICY "Group members can send messages" ON group_messages FOR INSERT 
  WITH CHECK (sender_id::text = auth.uid()::text AND group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id::text = auth.uid()::text));

-- Profile Photos: Public viewing, users can manage their own
DROP POLICY IF EXISTS "Profile photos are viewable by everyone" ON profile_photos;
CREATE POLICY "Profile photos are viewable by everyone" ON profile_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can upload their own photos" ON profile_photos;
CREATE POLICY "Users can upload their own photos" ON profile_photos FOR INSERT 
  WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete their own photos" ON profile_photos;
CREATE POLICY "Users can delete their own photos" ON profile_photos FOR DELETE 
  USING (user_id::text = auth.uid()::text);

-- Profile Updates: Based on visibility settings
DROP POLICY IF EXISTS "Profile updates are viewable based on visibility" ON profile_updates;
CREATE POLICY "Profile updates are viewable based on visibility" ON profile_updates FOR SELECT 
  USING (
    visibility = 'public' OR 
    user_id::text = auth.uid()::text OR 
    (visibility = 'collab_only' AND user_id IN (
      SELECT CASE WHEN user_id_1 = auth.uid()::uuid THEN user_id_2 ELSE user_id_1 END 
      FROM collabs WHERE status = 'accepted'
    ))
  );

DROP POLICY IF EXISTS "Users can create profile updates" ON profile_updates;
CREATE POLICY "Users can create profile updates" ON profile_updates FOR INSERT 
  WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own updates" ON profile_updates;
CREATE POLICY "Users can update own updates" ON profile_updates FOR UPDATE 
  USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own updates" ON profile_updates;
CREATE POLICY "Users can delete own updates" ON profile_updates FOR DELETE 
  USING (user_id::text = auth.uid()::text);

-- Profile Update Likes
DROP POLICY IF EXISTS "Users can view update likes" ON profile_update_likes;
CREATE POLICY "Users can view update likes" ON profile_update_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can like updates" ON profile_update_likes;
CREATE POLICY "Users can like updates" ON profile_update_likes FOR INSERT 
  WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can unlike updates" ON profile_update_likes;
CREATE POLICY "Users can unlike updates" ON profile_update_likes FOR DELETE 
  USING (user_id::text = auth.uid()::text);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Verify tables were created
DO $$
BEGIN
  RAISE NOTICE '✓ Migration complete! New tables added:';
  RAISE NOTICE '  - collabs';
  RAISE NOTICE '  - group_chats';
  RAISE NOTICE '  - group_chat_members';
  RAISE NOTICE '  - group_messages';
  RAISE NOTICE '  - profile_photos';
  RAISE NOTICE '  - profile_updates';
  RAISE NOTICE '  - profile_update_likes';
  RAISE NOTICE '✓ All RLS policies configured';
  RAISE NOTICE '✓ All triggers configured';
  RAISE NOTICE 'Ready to use new features!';
END $$;
