import { NextRequest, NextResponse } from 'next/server'
import { searchProjects, createProject, getProjectById, updateProject } from '@/lib/db'

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const skill = searchParams.get('skill') || undefined
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const projects = await searchProjects({
      status,
      skill,
      featured: featured || undefined,
      limit
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.owner_id) {
      return NextResponse.json(
        { error: 'Title and owner are required' },
        { status: 400 }
      )
    }

    const project = await createProject({
      title: body.title,
      description: body.description || '',
      owner_id: body.owner_id,
      team_id: body.team_id,
      status: body.status || 'planning',
      skills: body.skills || [],
      timeline: body.timeline || 'TBD'
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
