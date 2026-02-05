import { supabase, createServerClient } from './supabase'
import type { User } from './supabase'

export { User }

// Database operations interface
export const db = {
  // Get user by wallet address
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Error fetching user by wallet:', error)
      return null
    }

    return data
  },

  // Create a new user
  async createUser(userData: {
    walletAddress?: string
    username: string
    email?: string
    skills?: string[]
    reputation?: number
    isVerified?: boolean
    isAvailable?: boolean
    socialLinks?: Record<string, string>
  }): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        wallet_address: userData.walletAddress,
        username: userData.username,
        email: userData.email,
        skills: userData.skills || [],
        reputation: userData.reputation || 0,
        is_verified: userData.isVerified || false,
        is_available: userData.isAvailable || true,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }

    return data
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Error fetching user by username:', error)
      return null
    }

    return data
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      console.error('Error fetching user by ID:', error)
      return null
    }

    return data
  },

  // Get all users
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      console.error('Error fetching all users:', error)
      return []
    }

    return data || []
  },

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  },
}
