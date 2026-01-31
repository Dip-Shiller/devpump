import { createServerClient } from './supabase-server'
import type { 
  User, 
  Project, 
  Connection, 
  Post, 
  Message, 
  Team, 
  TeamMember, 
  Endorsement,
  Collab,
  GroupChat,
  GroupChatMember,
  GroupMessage,
  ProfilePhoto,
  ProfileUpdate,
  ProfileUpdateLike
} from './supabase'

const supabase = createServerClient()

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
export async function searchUsers(params: {
  search?: string
  skill?: string
  available?: boolean
  limit?: number
  offset?: number
}): Promise<User[]> {
  let query = supabase.from('users').select('*')

  if (params.search) {
    const term = `%${params.search}%`
    query = query.or(`username.ilike.${term},display_name.ilike.${term},title.ilike.${term},bio.ilike.${term}`)
  }

  if (params.skill) {
    query = query.contains('skills', [params.skill])
  }

  if (params.available !== undefined) {
    query = query.eq('is_available', params.available)
  }

  query = query.order('created_at', { ascending: false })

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset !== undefined) {
    const limit = params.limit || 20
    query = query.range(params.offset, params.offset + limit - 1)
  }

  const { data, error } = await query
  if (error) return []
  return data || []
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
  title?: string
  name?: string
  description: string
  owner_id: string
  team_id?: string
  status?: 'planning' | 'active' | 'completed' | 'paused'
  skills?: string[]
  timeline?: string
  website?: string
  github_url?: string
  category?: string
}): Promise<Project | null> {
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      title: data.title || data.name,
      description: data.description,
      owner_id: data.owner_id,
      team_id: data.team_id || null,
      status: data.status || 'planning',
      skills: data.skills || [],
      timeline: data.timeline || 'TBD',
      website: data.website || null,
      github_url: data.github_url || null,
      category: data.category || null,
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

// ============================================
// COLLAB OPERATIONS (Friend/Connection System)
// ============================================
export async function createCollab(userId1: string, userId2: string): Promise<Collab | null> {
  // Ensure user_id_1 < user_id_2 for unique constraint
  const [id1, id2] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1]
  
  const { data, error } = await supabase
    .from('collabs')
    .insert({ user_id_1: id1, user_id_2: id2, status: 'pending' })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating collab:', error)
    return null
  }
  return data
}

export async function getCollabs(userId: string): Promise<Collab[]> {
  const { data, error } = await supabase
    .from('collabs')
    .select('*')
    .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
    .eq('status', 'accepted')
  
  if (error) return []
  return data || []
}

export async function getCollabRequests(userId: string): Promise<Collab[]> {
  const { data, error } = await supabase
    .from('collabs')
    .select('*')
    .eq('user_id_2', userId)
    .eq('status', 'pending')
  
  if (error) return []
  return data || []
}

export async function acceptCollab(collabId: string): Promise<Collab | null> {
  const { data, error } = await supabase
    .from('collabs')
    .update({ status: 'accepted' })
    .eq('id', collabId)
    .select()
    .single()
  
  if (error) return null
  return data
}

export async function blockCollab(collabId: string): Promise<Collab | null> {
  const { data, error } = await supabase
    .from('collabs')
    .update({ status: 'blocked' })
    .eq('id', collabId)
    .select()
    .single()
  
  if (error) return null
  return data
}

