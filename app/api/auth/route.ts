import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// POST /api/auth - Register or login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, email, password, walletAddress } = body

    if (action === 'register') {
      // Check if username exists
      const existingUser = await db.getUserByUsername(username)
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }

      // Create user
      const user = await db.createUser({
        username,
        email,
        walletAddress,
        skills: [],
        reputation: 0,
        isVerified: false,
        isAvailable: true,
        socialLinks: {}
      })

      return NextResponse.json({ user, success: true })
    }

    if (action === 'login-wallet') {
      let user = await db.getUserByWallet(walletAddress)
      
      if (!user) {
        // Auto-create account for new wallet
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

      return NextResponse.json({ user, success: true })
    }

    if (action === 'login-email') {
      // Find user by email
      const users = await db.getAllUsers()
      const user = users.find(u => u.email === email)
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // In production, verify password hash here
      return NextResponse.json({ user, success: true })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
