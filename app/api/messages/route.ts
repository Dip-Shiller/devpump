import { NextRequest, NextResponse } from 'next/server'
import { 
  createMessage, 
  getMessagesBetweenUsers, 
  getConversations,
  markMessagesAsRead,
  areUsersConnected
} from '@/lib/db'

// GET /api/messages - Get conversations or messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const partnerId = searchParams.get('partnerId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (partnerId) {
      // Check if users are connected
      const connected = await areUsersConnected(userId, partnerId)
      if (!connected) {
        return NextResponse.json(
          { error: 'Users are not connected' },
          { status: 403 }
        )
      }

      // Get messages between two users
      const messages = await getMessagesBetweenUsers(userId, partnerId)
      
      // Mark messages as read
      await markMessagesAsRead(userId, partnerId)
      
      return NextResponse.json({ messages })
    }

    // Get all conversations
    const conversations = await getConversations(userId)
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.sender_id || !body.receiver_id || !body.content) {
      return NextResponse.json(
        { error: 'Sender, receiver, and content are required' },
        { status: 400 }
      )
    }

    // Check if users are connected
    const connected = await areUsersConnected(body.sender_id, body.receiver_id)
    if (!connected) {
      return NextResponse.json(
        { error: 'You must be connected to send messages' },
        { status: 403 }
      )
    }

    const message = await createMessage(
      body.sender_id,
      body.receiver_id,
      body.content
    )

    if (!message) {
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
