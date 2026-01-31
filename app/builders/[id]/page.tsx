'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Globe, Twitter, Github, MessageSquare } from 'lucide-react'
import { useWallet } from '@/providers/wallet-provider'
import type { User } from '@/lib/supabase'

export default function BuilderDetailPage() {
  const params = useParams()
  const { user: currentUser } = useWallet()
  const [builder, setBuilder] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchBuilder(params.id as string)
    }
  }, [params.id])

  const fetchBuilder = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`)
      if (response.ok) {
        const data = await response.json()
        setBuilder(data.user)
      }
    } catch (error) {
      console.error('Error fetching builder:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    if (!currentUser || !builder) return
    try {
      await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requester_id: currentUser.id,
          addressee_id: builder.id,
        }),
      })
    } catch (error) {
      console.error('Error sending connection request:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!builder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Builder not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-0">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={builder.avatar_url || undefined} />
              <AvatarFallback className="bg-purple-600 text-white text-3xl">
                {builder.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl text-white">
                {builder.display_name || builder.username}
              </CardTitle>
              <p className="text-gray-400">@{builder.username}</p>
              <div className="flex gap-2 mt-3">
                {builder.wallet_address && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500">
                    Web3 Verified
                  </Badge>
                )}
              </div>
            </div>
            {currentUser && currentUser.id !== builder.id && (
              <div className="flex gap-2">
                <Button onClick={handleConnect} variant="outline" className="border-purple-500 text-purple-400">
                  Connect
                </Button>
                <Button variant="outline" className="border-gray-600">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {builder.bio && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">About</h3>
              <p className="text-gray-200">{builder.bio}</p>
            </div>
          )}

          <div className="flex gap-4">
            {builder.website && (
              <a
                href={builder.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Globe className="h-4 w-4" />
                Website
              </a>
            )}
            {builder.twitter && (
              <a
                href={`https://twitter.com/${builder.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
            )}
            {builder.github && (
              <a
                href={`https://github.com/${builder.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
