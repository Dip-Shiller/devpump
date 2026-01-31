'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileUpdates } from '@/hooks/use-api'
import { useWallet } from '@/providers/wallet-provider'
import { ProfileUpdateForm, ProfileUpdateCard } from '@/components/ui/profile-update'
import { Card } from '@/components/ui/card'

export default function FeedPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useWallet()
  const { getPublicFeed, deleteProfileUpdate, isLoading } = useProfileUpdates()
  const [updates, setUpdates] = useState<any[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!user?.id && !authLoading) {
      router.push('/auth/login')
      return
    }

    loadFeed()
  }, [user?.id, authLoading])

  const loadFeed = async () => {
    const result = await getPublicFeed(50, offset)
    setUpdates(prev => offset === 0 ? result?.updates || [] : [...prev, ...result?.updates || []])
  }

  const handleDelete = async (updateId: string) => {
    await deleteProfileUpdate(updateId)
    setUpdates(prev => prev.filter(u => u.id !== updateId))
  }

  if (authLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user) {
    return <div className="text-center py-12">Please log in to view the feed</div>
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Daily Updates Feed</h1>

      <div className="mb-6">
        <ProfileUpdateForm userId={user.id} onSuccess={loadFeed} />
      </div>

      <div className="space-y-4">
        {updates.length > 0 ? (
          updates.map((update: any) => (
            <ProfileUpdateCard
              key={update.id}
              update={update}
              currentUserId={user.id}
              onDelete={() => handleDelete(update.id)}
            />
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No updates yet. Be the first to share!</p>
          </Card>
        )}
      </div>

      {updates.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setOffset(prev => prev + 50)
            }}
            disabled={isLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
