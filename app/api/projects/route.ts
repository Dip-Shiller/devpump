import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects, createProject } from '@/lib/db'

export async function GET() {
  try {
    const projects = await getAllProjects()
    return NextResponse.json({ projects, success: true })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.owner_id) {
      return NextResponse.json(
        { error: 'Name and owner_id are required' },
        { status: 400 }
      )
    }

    const project = await createProject(body)
    return NextResponse.json({ project, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