// ============================================
// GROUP CHAT OPERATIONS
// ============================================
export async function createGroupChat(data: {
  name: string
  description?: string
  owner_id: string
  image_url?: string
  is_private?: boolean
}): Promise<GroupChat | null> {
  const { data: chat, error } = await supabase
    .from('group_chats')
    .insert({
      name: data.name,
      description: data.description || null,
      owner_id: data.owner_id,
      image_url: data.image_url || null,
      is_private: data.is_private || false
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating group chat:', error)
    return null
  }
  return chat
}

export async function getGroupChatsForUser(userId: string): Promise<(GroupChat & { members: GroupChatMember[] })[]> {
  // First, get group IDs for the user
  const { data: memberData } = await supabase
    .from('group_chat_members')
    .select('group_chat_id')
    .eq('user_id', userId)
  
  if (!memberData || memberData.length === 0) return []
  
  const groupIds = memberData.map(m => (m as any).group_chat_id)
  
  // Then fetch the full group chats with members
  const { data, error } = await supabase
    .from('group_chats')
    .select(`
      *,
      members:group_chat_members(*)
    `)
    .in('id', groupIds)
  
  if (error) return []
  return data || []
}

export async function addGroupChatMember(groupChatId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<GroupChatMember | null> {
  const { data, error } = await supabase
    .from('group_chat_members')
    .insert({ group_chat_id: groupChatId, user_id: userId, role })
    .select()
    .single()
  
  if (error) {
    console.error('Error adding group chat member:', error)
    return null
  }
  return data
}

export async function getGroupMessages(groupChatId: string, limit = 50): Promise<GroupMessage[]> {
  const { data, error } = await supabase
    .from('group_messages')
    .select('*')
    .eq('group_chat_id', groupChatId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) return []
  return data?.reverse() || []
}

export async function createGroupMessage(groupChatId: string, senderId: string, content: string): Promise<GroupMessage | null> {
  const { data, error } = await supabase
    .from('group_messages')
    .insert({ group_chat_id: groupChatId, sender_id: senderId, content })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating group message:', error)
    return null
  }
  return data
}

// ============================================
// PROFILE PHOTO OPERATIONS
// ============================================
export async function uploadProfilePhoto(userId: string, photoUrl: string, altText?: string): Promise<ProfilePhoto | null> {
  const { data, error } = await supabase
    .from('profile_photos')
    .insert({ user_id: userId, photo_url: photoUrl, alt_text: altText || null, is_primary: false })
    .select()
    .single()
  
  if (error) {
    console.error('Error uploading profile photo:', error)
    return null
  }
  return data
}

export async function getProfilePhotos(userId: string): Promise<ProfilePhoto[]> {
  const { data, error } = await supabase
    .from('profile_photos')
    .select('*')
    .eq('user_id', userId)
    .order('uploaded_at', { ascending: false })
  
  if (error) return []
  return data || []
}

export async function setPrimaryProfilePhoto(photoId: string, userId: string): Promise<ProfilePhoto | null> {
  // First unset all other primary photos
  await supabase
    .from('profile_photos')
    .update({ is_primary: false })
    .eq('user_id', userId)
  
  // Then set this one as primary
  const { data, error } = await supabase
    .from('profile_photos')
    .update({ is_primary: true })
    .eq('id', photoId)
    .select()
    .single()
  
  if (error) return null
  return data
}

export async function deleteProfilePhoto(photoId: string): Promise<boolean> {
  const { error } = await supabase
    .from('profile_photos')
    .delete()
    .eq('id', photoId)
  
  return !error
}

// ============================================
// PROFILE UPDATE OPERATIONS (Daily Updates/Feed)
// ============================================
export async function createProfileUpdate(userId: string, content: string, imageUrl?: string, visibility: 'public' | 'collab_only' | 'private' = 'public'): Promise<ProfileUpdate | null> {
  const { data, error } = await supabase
    .from('profile_updates')
    .insert({ user_id: userId, content, image_url: imageUrl || null, visibility })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating profile update:', error)
    return null
  }
  return data
}

export async function getProfileUpdates(userId: string): Promise<ProfileUpdate[]> {
  const { data, error } = await supabase
    .from('profile_updates')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) return []
  return data || []
}

export async function getPublicProfileUpdates(limit = 50, offset = 0): Promise<ProfileUpdate[]> {
  const { data, error } = await supabase
    .from('profile_updates')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) return []
  return data || []
}

export async function likeProfileUpdate(profileUpdateId: string, userId: string): Promise<ProfileUpdateLike | null> {
  const { data, error } = await supabase
    .from('profile_update_likes')
    .insert({ profile_update_id: profileUpdateId, user_id: userId })
    .select()
    .single()
  
  if (error) return null
  return data
}

export async function unlikeProfileUpdate(profileUpdateId: string, userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('profile_update_likes')
    .delete()
    .eq('profile_update_id', profileUpdateId)
    .eq('user_id', userId)
  
  return !error
}

export async function deleteProfileUpdate(updateId: string): Promise<boolean> {
  const { error } = await supabase
    .from('profile_updates')
    .delete()
    .eq('id', updateId)
  
  return !error
}


