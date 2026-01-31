'use client'

import { Card } from './card'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ProfilePhotoProps {
  photo: any
  isPrimary?: boolean
  isOwn?: boolean
  onSetPrimary?: () => void
  onDelete?: () => void
}

export function ProfilePhotoCard({ photo, isPrimary, isOwn, onSetPrimary, onDelete }: ProfilePhotoProps) {
  return (
    <div className="relative group">
      <img
        src={photo.photo_url}
        alt={photo.alt_text || 'Profile photo'}
        className="w-full aspect-square object-cover rounded-lg"
      />
      {isPrimary && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
          Primary
        </div>
      )}
      {isOwn && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onSetPrimary}
            disabled={isPrimary}
          >
            Set Primary
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  )
}

interface ProfilePhotoGridProps {
  photos: any[]
  isOwn?: boolean
  onSetPrimary?: (photoId: string) => void
  onDelete?: (photoId: string) => void
}

export function ProfilePhotoGrid({ photos, isOwn, onSetPrimary, onDelete }: ProfilePhotoGridProps) {
  if (photos.length === 0) {
    return <p className="text-gray-500 text-center py-8">No photos yet</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <ProfilePhotoCard
          key={photo.id}
          photo={photo}
          isPrimary={photo.is_primary}
          isOwn={isOwn}
          onSetPrimary={() => onSetPrimary?.(photo.id)}
          onDelete={() => onDelete?.(photo.id)}
        />
      ))}
    </div>
  )
}
