import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/db'

export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json({ posts, success: true })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.author_id || !body.content) {
      return NextResponse.json(
        { error: 'author_id and content are required' },
        { status: 400 }
      )
    }

    const post = await createPost(body)
    return NextResponse.json({ post, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
