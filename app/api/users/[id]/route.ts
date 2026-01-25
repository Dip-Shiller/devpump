import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await db.getUserById(id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get endorsements
    const endorsements = await db.getEndorsementsForUser(id)
    
    // Get projects
    const projects = await db.getProjectsByUser(id)

    return NextResponse.json({ 
      user,
      endorsements,
      projects
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const user = await db.updateUser(id, {
      title: body.title,
      bio: body.bio,
      location: body.location,
      avatar: body.avatar,
      coverImage: body.coverImage,
      skills: body.skills,
      isAvailable: body.isAvailable,
      socialLinks: body.socialLinks
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
