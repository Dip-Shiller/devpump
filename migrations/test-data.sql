-- Test Data for DevPump Database
-- Run this in Supabase SQL Editor to populate test data
-- Date: 2026-02-01
-- Purpose: Test RLS policies, triggers, and functions

-- ============================================
-- CLEANUP: Remove existing test data (optional)
-- ============================================
-- Uncomment to reset test data:
-- DELETE FROM profile_update_likes WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM profile_updates WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM group_messages WHERE sender_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM group_chat_members WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM group_chats WHERE owner_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM team_bulletins WHERE team_id IN (SELECT id FROM teams WHERE name LIKE 'Test%');
-- DELETE FROM team_messages WHERE team_id IN (SELECT id FROM teams WHERE name LIKE 'Test%');
-- DELETE FROM team_members WHERE team_id IN (SELECT id FROM teams WHERE name LIKE 'Test%');
-- DELETE FROM collabs WHERE user_id_1 IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM messages WHERE sender_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM connections WHERE sender_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM post_votes WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM comments WHERE author_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM endorsements WHERE from_user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM posts WHERE author_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM projects WHERE owner_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM teams WHERE owner_id IN (SELECT id FROM users WHERE username LIKE 'test_%');
-- DELETE FROM users WHERE username LIKE 'test_%';

-- ============================================
-- TEST USERS
-- ============================================

-- Personal profile user (developer)
INSERT INTO users (
  username, display_name, email, password_hash, profile_type,
  title, bio, location, skills, is_verified, is_available
) VALUES (
  'test_alice',
  'Alice the Builder',
  'alice@test.devpump.io',
  '$2a$10$testhashedpassword123',  -- Not a real hash
  'personal',
  'Solana Full-Stack Developer',
  'Building the future of DeFi on Solana. Love Rust and TypeScript.',
  'San Francisco, CA',
  ARRAY['Rust', 'Solana', 'TypeScript', 'React', 'Web3'],
  true,
  true
) ON CONFLICT (username) DO NOTHING;

-- Personal profile user (designer)
INSERT INTO users (
  username, display_name, email, password_hash, profile_type,
  title, bio, location, skills
) VALUES (
  'test_bob',
  'Bob Designer',
  'bob@test.devpump.io',
  '$2a$10$testhashedpassword456',
  'personal',
  'UI/UX Designer & Web3 Enthusiast',
  'Creating beautiful interfaces for decentralized apps.',
  'New York, NY',
  ARRAY['Figma', 'UI Design', 'UX', 'Web3']
) ON CONFLICT (username) DO NOTHING;

-- Team profile user
INSERT INTO users (
  username, display_name, email, password_hash, profile_type,
  title, bio, location
) VALUES (
  'test_team_dao',
  'DevPump DAO',
  'dao@test.devpump.io',
  '$2a$10$testhashedpassword789',
  'team',
  'Decentralized Developer Community',
  'A DAO focused on building open-source tools for Solana developers.',
  'Global'
) ON CONFLICT (username) DO NOTHING;

-- Project profile user
INSERT INTO users (
  username, display_name, email, password_hash, profile_type,
  bio
) VALUES (
  'test_project_defi',
  'DeFi Protocol X',
  'defi@test.devpump.io',
  '$2a$10$testhashedpasswordabc',
  'project',
  'Next-generation lending protocol on Solana with 100x capital efficiency.'
) ON CONFLICT (username) DO NOTHING;

