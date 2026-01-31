import { NextRequest, NextResponse } from 'next/server'
import { createConnection, getConnectionsByUserId } from '@/lib/db'

// GET /api/connections - Get connection requests or connections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'received', 'sent', or 'connected'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (type === 'sent') {
      const requests = await getSentConnectionRequests(userId)
      return NextResponse.json({ requests })
    }

    if (type === 'connected') {
      const connections = await getConnections(userId)
      return NextResponse.json({ connections })
    }

    // Default: received requests
    const requests = await getConnectionRequests(userId)
    return NextResponse.json({ requests })
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

    if (!body.sender_id || !body.receiver_id) {
      return NextResponse.json(
        { error: 'Sender and receiver are required' },
        { status: 400 }
      )
    }

    if (body.sender_id === body.receiver_id) {
      return NextResponse.json(
        { error: 'Cannot connect with yourself' },
        { status: 400 }
      )
    }

    // Check if already connected
    const connected = await areUsersConnected(body.sender_id, body.receiver_id)
    if (connected) {
      return NextResponse.json(
        { error: 'Already connected' },
        { status: 400 }
      )
    }

    const connection = await createConnection(
      body.sender_id,
      body.receiver_id,
      body.message
    )

    if (!connection) {
      return NextResponse.json(
        { error: 'Failed to create connection request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ connection }, { status: 201 })
  } catch (error) {
    console.error('Error creating connection:', error)
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

    if (!body.connection_id || !body.action) {
      return NextResponse.json(
        { error: 'Connection ID and action are required' },
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
    const connection = await updateConnectionStatus(body.connection_id, status)

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ connection })
  } catch (error) {
    console.error('Error updating connection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/connections/:userId - Get connections for a specific user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const connections = await getConnectionsByUserId(userId)
    return NextResponse.json({ connections, success: true })
  } catch (error) {
    console.error('Error fetching connections:', error)
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 })
  }
}

// POST /api/connections/:userId - Send connection request to a specific user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.requester_id || !body.addressee_id) {
      return NextResponse.json(
        { error: 'requester_id and addressee_id are required' },
        { status: 400 }
      )
    }

    const connection = await createConnection(body)
    return NextResponse.json({ connection, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating connection:', error)
    return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 })
  }
}
