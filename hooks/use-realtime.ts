'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeMessagesProps {
  userId: string
  onNewMessage?: (message: any) => void
}

/**
 * Hook for subscribing to real-time messages
 */
export function useRealtimeMessages({ userId, onNewMessage }: UseRealtimeMessagesProps) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!userId) return

    // Subscribe to messages where user is sender or receiver
    const messagesChannel = supabase
      .channel(`messages:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New message received:', payload)
          if (onNewMessage) {
            onNewMessage(payload.new)
          }
        }
      )
      .subscribe()

    setChannel(messagesChannel)

    return () => {
      messagesChannel.unsubscribe()
    }
  }, [userId, onNewMessage])

  return { channel }
}

interface UseRealtimeNotificationsProps {
  userId: string
  onNewNotification?: (notification: any) => void
}

/**
 * Hook for subscribing to real-time notifications
 */
export function useRealtimeNotifications({ userId, onNewNotification }: UseRealtimeNotificationsProps) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!userId) return

    const notificationsChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification received:', payload)
          if (onNewNotification) {
            onNewNotification(payload.new)
          }
        }
      )
      .subscribe()

    setChannel(notificationsChannel)

    return () => {
      notificationsChannel.unsubscribe()
    }
  }, [userId, onNewNotification])

  return { channel }
}

interface UseRealtimeConnectionsProps {
  userId: string
  onConnectionUpdate?: (connection: any) => void
}

/**
 * Hook for subscribing to real-time connection requests
 */
export function useRealtimeConnections({ userId, onConnectionUpdate }: UseRealtimeConnectionsProps) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!userId) return

    const connectionsChannel = supabase
      .channel(`connections:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Connection update:', payload)
          if (onConnectionUpdate) {
            onConnectionUpdate(payload.new || payload.old)
          }
        }
      )
      .subscribe()

    setChannel(connectionsChannel)

    return () => {
      connectionsChannel.unsubscribe()
    }
  }, [userId, onConnectionUpdate])

  return { channel }
}

interface UseRealtimePostsProps {
  onNewPost?: (post: any) => void
  onPostUpdate?: (post: any) => void
}

/**
 * Hook for subscribing to real-time feed posts
 */
export function useRealtimePosts({ onNewPost, onPostUpdate }: UseRealtimePostsProps) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const postsChannel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          console.log('New post:', payload)
          if (onNewPost) {
            onNewPost(payload.new)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          console.log('Post updated:', payload)
          if (onPostUpdate) {
            onPostUpdate(payload.new)
          }
        }
      )
      .subscribe()

    setChannel(postsChannel)

    return () => {
      postsChannel.unsubscribe()
    }
  }, [onNewPost, onPostUpdate])

  return { channel }
}

/**
 * Hook for subscribing to presence (online users)
 */
export function useRealtimePresence(roomName: string, userId: string, username: string) {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!userId || !roomName) return

    const presenceChannel = supabase.channel(roomName, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState()
        const users = Object.values(state).flat()
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences)
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            username: username,
            online_at: new Date().toISOString(),
          })
        }
      })

    setChannel(presenceChannel)

    return () => {
      presenceChannel.unsubscribe()
    }
  }, [roomName, userId, username])

  return { onlineUsers, channel }
}
