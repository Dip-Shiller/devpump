-- DevPump Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE,
  password_hash TEXT,
  profile_type TEXT CHECK (profile_type IN ('personal', 'team', 'community', 'project')) DEFAULT 'personal',
  profile_layout JSONB DEFAULT '{"blocks": [], "theme": "default", "columns": 12}',
  privacy_settings JSONB DEFAULT '{"walletAddressVisible": true, "emailVisible": false, "anonymousMode": false}',
  title TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  website TEXT,
  twitter TEXT,
  github TEXT,
  skills TEXT[] DEFAULT '{}',
  reputation INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  github_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Index for wallet lookups
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_skills ON users USING GIN(skills);
-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  website TEXT,
  github_url TEXT,
  category TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'paused')) DEFAULT 'planning',
  skills TEXT[] DEFAULT '{}',
  timeline TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_team ON projects(team_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills);
-- ============================================
-- TEAMS TABLE
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_teams_owner ON teams(owner_id);
-- Add foreign key to projects after teams is created
ALTER TABLE projects ADD FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;
-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'moderator', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
-- ============================================
-- CONNECTIONS TABLE
-- ============================================
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);
CREATE INDEX idx_connections_sender ON connections(sender_id);
CREATE INDEX idx_connections_receiver ON connections(receiver_id);
CREATE INDEX idx_connections_status ON connections(status);
-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at);
-- ============================================
-- POSTS TABLE
-- ============================================
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('question', 'news', 'discussion', 'tutorial', 'hiring')) DEFAULT 'discussion',
  tags TEXT[] DEFAULT '{}',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
-- ============================================
-- POST VOTES TABLE
-- ============================================
CREATE TABLE post_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('up', 'down')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
CREATE INDEX idx_post_votes_post ON post_votes(post_id);
CREATE INDEX idx_post_votes_user ON post_votes(user_id);
-- ============================================
-- ENDORSEMENTS TABLE
-- ============================================
CREATE TABLE endorsements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id, skill)
);
CREATE INDEX idx_endorsements_to ON endorsements(to_user_id);
CREATE INDEX idx_endorsements_from ON endorsements(from_user_id);
CREATE INDEX idx_endorsements_skill ON endorsements(skill);
-- ============================================
-- COMMENTS TABLE (for posts)
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
-- ============================================
-- TEAM MESSAGES TABLE (for team chat)
-- ============================================
CREATE TABLE team_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_team_messages_team ON team_messages(team_id, created_at DESC);
CREATE INDEX idx_team_messages_sender ON team_messages(sender_id);
-- ============================================
-- TEAM BULLETIN POSTS
-- ============================================
CREATE TABLE team_bulletins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_team_bulletins_team ON team_bulletins(team_id);
CREATE INDEX idx_team_bulletins_author ON team_bulletins(author_id);
-- ============================================
-- COLLABS TABLE (Friend/Connection List)
-- ============================================
CREATE TABLE collabs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2),
  CHECK (user_id_1 < user_id_2)
);
CREATE INDEX idx_collabs_user1 ON collabs(user_id_1);
CREATE INDEX idx_collabs_user2 ON collabs(user_id_2);
CREATE INDEX idx_collabs_status ON collabs(status);
-- ============================================
-- GROUP CHATS TABLE
-- ============================================
CREATE TABLE group_chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_group_chats_owner ON group_chats(owner_id);
-- ============================================
-- GROUP CHAT MEMBERS TABLE
-- ============================================
CREATE TABLE group_chat_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_chat_id, user_id)
);
CREATE INDEX idx_group_chat_members_group ON group_chat_members(group_chat_id);
CREATE INDEX idx_group_chat_members_user ON group_chat_members(user_id);
-- ============================================
-- GROUP MESSAGES TABLE
-- ============================================
CREATE TABLE group_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_group_messages_group ON group_messages(group_chat_id, created_at DESC);
CREATE INDEX idx_group_messages_sender ON group_messages(sender_id);
-- ============================================
-- PROFILE PHOTOS TABLE
-- ============================================
CREATE TABLE profile_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_profile_photos_user ON profile_photos(user_id);
CREATE INDEX idx_profile_photos_primary ON profile_photos(user_id) WHERE is_primary = TRUE;
-- ============================================
-- PROFILE UPDATES TABLE (Daily Updates/Feed)
-- ============================================
CREATE TABLE profile_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'collab_only', 'private')) DEFAULT 'public',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_profile_updates_user ON profile_updates(user_id, created_at DESC);
CREATE INDEX idx_profile_updates_created ON profile_updates(created_at DESC);
-- ============================================
-- PROFILE UPDATE LIKES TABLE
-- ============================================
CREATE TABLE profile_update_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_update_id UUID REFERENCES profile_updates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_update_id, user_id)
);
CREATE INDEX idx_profile_update_likes_update ON profile_update_likes(profile_update_id);
CREATE INDEX idx_profile_update_likes_user ON profile_update_likes(user_id);
-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collabs_updated_at
  BEFORE UPDATE ON collabs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_chats_updated_at
  BEFORE UPDATE ON group_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_group_messages_updated_at
  BEFORE UPDATE ON group_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_updates_updated_at
  BEFORE UPDATE ON profile_updates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
