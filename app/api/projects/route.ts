import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const skill = searchParams.get('skill')
    const featured = searchParams.get('featured')

    let projects = await db.getAllProjects()

    // Filter by status
    if (status) {
      projects = projects.filter(p => p.status === status)
    }

    // Filter by skill
    if (skill) {
      projects = projects.filter(p => 
        p.skills.some(s => s.toLowerCase() === skill.toLowerCase())
      )
    }

    // Filter featured
    if (featured === 'true') {
      projects = projects.filter(p => p.isFeatured)
    }

    // Sort by created date
    projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

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

    if (!body.title || !body.ownerId) {
      return NextResponse.json(
        { error: 'Title and owner are required' },
        { status: 400 }
      )
    }

    const project = await db.createProject({
      title: body.title,
      description: body.description || '',
      ownerId: body.ownerId,
      teamId: body.teamId,
      status: body.status || 'planning',
      skills: body.skills || [],
      timeline: body.timeline || 'TBD',
      progress: 0,
      isFeatured: false
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
