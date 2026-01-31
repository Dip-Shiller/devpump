import { NextRequest, NextResponse } from 'next/server'
import { createProfileUpdate, getProfileUpdates, getPublicProfileUpdates, likeProfileUpdate, unlikeProfileUpdate, deleteProfileUpdate } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const feed = searchParams.get('feed') // 'public' for public feed, or userId for personal
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (feed === 'public') {
      const updates = await getPublicProfileUpdates(limit, offset)
      return NextResponse.json({ updates })
    } else if (userId) {
      const updates = await getProfileUpdates(userId)
      return NextResponse.json({ updates })
    }

    return NextResponse.json({ error: 'User ID or feed type required' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching profile updates:', error)
    return NextResponse.json({ error: 'Failed to fetch profile updates' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, userId, content, imageUrl, visibility, updateId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (action === 'create') {
      if (!content) {
        return NextResponse.json({ error: 'Content required' }, { status: 400 })
      }
      const update = await createProfileUpdate(userId, content, imageUrl, visibility || 'public')
      return NextResponse.json({ update, success: true })
    } else if (action === 'like') {
      if (!updateId) {
        return NextResponse.json({ error: 'Update ID required' }, { status: 400 })
      }
      const like = await likeProfileUpdate(updateId, userId)
      return NextResponse.json({ like, success: true })
    } else if (action === 'unlike') {
      if (!updateId) {
        return NextResponse.json({ error: 'Update ID required' }, { status: 400 })
      }
      const success = await unlikeProfileUpdate(updateId, userId)
      return NextResponse.json({ success })
    } else if (action === 'delete') {
      if (!updateId) {
        return NextResponse.json({ error: 'Update ID required' }, { status: 400 })
      }
      const success = await deleteProfileUpdate(updateId)
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing profile update:', error)
    return NextResponse.json({ error: 'Failed to process profile update' }, { status: 500 })
  }
}
