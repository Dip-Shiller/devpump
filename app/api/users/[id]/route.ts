import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, getProjectsByUser, getEndorsementsForUser, getEndorsementsBySkill } from '@/lib/db'
// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    // Get additional data
    const [projects, endorsements, skillEndorsements] = await Promise.all([
      getProjectsByUser(id),
      getEndorsementsForUser(id),
      getEndorsementsBySkill(id)
    ])
    // Remove sensitive data
    const { password_hash, ...safeUser } = user
    return NextResponse.json({ 
      user: safeUser,
      projects,
      endorsements,
      skillEndorsements
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
    // Only allow updating certain fields
    const allowedUpdates = {
      title: body.title,
      bio: body.bio,
      location: body.location,
      avatar_url: body.avatar_url,
      cover_image_url: body.cover_image_url,
      skills: body.skills,
      is_available: body.is_available,
      github_url: body.github_url,
      twitter_url: body.twitter_url,
      website_url: body.website_url
    }
    // Remove undefined values
    const updates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, v]) => v !== undefined)
    )
    const user = await updateUser(id, updates)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    const { password_hash, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
