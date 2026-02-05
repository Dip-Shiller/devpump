import { NextRequest, NextResponse } from 'next/server'
import { searchPosts, createPost, votePost } from '@/lib/db'

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || undefined
    const tag = searchParams.get('tag') || undefined
    const authorId = searchParams.get('authorId') || undefined
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const posts = await searchPosts({
      type,
      tag,
      author_id: authorId,
      limit,
      offset
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.author_id || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Author, title, and content are required' },
        { status: 400 }
      )
    }

    const post = await createPost({
      author_id: body.author_id,
      title: body.title,
      content: body.content,
      type: body.type || 'discussion',
      tags: body.tags || [],
      image_url: body.image_url
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/posts - Vote on a post
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.post_id || !body.user_id || !body.vote_type) {
      return NextResponse.json(
        { error: 'Post ID, user ID, and vote type are required' },
        { status: 400 }
      )
    }

    if (!['up', 'down'].includes(body.vote_type)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    const success = await votePost(body.post_id, body.user_id, body.vote_type)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error voting on post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
