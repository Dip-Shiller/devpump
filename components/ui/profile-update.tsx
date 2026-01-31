'use client'

import { useState, useEffect } from 'react'
import { useProfileUpdates, useProfilePhotos } from '@/hooks/use-api'
import { Card } from './card'
import { Button } from './button'
import { Textarea } from './textarea'
import { cn } from '@/lib/utils'
import { Heart } from 'lucide-react'

interface ProfileUpdateProps {
  update: any
  currentUserId?: string
  onDelete?: () => void
  showImages?: boolean
}

export function ProfileUpdateCard({ update, currentUserId, onDelete, showImages = true }: ProfileUpdateProps) {
  const { likeProfileUpdate, unlikeProfileUpdate } = useProfileUpdates()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(update.likes_count || 0)

  const handleLike = async () => {
    if (!currentUserId) return
    
    if (liked) {
      await unlikeProfileUpdate(update.id, currentUserId)
      setLiked(false)
      setLikesCount((c: number) => c - 1)
    } else {
      await likeProfileUpdate(update.id, currentUserId)
      setLiked(true)
      setLikesCount((c: number) => c + 1)
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <p className="text-sm text-gray-500">{new Date(update.created_at).toLocaleDateString()}</p>
        </div>
        {currentUserId === update.user_id && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>

      <p className="text-white mb-3">{update.content}</p>

      {showImages && update.image_url && (
        <img src={update.image_url} alt="Update" className="w-full rounded-lg mb-3 max-h-96 object-cover" />
      )}

      <div className="flex items-center gap-2 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn('gap-2', liked && 'text-red-500')}
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
          {likesCount}
        </Button>
      </div>
    </Card>
  )
}

interface ProfileUpdateFormProps {
  userId: string
  onSuccess?: () => void
  visibility?: 'public' | 'collab_only' | 'private'
}

export function ProfileUpdateForm({ userId, onSuccess, visibility = 'public' }: ProfileUpdateFormProps) {
  const { createProfileUpdate, isLoading } = useProfileUpdates()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    await createProfileUpdate(userId, content, imageUrl || undefined, visibility)
    setContent('')
    setImageUrl('')
    onSuccess?.()
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Share a daily update..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-20"
        />
        <input
          type="text"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <Button type="submit" disabled={isLoading || !content.trim()} className="w-full">
          {isLoading ? 'Posting...' : 'Post Update'}
        </Button>
      </form>
    </Card>
  )
}
