'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Message, Connection, Post } from '@/lib/supabase'

interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string | null
  link: string | null
  is_read: boolean
  created_at: string
}

interface UserPresence {
  user_id: string
  username: string
  online_at: string
}

interface UseRealtimeMessagesProps {
  userId: string
  onNewMessage?: (message: Message) => void
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
          if (onNewMessage) {
            onNewMessage(payload.new as Message)
          }
        }
      )
      .subscribe()

    setChannel(messagesChannel)

    return () => {
      messagesChannel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return { channel }
}

interface UseRealtimeNotificationsProps {
  userId: string
  onNewNotification?: (notification: Notification) => void
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
          if (onNewNotification) {
            onNewNotification(payload.new as Notification)
          }
        }
      )
      .subscribe()

    setChannel(notificationsChannel)

    return () => {
      notificationsChannel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return { channel }
}

interface UseRealtimeConnectionsProps {
  userId: string
  onConnectionUpdate?: (connection: Connection) => void
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
          if (onConnectionUpdate) {
            const connection = (payload.new || payload.old) as Connection
            onConnectionUpdate(connection)
          }
        }
      )
      .subscribe()

    setChannel(connectionsChannel)

    return () => {
      connectionsChannel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return { channel }
}

interface UseRealtimePostsProps {
  onNewPost?: (post: Post) => void
  onPostUpdate?: (post: Post) => void
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
          if (onNewPost) {
            onNewPost(payload.new as Post)
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
          if (onPostUpdate) {
            onPostUpdate(payload.new as Post)
          }
        }
      )
      .subscribe()

    setChannel(postsChannel)

    return () => {
      postsChannel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { channel }
}

/**
 * Hook for subscribing to presence (online users)
 */
export function useRealtimePresence(roomName: string, userId: string, username: string) {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
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
        const users = Object.values(state)
          .flat()
          .map((u: any) => ({
            user_id: u.user_id,
            username: u.username,
            online_at: u.online_at,
          })) as UserPresence[]
        setOnlineUsers(users)
      })
      .on('presence', { event: 'join' }, () => {
        // User joined - state will be updated via sync event
      })
      .on('presence', { event: 'leave' }, () => {
        // User left - state will be updated via sync event
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
