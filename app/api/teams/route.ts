import { NextRequest, NextResponse } from 'next/server'
import { createTeam, getTeamsByUser, getTeamById, getTeamMembers } from '@/lib/db'

// GET /api/teams - Get teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const teamId = searchParams.get('teamId')

    if (teamId) {
      // Get specific team with members
      const team = await getTeamById(teamId)
      if (!team) {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 404 }
        )
      }

      const members = await getTeamMembers(teamId)
      return NextResponse.json({ team, members })
    }

    if (userId) {
      // Get user's teams
      const teams = await getTeamsByUser(userId)
      return NextResponse.json({ teams })
    }

    return NextResponse.json(
      { error: 'userId or teamId required' },
      { status: 400 }
    )
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

    if (!body.name || !body.owner_id) {
      return NextResponse.json(
        { error: 'Name and owner are required' },
        { status: 400 }
      )
    }

    const team = await createTeam({
      name: body.name,
      description: body.description || '',
      owner_id: body.owner_id,
      is_private: body.is_private || false,
      image_url: body.image_url
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Failed to create team' },
        { status: 500 }
      )
    }

    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    console.error('Error creating team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
