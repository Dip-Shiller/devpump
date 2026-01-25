import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/users - Get all users or search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const skill = searchParams.get('skill')
    const available = searchParams.get('available')

    let users = await db.getAllUsers()

    // Filter by search term
    if (search) {
      const term = search.toLowerCase()
      users = users.filter(u => 
        u.username.toLowerCase().includes(term) ||
        u.title?.toLowerCase().includes(term) ||
        u.bio?.toLowerCase().includes(term)
      )
    }

    // Filter by skill
    if (skill) {
      users = users.filter(u => 
        u.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      )
    }

    // Filter by availability
    if (available === 'true') {
      users = users.filter(u => u.isAvailable)
    }

    // Sort by reputation
    users.sort((a, b) => b.reputation - a.reputation)

    return NextResponse.json({ users })
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
    const existing = await db.getUserByUsername(body.username)
    if (existing) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    const user = await db.createUser({
      username: body.username,
      email: body.email,
      walletAddress: body.walletAddress,
      title: body.title,
      bio: body.bio,
      location: body.location,
      skills: body.skills || [],
      reputation: 0,
      isVerified: false,
      isAvailable: true,
      socialLinks: body.socialLinks || {}
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