-- Function to update user reputation
CREATE OR REPLACE FUNCTION update_user_reputation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET reputation = (
    SELECT COUNT(*) * 10 FROM endorsements WHERE to_user_id = NEW.to_user_id
  ) + (
    SELECT COALESCE(SUM(upvotes - downvotes), 0) FROM posts WHERE author_id = NEW.to_user_id
  )
  WHERE id = NEW.to_user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_reputation_on_endorsement
  AFTER INSERT ON endorsements
  FOR EACH ROW
  EXECUTE FUNCTION update_user_reputation();
-- Function to update post vote counts
CREATE OR REPLACE FUNCTION update_post_votes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE posts SET downvotes = downvotes + 1 WHERE id = NEW.post_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE posts SET upvotes = upvotes - 1 WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET downvotes = downvotes - 1 WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE posts SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.post_id;
    ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE posts SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_post_vote_counts
  AFTER INSERT OR UPDATE OR DELETE ON post_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_votes();
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
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_profile_update_like_counts
  AFTER INSERT OR DELETE ON profile_update_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_update_likes();
-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE collabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_update_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- Users: Anyone can read, users can update their own
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING ((SELECT auth.uid())::text = id::text);
-- Projects: Anyone can read, owners can update
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK ((SELECT auth.uid())::text = owner_id::text);
CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING ((SELECT auth.uid())::text = owner_id::text);
-- Teams: Public teams viewable by all, private by members only
CREATE POLICY "Public teams are viewable by everyone" ON teams FOR SELECT USING (NOT is_private OR owner_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can create teams" ON teams FOR INSERT WITH CHECK ((SELECT auth.uid())::text = owner_id::text);
-- Messages: Only sender/receiver can read
CREATE POLICY "Users can view own messages" ON messages FOR SELECT 
  USING (sender_id::text = (SELECT auth.uid())::text OR receiver_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can send messages" ON messages FOR INSERT 
  WITH CHECK (sender_id::text = (SELECT auth.uid())::text);
-- Connections: Sender/receiver can view
CREATE POLICY "Users can view own connections" ON connections FOR SELECT 
  USING (sender_id::text = (SELECT auth.uid())::text OR receiver_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can create connections" ON connections FOR INSERT 
  WITH CHECK (sender_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can update own connections" ON connections FOR UPDATE 
  USING (receiver_id::text = (SELECT auth.uid())::text);
-- Posts: Anyone can read, authors can update
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK ((SELECT auth.uid())::text = author_id::text);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING ((SELECT auth.uid())::text = author_id::text);
-- Comments: Anyone can read, authors can update/delete
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK ((SELECT auth.uid())::text = author_id::text);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING ((SELECT auth.uid())::text = author_id::text);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING ((SELECT auth.uid())::text = author_id::text);
-- Post Votes: Users can see votes, manage their own
CREATE POLICY "Post votes are viewable by everyone" ON post_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on posts" ON post_votes FOR INSERT WITH CHECK ((SELECT auth.uid())::text = user_id::text);
CREATE POLICY "Users can update own votes" ON post_votes FOR UPDATE USING ((SELECT auth.uid())::text = user_id::text);
CREATE POLICY "Users can delete own votes" ON post_votes FOR DELETE USING ((SELECT auth.uid())::text = user_id::text);
-- Endorsements: Anyone can view, users can create endorsements
CREATE POLICY "Endorsements are viewable by everyone" ON endorsements FOR SELECT USING (true);
CREATE POLICY "Users can give endorsements" ON endorsements FOR INSERT WITH CHECK ((SELECT auth.uid())::text = from_user_id::text);
CREATE POLICY "Users can remove endorsements" ON endorsements FOR DELETE USING ((SELECT auth.uid())::text = from_user_id::text);
-- Team Members: Team members can view, admins can manage
CREATE POLICY "Team members are viewable by team members" ON team_members FOR SELECT 
  USING (team_id IN (SELECT team_id FROM team_members tm WHERE tm.user_id::text = (SELECT auth.uid())::text));
CREATE POLICY "Users can join teams" ON team_members FOR INSERT WITH CHECK (user_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Admins can manage team members" ON team_members FOR UPDATE 
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id::text = (SELECT auth.uid())::text AND role = 'admin'));
-- Team Messages: Team members can read, members can send
CREATE POLICY "Team members can view messages" ON team_messages FOR SELECT 
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id::text = (SELECT auth.uid())::text));
CREATE POLICY "Team members can send messages" ON team_messages FOR INSERT 
  WITH CHECK (sender_id::text = (SELECT auth.uid())::text AND team_id IN (SELECT team_id FROM team_members WHERE user_id::text = (SELECT auth.uid())::text));
-- Team Bulletins: Team members can read, admins can write
CREATE POLICY "Team members can view bulletins" ON team_bulletins FOR SELECT 
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id::text = (SELECT auth.uid())::text));
CREATE POLICY "Team admins can create bulletins" ON team_bulletins FOR INSERT 
  WITH CHECK (author_id::text = (SELECT auth.uid())::text AND team_id IN (SELECT team_id FROM team_members WHERE user_id::text = (SELECT auth.uid())::text AND role = 'admin'));
