import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')
    const authorId = searchParams.get('authorId')

    let posts = await db.getAllPosts()

    // Filter by type
    if (type) {
      posts = posts.filter(p => p.type === type)
    }

    // Filter by tag
    if (tag) {
      posts = posts.filter(p => 
        p.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      )
    }

    // Filter by author
    if (authorId) {
      posts = posts.filter(p => p.authorId === authorId)
    }

    // Enrich with author data
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const author = await db.getUserById(post.authorId)
        return {
          ...post,
          author
        }
      })
    )

    return NextResponse.json({ posts: enrichedPosts })
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

    if (!body.authorId || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Author, title, and content are required' },
        { status: 400 }
      )
    }

    const post = await db.createPost({
      authorId: body.authorId,
      title: body.title,
      content: body.content,
      type: body.type || 'discussion',
      tags: body.tags || [],
      isPinned: false
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
