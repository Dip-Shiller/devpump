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
      
      return NextResponse.json({ messages, success: true })
    }

    // Get all conversations
    const conversations = await getConversations(userId)
    return NextResponse.json({ conversations, success: true })
  } catch (error) {
    console.error('Error fetching messages:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    )
  }
}

// POST /api/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.senderId || !body.receiverId || !body.content) {
      return NextResponse.json(
        { error: 'Sender, receiver, and content are required', success: false },
        { status: 400 }
      )
    }

    // Check if users are connected
    const connected = await areUsersConnected(body.senderId, body.receiverId)
    if (!connected) {
      return NextResponse.json(
        { error: 'You must be connected to send messages', success: false },
        { status: 403 }
      )
    }

    const message = await createMessage(
      body.senderId,
      body.receiverId,
      body.content
    )

    if (!message) {
      return NextResponse.json(
        { error: 'Failed to send message', success: false },
        { status: 500 }
      )
    }

    return NextResponse.json({ message, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    )
  }
}
