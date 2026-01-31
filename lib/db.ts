import { supabase } from './supabase'
import type { User, Project, Connection, Post, Message, Team, TeamMember, Endorsement } from './supabase'

// ============================================
// USER OPERATIONS
// ============================================
export async function createUser(data: {
  wallet_address?: string
  username: string
  email?: string
  password_hash?: string
  title?: string
  bio?: string
  skills?: string[]
}): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      wallet_address: data.wallet_address || null,
      username: data.username,
      email: data.email || null,
      password_hash: data.password_hash || null,
      title: data.title || null,
      bio: data.bio || null,
      skills: data.skills || [],
      reputation: 0,
      is_verified: false,
      is_available: true
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating user:', error)
    return null
  }
  return user
}
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}
export async function getUserByWallet(walletAddress: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single()
  if (error) return null
  return data
}
export async function getUserByUsername(username: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('username', username)
    .single()
  if (error) return null
  return data
}
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}
export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// PROJECT OPERATIONS
// ============================================
export async function createProject(data: {
  title: string
  description: string
  owner_id: string
  team_id?: string
  status?: 'planning' | 'active' | 'completed' | 'paused'
  skills?: string[]
  timeline?: string
}): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      title: data.title,
      description: data.description,
      owner_id: data.owner_id,
      team_id: data.team_id || null,
      status: data.status || 'planning',
      skills: data.skills || [],
      timeline: data.timeline || 'TBD',
      progress: 0,
      is_featured: false
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating project:', error)
    return null
  }
  return project
}
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============================================
// TEAM OPERATIONS
// ============================================
export async function createTeam(data: {
  name: string
  description: string
  owner_id: string
  is_private?: boolean
  image_url?: string
}): Promise<Team | null> {
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      name: data.name,
      description: data.description,
      owner_id: data.owner_id,
      is_private: data.is_private || false,
      image_url: data.image_url || null
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating team:', error)
    return null
  }
  // Add owner as admin member
  await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: data.owner_id,
    role: 'admin'
  })
  return team
}
export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}
export async function getTeamsByUser(userId: string): Promise<Team[]> {
  const { data: memberTeams, error: memberError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId)
  if (memberError || !memberTeams) return []
  const teamIds = memberTeams.map((m: { team_id: string }) => m.team_id)
  
  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .in('id', teamIds)
  if (error) return []
  return teams || []
}
export async function getTeamMembers(teamId: string): Promise<(TeamMember & { user: User })[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      user:users(*)
    `)
    .eq('team_id', teamId)
  if (error) return []
  return data || []
}
export async function addTeamMember(teamId: string, userId: string, role: 'admin' | 'moderator' | 'member' = 'member'): Promise<boolean> {
  const { error } = await supabase
    .from('team_members')
    .insert({
      team_id: teamId,
      user_id: userId,
      role
    })
  return !error
}
// ============================================
// CONNECTION OPERATIONS
// ============================================
export async function createConnection(senderId: string, receiverId: string, message?: string): Promise<Connection | null> {
  const { data, error } = await supabase
    .from('connections')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      message: message || null,
      status: 'pending'
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating connection:', error)
    return null
  }
  return data
}
export async function getConnectionRequests(userId: string): Promise<(Connection & { sender: User })[]> {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      sender:users!connections_sender_id_fkey(*)
    `)
    .eq('receiver_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}
export async function getSentConnectionRequests(userId: string): Promise<Connection[]> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}
export async function updateConnectionStatus(connectionId: string, status: 'accepted' | 'declined'): Promise<Connection | null> {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select()
    .single()
  if (error) return null
  return data
}
export async function areUsersConnected(userId1: string, userId2: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('connections')
    .select('id')
    .eq('status', 'accepted')
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .single()
  return !error && !!data
}
export async function getConnections(userId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      sender:users!connections_sender_id_fkey(*),
      receiver:users!connections_receiver_id_fkey(*)
    `)
    .eq('status', 'accepted')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
  if (error || !data) return []
  // Return the other user in each connection
  return data.map((conn: { sender: any; receiver: any }) => {
    if (conn.sender && conn.sender.id === userId) {
      return conn.receiver as User
    }
    return conn.sender as User
  })
}
// ============================================
// MESSAGE OPERATIONS
// ============================================
export async function createMessage(senderId: string, receiverId: string, content: string): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating message:', error)
    return null
  }
  return data
}
export async function getMessagesBetweenUsers(userId1: string, userId2: string, limit = 50): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) return []
  return data || []
}
export async function getConversations(userId: string): Promise<{ partner: User; lastMessage: Message }[]> {
  // Get all messages involving user
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })
  if (error || !messages) return []
  // Group by conversation partner
  const partnerMap = new Map<string, Message>()
  for (const msg of messages) {
    const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
    if (!partnerMap.has(partnerId)) {
      partnerMap.set(partnerId, msg)
    }
  }
  // Get partner user data
  const conversations: { partner: User; lastMessage: Message }[] = []
  for (const [partnerId, lastMessage] of partnerMap) {
    const partner = await getUserById(partnerId)
    if (partner) {
      conversations.push({ partner, lastMessage })
    }
  }
  return conversations
}
export async function markMessagesAsRead(userId: string, partnerId: string): Promise<void> {
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('sender_id', partnerId)
    .eq('receiver_id', userId)
    .is('read_at', null)
}
// ============================================
// POST OPERATIONS
// ============================================
export async function createPost(data: {
  author_id: string
  title: string
  content: string
  type?: 'question' | 'news' | 'discussion' | 'tutorial' | 'hiring'
  tags?: string[]
}): Promise<Post | null> {
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      author_id: data.author_id,
      title: data.title,
      content: data.content,
      type: data.type || 'discussion',
      tags: data.tags || [],
      upvotes: 0,
      downvotes: 0,
      is_pinned: false
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating post:', error)
    return null
  }
  return post
}
export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}
export async function searchPosts(params: {
  type?: string
  tag?: string
  author_id?: string
  limit?: number
  offset?: number
}): Promise<(Post & { author: User })[]> {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:users(*)
    `)
  if (params.type) {
    query = query.eq('type', params.type)
  }
  if (params.tag) {
    query = query.contains('tags', [params.tag])
  }
  if (params.author_id) {
    query = query.eq('author_id', params.author_id)
  }
  query = query.order('created_at', { ascending: false })
  if (params.limit) {
    query = query.limit(params.limit)
  }
  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }
  const { data, error } = await query
  if (error) return []
  return data || []
}
export async function votePost(postId: string, userId: string, voteType: 'up' | 'down'): Promise<boolean> {
  // Check for existing vote
  const { data: existing } = await supabase
    .from('post_votes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()
  if (existing) {
    if (existing.vote_type === voteType) {
      // Remove vote
      await supabase.from('post_votes').delete().eq('id', existing.id)
    } else {
      // Change vote
      await supabase.from('post_votes').update({ vote_type: voteType }).eq('id', existing.id)
    }
  } else {
    // New vote
    await supabase.from('post_votes').insert({
      post_id: postId,
      user_id: userId,
      vote_type: voteType
    })
  }
  return true
}
// ============================================
// ENDORSEMENT OPERATIONS
// ============================================
export async function createEndorsement(fromUserId: string, toUserId: string, skill: string, message?: string): Promise<Endorsement | null> {
  const { data, error } = await supabase
    .from('endorsements')
    .insert({
      from_user_id: fromUserId,
      to_user_id: toUserId,
      skill,
      message: message || null
    })
    .select()
    .single()
  if (error) {
    console.error('Error creating endorsement:', error)
    return null
  }
  return data
}
export async function getEndorsementsForUser(userId: string): Promise<(Endorsement & { from_user: User })[]> {
  const { data, error } = await supabase
    .from('endorsements')
    .select(`
      *,
      from_user:users!endorsements_from_user_id_fkey(*)
    `)
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}
export async function getEndorsementsBySkill(userId: string): Promise<{ skill: string; count: number }[]> {
  const { data, error } = await supabase
    .from('endorsements')
    .select('skill')
    .eq('to_user_id', userId)
  if (error || !data) return []
  // Count by skill
  const skillCounts = new Map<string, number>()
  for (const e of data) {
    skillCounts.set(e.skill, (skillCounts.get(e.skill) || 0) + 1)
  }
  return Array.from(skillCounts.entries())
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
}
// Posts
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:users(id, username, display_name, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}


