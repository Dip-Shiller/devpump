import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

// GET /api/connections - Get connection requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'received' or 'sent'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let requests
    if (type === 'sent') {
      requests = await db.getSentConnectionRequests(userId)
    } else {
      requests = await db.getConnectionRequests(userId)
    }

    // Enrich with user data
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const otherUserId = type === 'sent' ? req.receiverId : req.senderId
        const otherUser = await db.getUserById(otherUserId)
        return {
          ...req,
          user: otherUser
        }
      })
    )

    return NextResponse.json({ requests: enrichedRequests })
  } catch (error) {
    console.error('Error fetching connections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/connections - Send connection request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.senderId || !body.receiverId) {
      return NextResponse.json(
        { error: 'Sender and receiver are required' },
        { status: 400 }
      )
    }

    // Check if already connected
    const connected = await db.areUsersConnected(body.senderId, body.receiverId)
    if (connected) {
      return NextResponse.json(
        { error: 'Already connected' },
        { status: 400 }
      )
    }

    // Check for existing pending request
    const sentRequests = await db.getSentConnectionRequests(body.senderId)
    const existingRequest = sentRequests.find(
      r => r.receiverId === body.receiverId && r.status === 'pending'
    )
    if (existingRequest) {
      return NextResponse.json(
        { error: 'Request already pending' },
        { status: 400 }
      )
    }

    const connectionRequest = await db.createConnectionRequest({
      senderId: body.senderId,
      receiverId: body.receiverId,
      message: body.message
    })

    return NextResponse.json({ request: connectionRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating connection request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/connections - Accept or decline request
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.requestId || !body.action) {
      return NextResponse.json(
        { error: 'Request ID and action are required' },
        { status: 400 }
      )
    }

    if (!['accept', 'decline'].includes(body.action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    const status = body.action === 'accept' ? 'accepted' : 'declined'
    const updatedRequest = await db.updateConnectionRequest(body.requestId, status)

    if (!updatedRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Error updating connection request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
