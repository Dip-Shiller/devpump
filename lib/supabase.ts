'use client'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Server-side client (for API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at'>>
      }
      teams: {
        Row: Team
        Insert: Omit<Team, 'id' | 'created_at'>
        Update: Partial<Omit<Team, 'id' | 'created_at'>>
      }
      team_members: {
        Row: TeamMember
        Insert: Omit<TeamMember, 'id' | 'joined_at'>
        Update: Partial<Omit<TeamMember, 'id' | 'joined_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at'>>
      }
      connections: {
        Row: Connection
        Insert: Omit<Connection, 'id' | 'created_at'>
        Update: Partial<Omit<Connection, 'id' | 'created_at'>>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes'>
        Update: Partial<Omit<Post, 'id' | 'created_at'>>
      }
      endorsements: {
        Row: Endorsement
        Insert: Omit<Endorsement, 'id' | 'created_at'>
        Update: never
      }
      post_votes: {
        Row: PostVote
        Insert: Omit<PostVote, 'id' | 'created_at'>
        Update: Partial<Omit<PostVote, 'id' | 'created_at'>>
      }
    }
  }
}
export interface User {
  id: string
  wallet_address?: string | null
  email?: string | null
  password_hash?: string | null
  username?: string | null
  display_name?: string | null
  title?: string | null
  bio?: string | null
  location?: string | null
  avatar_url?: string | null
  cover_image_url?: string | null
  website?: string | null
  twitter?: string | null
  github?: string | null
  skills?: string[] | null
  reputation?: number | null
  is_verified?: boolean | null
  is_available?: boolean | null
  created_at: string
  updated_at: string
}
export interface Project {
  id: string
  title: string
  description?: string | null
  website?: string | null
  github_url?: string | null
  category?: string | null
  status?: string | null
  owner_id: string
  created_at: string
  updated_at: string
}
export interface Team {
  id: string
  name: string
  description?: string | null
  created_at: string
  updated_at: string
}
export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'admin' | 'moderator' | 'member'
  joined_at: string
}
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}
export interface Connection {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}
export interface Post {
  id: string
  author_id: string
  content: string
  type?: 'question' | 'news' | 'discussion' | 'tutorial' | 'hiring' | null
  project_id?: string | null
  vote_count?: number
  comment_count?: number
  created_at: string
  updated_at: string
  author?: User
}
export interface Endorsement {
  id: string
  from_user_id: string
  to_user_id: string
  skill: string
  message: string | null
  created_at: string
}
export interface PostVote {
  id: string
  post_id: string
  user_id: string
  vote_type: 'up' | 'down'
  created_at: string
}
