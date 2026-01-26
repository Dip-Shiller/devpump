// Database Types and Mock Data Store
// In production, replace with actual database (PostgreSQL, MongoDB, etc.)

export interface User {
  id: string
  walletAddress?: string
  username: string
  email?: string
  title?: string
  bio?: string
  location?: string
  avatar?: string
  coverImage?: string
  skills: string[]
  reputation: number
  isVerified: boolean
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
  socialLinks: {
    github?: string
    twitter?: string
    website?: string
  }
}

export interface Project {
  id: string
  title: string
  description: string
  ownerId: string
  teamId?: string
  status: 'planning' | 'active' | 'completed' | 'paused'
  skills: string[]
  timeline: string
  progress: number
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  description: string
  image?: string
  ownerId: string
  members: TeamMember[]
  isPrivate: boolean
  createdAt: Date
}

export interface TeamMember {
  userId: string
  role: 'admin' | 'moderator' | 'member'
  joinedAt: Date
  status: 'online' | 'away' | 'offline'
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  createdAt: Date
  readAt?: Date
}

export interface ConnectionRequest {
  id: string
  senderId: string
  receiverId: string
  message?: string
  status: 'pending' | 'accepted' | 'declined'
  createdAt: Date
}

export interface Post {
  id: string
  authorId: string
  title: string
  content: string
  type: 'question' | 'news' | 'discussion' | 'tutorial' | 'hiring'
  tags: string[]
  upvotes: number
  downvotes: number
  createdAt: Date
  updatedAt: Date
  isPinned: boolean
}

export interface Endorsement {
  id: string
  fromUserId: string
  toUserId: string
  skill: string
  message?: string
  createdAt: Date
}

// In-memory store for development
// Replace with actual database in production
class DatabaseStore {
  private users: Map<string, User> = new Map()
  private projects: Map<string, Project> = new Map()
  private teams: Map<string, Team> = new Map()
  private messages: Map<string, Message> = new Map()
  private connectionRequests: Map<string, ConnectionRequest> = new Map()
  private posts: Map<string, Post> = new Map()
  private endorsements: Map<string, Endorsement> = new Map()

  // User methods
  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = crypto.randomUUID()
    const now = new Date()
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now
    }
    this.users.set(id, newUser)
    return newUser
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.walletAddress === walletAddress) return user
    }
    return null
  }

  async getUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === username.toLowerCase()) return user
    }
    return null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id)
    if (!user) return null
    const updatedUser = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updatedUser)
    return updatedUser
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }

  // Project methods
  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = crypto.randomUUID()
    const now = new Date()
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now
    }
    this.projects.set(id, newProject)
    return newProject
  }

  async getProjectById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.ownerId === userId)
  }

  // Team methods
  async createTeam(team: Omit<Team, 'id' | 'createdAt'>): Promise<Team> {
    const id = crypto.randomUUID()
    const newTeam: Team = {
      ...team,
      id,
      createdAt: new Date()
    }
    this.teams.set(id, newTeam)
    return newTeam
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.teams.get(id) || null
  }

  async getTeamsByUser(userId: string): Promise<Team[]> {
    return Array.from(this.teams.values()).filter(
      t => t.ownerId === userId || t.members.some(m => m.userId === userId)
    )
  }

  // Message methods
  async createMessage(message: Omit<Message, 'id' | 'createdAt'>): Promise<Message> {
    const id = crypto.randomUUID()
    const newMessage: Message = {
      ...message,
      id,
      createdAt: new Date()
    }
    this.messages.set(id, newMessage)
    return newMessage
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => 
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  }

  async getConversations(userId: string): Promise<{ partnerId: string; lastMessage: Message }[]> {
    const messages = Array.from(this.messages.values())
      .filter(m => m.senderId === userId || m.receiverId === userId)
    
    const partnerMap = new Map<string, Message>()
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId
      const existing = partnerMap.get(partnerId)
      if (!existing || msg.createdAt > existing.createdAt) {
        partnerMap.set(partnerId, msg)
      }
    }

    return Array.from(partnerMap.entries()).map(([partnerId, lastMessage]) => ({
      partnerId,
      lastMessage
    }))
  }

  // Connection request methods
  async createConnectionRequest(request: Omit<ConnectionRequest, 'id' | 'createdAt' | 'status'>): Promise<ConnectionRequest> {
    const id = crypto.randomUUID()
    const newRequest: ConnectionRequest = {
      ...request,
      id,
      status: 'pending',
      createdAt: new Date()
    }
    this.connectionRequests.set(id, newRequest)
    return newRequest
  }

  async getConnectionRequests(userId: string): Promise<ConnectionRequest[]> {
    return Array.from(this.connectionRequests.values())
      .filter(r => r.receiverId === userId && r.status === 'pending')
  }

  async getSentConnectionRequests(userId: string): Promise<ConnectionRequest[]> {
    return Array.from(this.connectionRequests.values())
      .filter(r => r.senderId === userId)
  }

  async updateConnectionRequest(id: string, status: 'accepted' | 'declined'): Promise<ConnectionRequest | null> {
    const request = this.connectionRequests.get(id)
    if (!request) return null
    request.status = status
    this.connectionRequests.set(id, request)
    return request
  }

  async areUsersConnected(userId1: string, userId2: string): Promise<boolean> {
    for (const request of this.connectionRequests.values()) {
      if (
        request.status === 'accepted' &&
        ((request.senderId === userId1 && request.receiverId === userId2) ||
         (request.senderId === userId2 && request.receiverId === userId1))
      ) {
        return true
      }
    }
    return false
  }

  // Post methods
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'>): Promise<Post> {
    const id = crypto.randomUUID()
    const now = new Date()
    const newPost: Post = {
      ...post,
      id,
      upvotes: 0,
      downvotes: 0,
      createdAt: now,
      updatedAt: now
    }
    this.posts.set(id, newPost)
    return newPost
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async getPostsByType(type: Post['type']): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(p => p.type === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Endorsement methods
  async createEndorsement(endorsement: Omit<Endorsement, 'id' | 'createdAt'>): Promise<Endorsement> {
    const id = crypto.randomUUID()
    const newEndorsement: Endorsement = {
      ...endorsement,
      id,
      createdAt: new Date()
    }
    this.endorsements.set(id, newEndorsement)
    return newEndorsement
  }

  async getEndorsementsForUser(userId: string): Promise<Endorsement[]> {
    return Array.from(this.endorsements.values())
      .filter(e => e.toUserId === userId)
  }
}

export const db = new DatabaseStore()
