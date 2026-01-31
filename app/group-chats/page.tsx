'use client'

import { useRouter } from 'next/navigation'
import { useWallet } from '@/providers/wallet-provider'
import { GroupChatList, GroupChatForm } from '@/components/ui/group-chat'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

export default function GroupChatsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useWallet()
  const [showForm, setShowForm] = useState(false)

  if (authLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user) {
    return <div className="text-center py-12">Please log in to view group chats</div>
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Group Chats</h1>
      </div>

      {showForm && (
        <div className="mb-6">
          <GroupChatForm
            userId={user.id}
            onSuccess={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          {showForm ? 'Cancel' : '+ New Group Chat'}
        </button>
      </div>

      <GroupChatList userId={user.id} />
    </div>
  )
}
