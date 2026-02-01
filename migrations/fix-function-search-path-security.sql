-- Migration: Fix RLS policies and function search_path security
-- Run this in Supabase SQL Editor to fix security warnings
-- Date: 2026-02-01
-- Status: ✅ APPLIED - All functions and policies successfully created
-- Reference: 
--   - https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
--   - https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

-- ============================================
-- PART 1: Fix function search_path security
-- ============================================

-- Recreate functions with fixed search_path to prevent SQL injection vulnerabilities
-- A mutable search_path allows functions to execute different SQL based on role settings

-- Fix: update_user_reputation()
CREATE OR REPLACE FUNCTION public.update_user_reputation()
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

-- Fix: update_post_votes()
CREATE OR REPLACE FUNCTION public.update_post_votes()
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

-- Fix: update_profile_update_likes()
CREATE OR REPLACE FUNCTION public.update_profile_update_likes()
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

-- ============================================
-- PART 2: Add missing RLS policies
-- ============================================

-- Comments: Anyone can read, authors can update/delete
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid()::text = author_id::text);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid()::text = author_id::text);

-- Endorsements: Anyone can view, users can create endorsements
DROP POLICY IF EXISTS "Endorsements are viewable by everyone" ON public.endorsements;
CREATE POLICY "Endorsements are viewable by everyone" ON public.endorsements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can give endorsements" ON public.endorsements;
CREATE POLICY "Users can give endorsements" ON public.endorsements FOR INSERT WITH CHECK (auth.uid()::text = from_user_id::text);

DROP POLICY IF EXISTS "Users can remove endorsements" ON public.endorsements;
CREATE POLICY "Users can remove endorsements" ON public.endorsements FOR DELETE USING (auth.uid()::text = from_user_id::text);

-- Post Votes: Users can see votes, manage their own
DROP POLICY IF EXISTS "Post votes are viewable by everyone" ON public.post_votes;
CREATE POLICY "Post votes are viewable by everyone" ON public.post_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can vote on posts" ON public.post_votes;
CREATE POLICY "Users can vote on posts" ON public.post_votes FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can update own votes" ON public.post_votes;
CREATE POLICY "Users can update own votes" ON public.post_votes FOR UPDATE USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can delete own votes" ON public.post_votes;
CREATE POLICY "Users can delete own votes" ON public.post_votes FOR DELETE USING (auth.uid()::text = user_id::text);

-- Team Members: Team members can view, admins can manage
DROP POLICY IF EXISTS "Team members are viewable by team members" ON public.team_members;
CREATE POLICY "Team members are viewable by team members" ON public.team_members FOR SELECT 
  USING (team_id IN (SELECT team_id FROM team_members tm WHERE tm.user_id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
CREATE POLICY "Users can join teams" ON public.team_members FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members" ON public.team_members FOR UPDATE 
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id::text = auth.uid()::text AND role = 'admin'));

-- Team Messages: Team members can read, members can send
DROP POLICY IF EXISTS "Team members can view messages" ON public.team_messages;
CREATE POLICY "Team members can view messages" ON public.team_messages FOR SELECT 
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Team members can send messages" ON public.team_messages;
CREATE POLICY "Team members can send messages" ON public.team_messages FOR INSERT 
  WITH CHECK (sender_id::text = auth.uid()::text AND team_id IN (SELECT team_id FROM team_members WHERE user_id::text = auth.uid()::text));

-- Team Bulletins: Team members can read, admins can write
DROP POLICY IF EXISTS "Team members can view bulletins" ON public.team_bulletins;
CREATE POLICY "Team members can view bulletins" ON public.team_bulletins FOR SELECT 
  USING (team_id IN (SELECT team_id FROM team_members WHERE user_id::text = auth.uid()::text));

DROP POLICY IF EXISTS "Team admins can create bulletins" ON public.team_bulletins;
CREATE POLICY "Team admins can create bulletins" ON public.team_bulletins FOR INSERT 
  WITH CHECK (author_id::text = auth.uid()::text AND team_id IN (SELECT team_id FROM team_members WHERE user_id::text = auth.uid()::text AND role = 'admin'));

DROP POLICY IF EXISTS "Team admins can update bulletins" ON public.team_bulletins;
CREATE POLICY "Team admins can update bulletins" ON public.team_bulletins FOR UPDATE 
  USING (author_id::text = auth.uid()::text);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('comments', 'endorsements', 'post_votes', 'team_members', 'team_messages', 'team_bulletins')
ORDER BY tablename, policyname;
