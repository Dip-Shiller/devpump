import { NextRequest, NextResponse } from 'next/server'
import { searchUsers, createUser, getUserByUsername, getAllUsers } from '@/lib/db'
import bcrypt from 'bcryptjs'

// GET /api/users - Get all users or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || undefined
    const skill = searchParams.get('skill') || undefined
    const available = searchParams.get('available')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let users
    if (search || skill || available) {
      users = await searchUsers({
        search,
        skill,
        available: available === 'true' ? true : undefined,
        limit,
        offset
      })
    } else {
      users = await getAllUsers()
    }

    // Remove sensitive data
    const safeUsers = users.map(({ password_hash, ...user }) => user)
    return NextResponse.json({ users: safeUsers, success: true })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }
    // Check if username exists
    const existing = await getUserByUsername(body.username)
    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }
    // Hash password if provided
    let passwordHash: string | undefined = undefined
    if (body.password) {
      passwordHash = await bcrypt.hash(body.password, 12)
    }
    const user = await createUser({
      username: body.username,
      email: body.email,
      wallet_address: body.walletAddress,
      password_hash: passwordHash,
      title: body.title,
      bio: body.bio,
      skills: body.skills || []
    })
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
    const { password_hash, ...safeUser } = user
    return NextResponse.json({ user: safeUser }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
