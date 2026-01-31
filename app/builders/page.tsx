'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Users } from 'lucide-react'
import type { User } from '@/lib/supabase'

export default function BuildersPage() {
  const [builders, setBuilders] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBuilders()
  }, [])

  const fetchBuilders = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setBuilders(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching builders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBuilders = builders.filter((builder) =>
    builder.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    builder.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    builder.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-white">Builders</h1>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search builders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      {filteredBuilders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No builders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuilders.map((builder) => (
            <Link key={builder.id} href={`/builders/${builder.id}`}>
              <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={builder.avatar_url || undefined} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {builder.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {builder.display_name || builder.username}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">@{builder.username}</p>
                      {builder.bio && (
                        <p className="text-sm text-gray-300 mt-2 line-clamp-2">{builder.bio}</p>
                      )}
                      {builder.wallet_address && (
                        <Badge variant="outline" className="mt-2 text-xs border-cyan-500 text-cyan-400">
                          Web3
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
