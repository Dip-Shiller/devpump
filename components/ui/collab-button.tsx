'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/supabase'
import { useCollabs } from '@/hooks/use-api'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface CollabButtonProps {
  userId: string
  targetUserId: string
  className?: string
  onSuccess?: () => void
}

export function CollabButton({ userId, targetUserId, className, onSuccess }: CollabButtonProps) {
  const { createCollab, acceptCollab, getCollabs, isLoading } = useCollabs()
  const [status, setStatus] = useState<'none' | 'pending' | 'accepted' | 'requested'>('none')

  useEffect(() => {
    const checkCollabStatus = async () => {
      const result = await getCollabs(userId)
      const collab = result?.collabs?.find((c: any) => 
        (c.user_id_1 === targetUserId || c.user_id_2 === targetUserId)
      )
      if (collab?.status === 'accepted') {
        setStatus('accepted')
      } else if (collab?.status === 'pending') {
        setStatus(collab.user_id_1 === userId ? 'requested' : 'pending')
      }
    }
    checkCollabStatus()
  }, [userId, targetUserId, getCollabs])

  const handleClick = async () => {
    if (status === 'none') {
      await createCollab(userId, targetUserId)
      setStatus('requested')
      onSuccess?.()
    } else if (status === 'pending') {
      // Find and accept the collab
      const result = await getCollabs(userId)
      const collab = result?.collabs?.find((c: any) => 
        c.user_id_1 === targetUserId && c.status === 'pending'
      )
      if (collab) {
        await acceptCollab(collab.id)
        setStatus('accepted')
        onSuccess?.()
      }
    }
  }

  const getButtonText = () => {
    switch (status) {
      case 'accepted':
        return 'Collab ✓'
      case 'requested':
        return 'Request Sent'
      case 'pending':
        return 'Accept Collab'
      default:
        return 'Add Collab'
    }
  }

  const getButtonVariant = () => {
    switch (status) {
      case 'accepted':
        return 'default'
      case 'pending':
        return 'gradient'
      default:
        return 'outline'
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || status === 'accepted'}
      variant={getButtonVariant()}
      className={className}
    >
      {getButtonText()}
    </Button>
  )
}