CREATE POLICY "Team admins can update bulletins" ON team_bulletins FOR UPDATE 
  USING (author_id::text = (SELECT auth.uid())::text);
-- Notifications: Users can only see their own
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT 
  USING (user_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE 
  USING (user_id::text = (SELECT auth.uid())::text);

-- Collabs: Users can view their own collabs
-- Drop the existing policy (if present) and recreate it with optimized auth calls
DROP POLICY IF EXISTS "Users can view own collabs" ON public.collabs;

CREATE POLICY "Users can view own collabs"
ON public.collabs
FOR SELECT
TO public
USING (
  (
    (user_id_1)::text = (SELECT auth.uid())::text
  )
  OR
  (
    (user_id_2)::text = (SELECT auth.uid())::text
  )
);

-- Replace INSERT policy "Users can create collab requests"
DROP POLICY IF EXISTS "Users can create collab requests" ON public.collabs;

CREATE POLICY "Users can create collab requests"
ON public.collabs
FOR INSERT
TO public
WITH CHECK (
  (
    (user_id_1)::text = (SELECT auth.uid())::text
  )
  OR
  (
    (user_id_2)::text = (SELECT auth.uid())::text
  )
);

-- Replace UPDATE policy "Users can update own collab status"
DROP POLICY IF EXISTS "Users can update own collab status" ON public.collabs;

CREATE POLICY "Users can update own collab status"
ON public.collabs
FOR UPDATE
TO public
USING (
  (user_id_2)::text = (SELECT auth.uid())::text
);
-- Group Chats: Members can view and message
CREATE POLICY "Group members can view chats" ON group_chats FOR SELECT 
  USING (id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id::text = (SELECT auth.uid())::text));
CREATE POLICY "Users can create group chats" ON group_chats FOR INSERT 
  WITH CHECK (owner_id::text = (SELECT auth.uid())::text);
-- Group Chat Members
CREATE POLICY "Users can view group members" ON group_chat_members FOR SELECT 
  USING (group_chat_id IN (SELECT id FROM group_chats));
CREATE POLICY "Admins can manage group members" ON group_chat_members FOR INSERT 
  WITH CHECK (user_id::text = (SELECT auth.uid())::text);
-- Group Messages: Members can read and send
CREATE POLICY "Group members can view messages" ON group_messages FOR SELECT 
  USING (group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id::text = (SELECT auth.uid())::text));
CREATE POLICY "Group members can send messages" ON group_messages FOR INSERT 
  WITH CHECK (sender_id::text = (SELECT auth.uid())::text AND group_chat_id IN (SELECT group_chat_id FROM group_chat_members WHERE user_id::text = (SELECT auth.uid())::text));
-- Profile Photos: Public viewing, users can manage their own
CREATE POLICY "Profile photos are viewable by everyone" ON profile_photos FOR SELECT USING (true);
CREATE POLICY "Users can upload their own photos" ON profile_photos FOR INSERT 
  WITH CHECK (user_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can delete their own photos" ON profile_photos FOR DELETE 
  USING (user_id::text = (SELECT auth.uid())::text);
-- Profile Updates: Based on visibility settings
CREATE POLICY "Profile updates are viewable based on visibility" ON profile_updates FOR SELECT 
  USING (
    visibility = 'public' OR 
    user_id::text = (SELECT auth.uid())::text OR 
    (visibility = 'collab_only' AND user_id IN (
      SELECT CASE WHEN user_id_1 = (SELECT auth.uid())::uuid THEN user_id_2 ELSE user_id_1 END 
      FROM collabs WHERE status = 'accepted'
    ))
  );
CREATE POLICY "Users can create profile updates" ON profile_updates FOR INSERT 
  WITH CHECK (user_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can update own updates" ON profile_updates FOR UPDATE 
  USING (user_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can delete own updates" ON profile_updates FOR DELETE 
  USING (user_id::text = (SELECT auth.uid())::text);
-- Profile Update Likes
CREATE POLICY "Users can view update likes" ON profile_update_likes FOR SELECT USING (true);
CREATE POLICY "Users can like updates" ON profile_update_likes FOR INSERT 
  WITH CHECK (user_id::text = (SELECT auth.uid())::text);
CREATE POLICY "Users can unlike updates" ON profile_update_likes FOR DELETE 
  USING (user_id::text = (SELECT auth.uid())::text);