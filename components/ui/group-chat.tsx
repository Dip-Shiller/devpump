'use client'

import { Card } from './card'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { useState, useEffect } from 'react'
import { useGroupChats } from '@/hooks/use-api'

interface GroupChatProps {
  chat: any
  userId: string
}

export function GroupChatCard({ chat, userId }: GroupChatProps) {
  const isAdmin = chat.owner_id === userId
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {chat.image_url && (
        <img src={chat.image_url} alt={chat.name} className="w-full h-32 object-cover rounded-lg mb-3" />
      )}
      <h3 className="font-bold text-lg mb-1">{chat.name}</h3>
      {chat.description && (
        <p className="text-sm text-gray-600 mb-2">{chat.description}</p>
      )}
      <div className="flex gap-2 pt-2">
        <Button variant="gradient" className="flex-1">
          Open Chat
        </Button>
        {isAdmin && (
          <Button variant="outline">
            Settings
          </Button>
        )}
      </div>
    </Card>
  )
}

interface GroupChatListProps {
  userId: string
}

export function GroupChatList({ userId }: GroupChatListProps) {
  const { getGroupChats, isLoading } = useGroupChats()
  const [chats, setChats] = useState<any[]>([])

  useEffect(() => {
    const loadChats = async () => {
      const result = await getGroupChats(userId)
      if (result?.groupChats) {
        setChats(result.groupChats)
      }
    }
    loadChats()
  }, [userId, getGroupChats])

  if (isLoading) {
    return <div className="text-center py-8">Loading group chats...</div>
  }

  if (chats.length === 0) {
    return <div className="text-center py-8 text-gray-500">No group chats yet</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {chats.map((chat: any) => (
        <GroupChatCard key={chat.id} chat={chat} userId={userId} />
      ))}
    </div>
  )
}

interface GroupChatFormProps {
  userId: string
  onSuccess?: () => void
}

export function GroupChatForm({ userId, onSuccess }: GroupChatFormProps) {
  const { createGroupChat, isLoading } = useGroupChats()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    await createGroupChat({ userId, name, description })
    setName('')
    setDescription('')
    onSuccess?.()
  }

  return (
    <Card className="p-4">
      <h3 className="font-bold text-lg mb-3">Create Group Chat</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-20"
        />
        <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
          {isLoading ? 'Creating...' : 'Create Group'}
        </Button>
      </form>
    </Card>
  )
}
