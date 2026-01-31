import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createUser, getUserByWallet, getUserByEmail, getUserByUsername } from '@/lib/db'
import bcrypt from 'bcryptjs'
// POST /api/auth - Register or login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, email, password, walletAddress } = body
    if (action === 'register') {
      // Check if username exists
      const existingUsername = await getUserByUsername(username)
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
      // Check if email exists
      if (email) {
        const existingEmail = await getUserByEmail(email)
        if (existingEmail) {
          return NextResponse.json(
            { error: 'Email already registered' },
            { status: 400 }
          )
        }
      }
      // Hash password if provided
      let passwordHash: string | undefined = undefined
      if (password) {
        passwordHash = await bcrypt.hash(password, 12)
      }
      // Create user
      const user = await createUser({
        username,
        email,
        password_hash: passwordHash,
        wallet_address: walletAddress,
        skills: []
      })
      if (!user) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }
      const cookieStore = await cookies()
      cookieStore.set('session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      // Remove sensitive data
      const { password_hash, ...safeUser } = user
      return NextResponse.json({ user: safeUser, success: true })
    }
    if (action === 'login-wallet') {
      if (!walletAddress) {
        return NextResponse.json(
          { error: 'Wallet address required' },
          { status: 400 }
        )
      }
      let user = await getUserByWallet(walletAddress)
      
      if (!user) {
        // Auto-create account for new wallet
        user = await createUser({
          wallet_address: walletAddress,
          username: `user_${walletAddress.slice(0, 8)}`,
          skills: []
        })
      }
      if (!user) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }
      const cookieStore = await cookies()
      cookieStore.set('session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      const { password_hash, ...safeUser } = user
      return NextResponse.json({ user: safeUser, success: true })
    }
    if (action === 'login-email') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password required' },
          { status: 400 }
        )
      }
      const user = await getUserByEmail(email)
      
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
      if (!user.password_hash) {
        return NextResponse.json(
          { error: 'Please login with wallet' },
          { status: 401 }
        )
      }
      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }
      const cookieStore = await cookies()
      cookieStore.set('session', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      const { password_hash, ...safeUser } = user
      return NextResponse.json({ user: safeUser, success: true })
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
