-- Migration: Add missing indexes for foreign keys
-- Run this in Supabase SQL Editor to fix "unindexed foreign keys" linter warnings
-- Date: 2026-02-01
-- Status: ✅ APPLIED - All indexes successfully created

-- Add index for projects.team_id foreign key
CREATE INDEX IF NOT EXISTS idx_projects_team ON public.projects(team_id);

-- Add index for team_messages.sender_id foreign key  
CREATE INDEX IF NOT EXISTS idx_team_messages_sender ON public.team_messages(sender_id);

-- Add index for team_bulletins.author_id foreign key
CREATE INDEX IF NOT EXISTS idx_team_bulletins_author ON public.team_bulletins(author_id);

-- Verify indexes were created
SELECT 
  schemaname, 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE tablename IN ('projects', 'team_messages', 'team_bulletins')
  AND indexname IN ('idx_projects_team', 'idx_team_messages_sender', 'idx_team_bulletins_author')
ORDER BY tablename, indexname;
