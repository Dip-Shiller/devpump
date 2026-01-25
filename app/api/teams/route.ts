import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/teams - Get all teams or user's teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let teams
    if (userId) {
      teams = await db.getTeamsByUser(userId)
    } else {
      // Get all public teams
      const allTeams = await db.getTeamsByUser('')
      teams = allTeams.filter(t => !t.isPrivate)
    }

    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.ownerId) {
      return NextResponse.json(
        { error: 'Name and owner are required' },
        { status: 400 }
      )
    }

    const team = await db.createTeam({
      name: body.name,
      description: body.description || '',
      image: body.image,
      ownerId: body.ownerId,
      isPrivate: body.isPrivate || false,
      members: [{
        userId: body.ownerId,
        role: 'admin',
        joinedAt: new Date(),
        status: 'online'
      }]
    })

    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