-- Community profile user
INSERT INTO users (
  username, display_name, email, password_hash, profile_type,
  bio, location
) VALUES (
  'test_community',
  'Solana SF Builders',
  'community@test.devpump.io',
  '$2a$10$testhashedpassworddef',
  'community',
  'Monthly meetups for Solana developers in the SF Bay Area.',
  'San Francisco, CA'
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- TEAMS
-- ============================================

INSERT INTO teams (
  name, description, owner_id, is_private
) VALUES (
  'Test Solana Core Team',
  'Building core infrastructure for the Solana ecosystem',
  (SELECT id FROM users WHERE username = 'test_alice'),
  false
) ON CONFLICT DO NOTHING;

INSERT INTO teams (
  name, description, owner_id, is_private
) VALUES (
  'Test Private DAO',
  'Exclusive DAO for early contributors',
  (SELECT id FROM users WHERE username = 'test_team_dao'),
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- TEAM MEMBERS
-- ============================================

-- Add Alice as admin of Solana Core Team
INSERT INTO team_members (team_id, user_id, role)
VALUES (
  (SELECT id FROM teams WHERE name = 'Test Solana Core Team'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'admin'
) ON CONFLICT DO NOTHING;

-- Add Bob as member
INSERT INTO team_members (team_id, user_id, role)
VALUES (
  (SELECT id FROM teams WHERE name = 'Test Solana Core Team'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'member'
) ON CONFLICT DO NOTHING;

-- ============================================
-- PROJECTS
-- ============================================

INSERT INTO projects (
  title, description, owner_id, status, skills, progress, is_featured
) VALUES (
  'Test DeFi Lending Protocol',
  'Building a capital-efficient lending protocol with instant liquidations',
  (SELECT id FROM users WHERE username = 'test_alice'),
  'active',
  ARRAY['Solana', 'Rust', 'Anchor', 'DeFi'],
  65,
  true
) ON CONFLICT DO NOTHING;

INSERT INTO projects (
  title, description, owner_id, team_id, status, skills, progress
) VALUES (
  'Test NFT Marketplace',
  'Community-driven NFT marketplace with zero fees',
  (SELECT id FROM users WHERE username = 'test_bob'),
  (SELECT id FROM teams WHERE name = 'Test Solana Core Team'),
  'planning',
  ARRAY['Solana', 'TypeScript', 'React', 'NFT'],
  25
) ON CONFLICT DO NOTHING;

-- ============================================
-- CONNECTIONS
-- ============================================

-- Alice sends connection request to Bob
INSERT INTO connections (sender_id, receiver_id, message, status)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'Hey Bob! Love your design work. Want to collaborate on a project?',
  'accepted'
) ON CONFLICT DO NOTHING;

-- ============================================
-- COLLABS (Friend/Connection List)
-- ============================================

-- Alice and Bob are collabs (user_id_1 < user_id_2 constraint)
INSERT INTO collabs (user_id_1, user_id_2, status)
VALUES (
  LEAST(
    (SELECT id FROM users WHERE username = 'test_alice'),
    (SELECT id FROM users WHERE username = 'test_bob')
  ),
  GREATEST(
    (SELECT id FROM users WHERE username = 'test_alice'),
    (SELECT id FROM users WHERE username = 'test_bob')
  ),
  'accepted'
) ON CONFLICT DO NOTHING;

-- ============================================
-- MESSAGES
-- ============================================

-- Direct messages between Alice and Bob
INSERT INTO messages (sender_id, receiver_id, content)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'Hey Bob! Just pushed the latest design updates to the repo.'
) ON CONFLICT DO NOTHING;

INSERT INTO messages (sender_id, receiver_id, content)
VALUES (
  (SELECT id FROM users WHERE username = 'test_bob'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'Thanks Alice! The new UI looks amazing. Ready for review.'
) ON CONFLICT DO NOTHING;

-- ============================================
-- POSTS
-- ============================================

INSERT INTO posts (author_id, title, content, type, tags, upvotes, downvotes)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  'How to optimize Solana programs for performance',
  'In this tutorial, I''ll share 5 key techniques for optimizing your Solana programs...',
  'tutorial',
  ARRAY['solana', 'rust', 'optimization', 'performance'],
  42,
  3
) ON CONFLICT DO NOTHING;

INSERT INTO posts (author_id, title, content, type, tags, is_pinned)
VALUES (
  (SELECT id FROM users WHERE username = 'test_bob'),
  'Looking for frontend dev for DeFi project',
  'We''re building a new DeFi protocol and need a React/TypeScript expert. Great equity!',
  'hiring',
  ARRAY['hiring', 'react', 'typescript', 'defi'],
  true
) ON CONFLICT DO NOTHING;

INSERT INTO posts (author_id, title, content, type, tags)
VALUES (
  (SELECT id FROM users WHERE username = 'test_team_dao'),
  'What''s your favorite Solana development tool?',
  'Curious to hear what tools everyone is using for Solana development these days.',
  'discussion',
  ARRAY['solana', 'tools', 'discussion']
) ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================

INSERT INTO comments (post_id, author_id, content, upvotes)
VALUES (
  (SELECT id FROM posts WHERE title = 'How to optimize Solana programs for performance'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'Great writeup! The compute unit optimization tip saved me hours.',
  15
) ON CONFLICT DO NOTHING;

-- ============================================
-- POST VOTES
-- ============================================

-- Alice upvotes Bob's post
INSERT INTO post_votes (post_id, user_id, vote_type)
VALUES (
  (SELECT id FROM posts WHERE title = 'Looking for frontend dev for DeFi project'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'up'
) ON CONFLICT DO NOTHING;

-- Bob upvotes Alice's tutorial
INSERT INTO post_votes (post_id, user_id, vote_type)
VALUES (
  (SELECT id FROM posts WHERE title = 'How to optimize Solana programs for performance'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'up'
) ON CONFLICT DO NOTHING;

-- ============================================
-- ENDORSEMENTS
-- ============================================

-- Bob endorses Alice for Rust
INSERT INTO endorsements (from_user_id, to_user_id, skill, message)
VALUES (
  (SELECT id FROM users WHERE username = 'test_bob'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'Rust',
  'Alice is an exceptional Rust developer. Her code is clean and performant.'
) ON CONFLICT DO NOTHING;

-- Alice endorses Bob for UI Design
INSERT INTO endorsements (from_user_id, to_user_id, skill, message)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'UI Design',
  'Bob created the most intuitive Web3 interface I''ve ever used!'
) ON CONFLICT DO NOTHING;

-- ============================================
-- TEAM MESSAGES
-- ============================================

INSERT INTO team_messages (team_id, sender_id, content)
VALUES (
  (SELECT id FROM teams WHERE name = 'Test Solana Core Team'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'Team meeting tomorrow at 2pm PST. Don''t forget!'
) ON CONFLICT DO NOTHING;

INSERT INTO team_messages (team_id, sender_id, content)
VALUES (
  (SELECT id FROM teams WHERE name = 'Test Solana Core Team'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'I''ll be there! Excited to share the new designs.'
) ON CONFLICT DO NOTHING;

-- ============================================
-- TEAM BULLETINS
-- ============================================

INSERT INTO team_bulletins (team_id, author_id, title, content, is_pinned)
VALUES (
  (SELECT id FROM teams WHERE name = 'Test Solana Core Team'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'Q1 2026 Roadmap',
  'Here are our goals for Q1: 1) Launch v2 protocol, 2) Onboard 10 new devs, 3) Ship mobile app',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP CHATS
-- ============================================

INSERT INTO group_chats (name, description, owner_id, is_private)
VALUES (
  'Test Solana Devs',
  'General chat for Solana developers',
  (SELECT id FROM users WHERE username = 'test_alice'),
  false
) ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP CHAT MEMBERS
-- ============================================

INSERT INTO group_chat_members (group_chat_id, user_id, role)
VALUES (
  (SELECT id FROM group_chats WHERE name = 'Test Solana Devs'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'admin'
) ON CONFLICT DO NOTHING;

INSERT INTO group_chat_members (group_chat_id, user_id, role)
VALUES (
  (SELECT id FROM group_chats WHERE name = 'Test Solana Devs'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'member'
) ON CONFLICT DO NOTHING;

-- ============================================
-- GROUP MESSAGES
-- ============================================

INSERT INTO group_messages (group_chat_id, sender_id, content)
VALUES (
  (SELECT id FROM group_chats WHERE name = 'Test Solana Devs'),
  (SELECT id FROM users WHERE username = 'test_alice'),
  'Welcome to the Solana devs group chat! 👋'
) ON CONFLICT DO NOTHING;

INSERT INTO group_messages (group_chat_id, sender_id, content)
VALUES (
  (SELECT id FROM group_chats WHERE name = 'Test Solana Devs'),
  (SELECT id FROM users WHERE username = 'test_bob'),
  'Happy to be here! Can''t wait to collaborate.'
) ON CONFLICT DO NOTHING;

-- ============================================
-- PROFILE PHOTOS
-- ============================================

INSERT INTO profile_photos (user_id, photo_url, alt_text, is_primary)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  'https://i.pravatar.cc/300?u=alice',
  'Alice profile photo',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO profile_photos (user_id, photo_url, alt_text, is_primary)
VALUES (
  (SELECT id FROM users WHERE username = 'test_bob'),
  'https://i.pravatar.cc/300?u=bob',
  'Bob profile photo',
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- PROFILE UPDATES (Daily Updates/Feed)
-- ============================================

INSERT INTO profile_updates (user_id, content, visibility, likes_count)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  'Just shipped the new lending protocol! 🚀 Check it out on mainnet.',
  'public',
  23
) ON CONFLICT DO NOTHING;

INSERT INTO profile_updates (user_id, content, visibility)
VALUES (
  (SELECT id FROM users WHERE username = 'test_bob'),
  'Working on some exciting new designs for the marketplace. Preview coming soon!',
  'collab_only'
) ON CONFLICT DO NOTHING;

-- ============================================
-- PROFILE UPDATE LIKES
-- ============================================

INSERT INTO profile_update_likes (profile_update_id, user_id)
VALUES (
  (SELECT id FROM profile_updates WHERE content LIKE 'Just shipped%'),
  (SELECT id FROM users WHERE username = 'test_bob')
) ON CONFLICT DO NOTHING;

-- ============================================
-- NOTIFICATIONS
-- ============================================

INSERT INTO notifications (user_id, type, title, message, link)
VALUES (
  (SELECT id FROM users WHERE username = 'test_alice'),
  'endorsement',
  'New Endorsement',
  'Bob endorsed you for UI Design',
  '/profile/test_bob'
) ON CONFLICT DO NOTHING;

INSERT INTO notifications (user_id, type, title, message, link)
VALUES (
  (SELECT id FROM users WHERE username = 'test_bob'),
  'comment',
  'New Comment',
  'Alice commented on your post',
  '/feed'
) ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERY
-- ============================================

-- Verify all test data was inserted
SELECT 'Test Users' as category, COUNT(*) as count FROM users WHERE username LIKE 'test_%'
UNION ALL
SELECT 'Test Teams', COUNT(*) FROM teams WHERE name LIKE 'Test%'
UNION ALL
SELECT 'Test Projects', COUNT(*) FROM projects WHERE title LIKE 'Test%'
UNION ALL
SELECT 'Test Posts', COUNT(*) FROM posts WHERE author_id IN (SELECT id FROM users WHERE username LIKE 'test_%')
UNION ALL
SELECT 'Test Messages', COUNT(*) FROM messages WHERE sender_id IN (SELECT id FROM users WHERE username LIKE 'test_%')
UNION ALL
SELECT 'Test Comments', COUNT(*) FROM comments WHERE author_id IN (SELECT id FROM users WHERE username LIKE 'test_%')
UNION ALL
SELECT 'Test Collabs', COUNT(*) FROM collabs WHERE user_id_1 IN (SELECT id FROM users WHERE username LIKE 'test_%')
UNION ALL
SELECT 'Test Group Chats', COUNT(*) FROM group_chats WHERE name LIKE 'Test%';

-- Show sample data
SELECT 
  u.username,
  u.display_name,
  u.profile_type,
  u.reputation,
  COUNT(DISTINCT p.id) as projects_count,
  COUNT(DISTINCT po.id) as posts_count
FROM users u
LEFT JOIN projects p ON p.owner_id = u.id
LEFT JOIN posts po ON po.author_id = u.id
WHERE u.username LIKE 'test_%'
GROUP BY u.id, u.username, u.display_name, u.profile_type, u.reputation;
