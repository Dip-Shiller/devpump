import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

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
      // Get messages between two users
      const connected = await db.areUsersConnected(userId, partnerId)
      if (!connected) {
        return NextResponse.json(
          { error: 'Users are not connected' },
          { status: 403 }
        )
      }

      const messages = await db.getMessagesBetweenUsers(userId, partnerId)
      return NextResponse.json({ messages })
    } else {
      // Get all conversations
      const conversations = await db.getConversations(userId)
      
      // Enrich with user data
      const enrichedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const partner = await db.getUserById(conv.partnerId)
          return {
            ...conv,
            partner
          }
        })
      )

      return NextResponse.json({ conversations: enrichedConversations })
    }
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

    if (!body.senderId || !body.receiverId || !body.content) {
      return NextResponse.json(
        { error: 'Sender, receiver, and content are required' },
        { status: 400 }
      )
    }

    // Check if users are connected
    const connected = await db.areUsersConnected(body.senderId, body.receiverId)
    if (!connected) {
      return NextResponse.json(
        { error: 'You must be connected to send messages' },
        { status: 403 }
      )
    }

    const message = await db.createMessage({
      senderId: body.senderId,
      receiverId: body.receiverId,
      content: body.content
    })

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
