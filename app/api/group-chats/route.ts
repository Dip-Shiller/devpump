import { NextRequest, NextResponse } from 'next/server'
import { createGroupChat, getGroupChatsForUser, addGroupChatMember, getGroupMessages, createGroupMessage } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const groupChatId = searchParams.get('groupChatId')

    if (!userId && !groupChatId) {
      return NextResponse.json({ error: 'User ID or Group Chat ID required' }, { status: 400 })
    }

    if (groupChatId) {
      const messages = await getGroupMessages(groupChatId)
      return NextResponse.json({ messages })
    } else {
      const chats = await getGroupChatsForUser(userId!)
      return NextResponse.json({ groupChats: chats })
    }
  } catch (error) {
    console.error('Error fetching group chats:', error)
    return NextResponse.json({ error: 'Failed to fetch group chats' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, userId, groupChatId, name, description, imageUrl, memberUserId, content } = body

    if (action === 'create') {
      if (!userId || !name) {
        return NextResponse.json({ error: 'User ID and name required' }, { status: 400 })
      }
      const chat = await createGroupChat({ name, description, owner_id: userId, image_url: imageUrl })
      if (chat) {
        await addGroupChatMember(chat.id, userId, 'admin')
      }
      return NextResponse.json({ groupChat: chat, success: true })
    } else if (action === 'addMember') {
      if (!groupChatId || !memberUserId) {
        return NextResponse.json({ error: 'Group chat ID and member user ID required' }, { status: 400 })
      }
      const member = await addGroupChatMember(groupChatId, memberUserId)
      return NextResponse.json({ member, success: true })
    } else if (action === 'sendMessage') {
      if (!groupChatId || !userId || !content) {
        return NextResponse.json({ error: 'Group chat ID, user ID, and content required' }, { status: 400 })
      }
      const message = await createGroupMessage(groupChatId, userId, content)
      return NextResponse.json({ message, success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing group chat:', error)
    return NextResponse.json({ error: 'Failed to process group chat' }, { status: 500 })
  }
}
