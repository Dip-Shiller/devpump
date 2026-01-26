import { db, User } from './database'
import { verifyWalletOwnership, WalletAdapter } from './solana'

// Session storage key
const SESSION_KEY = 'devpump_session'

export interface Session {
  userId: string
  walletAddress?: string
  expiresAt: Date
}

// Generate a random nonce for wallet verification
export function generateNonce(): string {
  return `DevPump Authentication: ${Date.now()}-${Math.random().toString(36).substring(2)}`
}

// Authenticate with wallet
export async function authenticateWithWallet(
  wallet: WalletAdapter
): Promise<{ user: User; session: Session } | null> {
  try {
    if (!wallet.publicKey) return null

    const walletAddress = wallet.publicKey.toBase58()
    const nonce = generateNonce()
    
    // Verify wallet ownership
    const verification = await verifyWalletOwnership(wallet, nonce)
    if (!verification) return null

    // Check if user exists
    let user = await db.getUserByWallet(walletAddress)
    
    if (!user) {
      // Create new user with wallet
      user = await db.createUser({
        walletAddress,
        username: `user_${walletAddress.slice(0, 8)}`,
        skills: [],
        reputation: 0,
        isVerified: false,
        isAvailable: true,
        socialLinks: {}
      })
    }

    // Create session
    const session: Session = {
      userId: user.id,
      walletAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }

    // Store session
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }

    return { user, session }
  } catch (error) {
    console.error('Wallet authentication error:', error)
    return null
  }
}

// Authenticate with email/password
export async function authenticateWithEmail(
  email: string,
  password: string
): Promise<{ user: User; session: Session } | null> {
  try {
    // In production, verify password hash
    // For now, this is a placeholder
    
    // Find or create user
    let user: User | null = null
    const allUsers = await db.getAllUsers()
    user = allUsers.find(u => u.email === email) || null

    if (!user) {
      return null // User not found
    }

    // Create session
    const session: Session = {
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }

    return { user, session }
  } catch (error) {
    console.error('Email authentication error:', error)
    return null
  }
}

// Register new user with email
export async function registerWithEmail(
  username: string,
  email: string,
  password: string
): Promise<{ user: User; session: Session } | null> {
  try {
    // Check if username or email already exists
    const existingUser = await db.getUserByUsername(username)
    if (existingUser) {
      throw new Error('Username already taken')
    }

    // In production, hash the password
    // const passwordHash = await hashPassword(password)

    const user = await db.createUser({
      username,
      email,
      skills: [],
      reputation: 0,
      isVerified: false,
      isAvailable: true,
      socialLinks: {}
    })

    const session: Session = {
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    }

    return { user, session }
  } catch (error) {
    console.error('Registration error:', error)
    return null
  }
}

// Get current session
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null
    
    const session: Session = JSON.parse(stored)
    
    // Check if expired
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    
    return session
  } catch {
    return null
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  const session = getSession()
  if (!session) return null
  
  return db.getUserById(session.userId)
}

// Logout
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}

// Check if authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null
}
