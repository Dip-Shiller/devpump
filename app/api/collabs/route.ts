import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getCollabs, getCollabRequests, createCollab, acceptCollab, blockCollab } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'accepted' or 'pending'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (type === 'pending') {
      const requests = await getCollabRequests(userId)
      return NextResponse.json({ collabs: requests })
    } else {
      const collabs = await getCollabs(userId)
      return NextResponse.json({ collabs })
    }
  } catch (error) {
    console.error('Error fetching collabs:', error)
    return NextResponse.json({ error: 'Failed to fetch collabs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, userId1, userId2, collabId } = body

    if (!userId1 || !userId2) {
      return NextResponse.json({ error: 'User IDs required' }, { status: 400 })
    }

    let result
    if (action === 'create') {
      result = await createCollab(userId1, userId2)
      return NextResponse.json({ collab: result, success: true })
    } else if (action === 'accept') {
      result = await acceptCollab(collabId)
      return NextResponse.json({ collab: result, success: true })
    } else if (action === 'block') {
      result = await blockCollab(collabId)
      return NextResponse.json({ collab: result, success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing collab:', error)
    return NextResponse.json({ error: 'Failed to process collab' }, { status: 500 })
  }
}
