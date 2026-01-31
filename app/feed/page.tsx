'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, MessageSquare, ThumbsUp, Send } from 'lucide-react'
import { useWallet } from '@/providers/wallet-provider'
import Link from 'next/link'
import type { Post } from '@/lib/supabase'

export default function FeedPage() {
  const { user } = useWallet()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitPost = async () => {
    if (!user || !newPost.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: user.id,
          content: newPost,
          type: 'discussion',
        }),
      })

      if (response.ok) {
        setNewPost('')
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Feed</h1>

      {user && (
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="pt-6">
            <Textarea
              placeholder="What are you building?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px] mb-4"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitPost}
                disabled={isSubmitting || !newPost.trim()}
                className="bg-gradient-to-r from-purple-600 to-cyan-600"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Link href={`/builders/${post.author_id}`}>
                    <Avatar>
                      <AvatarImage src={post.author?.avatar_url || undefined} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link href={`/builders/${post.author_id}`} className="text-white font-medium hover:underline">
                      {post.author?.display_name || post.author?.username || 'Anonymous'}
                    </Link>
                    <p className="text-gray-400 text-sm">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {post.type && (
                    <Badge variant="outline" className="ml-auto border-purple-500 text-purple-400">
                      {post.type}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
                <div className="flex gap-4 mt-4">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {post.vote_count || 0}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {post.comment_count || 0}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
