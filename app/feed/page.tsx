'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppNav } from '@/components/layout/app-nav'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/wallet-provider'
import {
  Zap, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Clock, Flame, Filter, Search, Plus, Image as ImageIcon,
  Link as LinkIcon, Code, ChevronUp, ChevronDown, Award,
  Eye, Users, Star, Sparkles, Hash, ArrowRight, Send,
  ThumbsUp, MessageCircle, Repeat2, ExternalLink, Loader2, X
} from 'lucide-react'
import type { Post } from '@/lib/supabase'

export default function FeedPage() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('trending')
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [apiPosts, setApiPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Image upload state
  const [postImage, setPostImage] = useState<File | null>(null)
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setSubmitError('Invalid image type. Use JPG, PNG, GIF, or WEBP')
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Image too large. Maximum size is 5MB')
        return
      }
      setPostImage(file)
      setPostImagePreview(URL.createObjectURL(file))
      setSubmitError(null)
    }
  }

  const clearPostImage = () => {
    setPostImage(null)
    if (postImagePreview) {
      URL.revokeObjectURL(postImagePreview)
    }
    setPostImagePreview(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoadingPosts(true)
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setApiPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Handle post submission
  const handleSubmitPost = async () => {
    if (!user?.id || !postTitle.trim() || !postContent.trim()) {
      setSubmitError('Please provide a title and content')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let imageUrl: string | null = null

      // Upload image first if one is selected
      if (postImage) {
        setIsUploadingImage(true)
        const formData = new FormData()
        formData.append('file', postImage)
        formData.append('type', 'post')
        formData.append('ownerId', user.id)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          const data = await uploadResponse.json()
          throw new Error(data.error || 'Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
        setIsUploadingImage(false)
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: user.id,
          title: postTitle.trim(),
          content: postContent.trim(),
          type: 'discussion',
          tags: [],
          image_url: imageUrl
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create post')
      }

      // Clear form and refresh posts
      setPostTitle('')
      setPostContent('')
      clearPostImage()
      await fetchPosts()
    } catch (error) {
      console.error('Error creating post:', error)
      setSubmitError((error as Error).message)
    } finally {
      setIsSubmitting(false)
      setIsUploadingImage(false)
    }
  }

  const tabs = [
    { id: 'trending', label: 'Trending', icon: <Flame className="w-4 h-4" /> },
    { id: 'latest', label: 'Latest', icon: <Clock className="w-4 h-4" /> },
    { id: 'questions', label: 'Questions', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'news', label: 'News', icon: <Zap className="w-4 h-4" /> },
    { id: 'following', label: 'Following', icon: <Users className="w-4 h-4" /> },
  ]

  const categories = [
    { id: 'all', label: 'All', count: 342 },
    { id: 'defi', label: 'DeFi', count: 89 },
    { id: 'nft', label: 'NFT', count: 67 },
    { id: 'rust', label: 'Rust', count: 124 },
    { id: 'anchor', label: 'Anchor', count: 78 },
    { id: 'security', label: 'Security', count: 45 },
    { id: 'hiring', label: 'Hiring', count: 23 },
  ]

  const trendingTopics = [
    { tag: 'SolanaBreakpoint', posts: '2.4K' },
    { tag: 'RustLang', posts: '1.8K' },
    { tag: 'DeFi2024', posts: '1.2K' },
    { tag: 'NFTArt', posts: '987' },
    { tag: 'Web3Jobs', posts: '756' },
  ]

  // Format time ago helper
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  // Handle vote
  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    if (!user?.id) return
    try {
      await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: user.id,
          vote_type: voteType
        })
      })
      // Refresh posts
      fetchPosts()
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const topContributors = [
    { name: 'solana_builder', avatar: '👨‍💻', reputation: 2847, badge: '🏆' },
    { name: 'anchor_master', avatar: '⚓', reputation: 2156, badge: '🥈' },
    { name: 'defi_wizard', avatar: '🧙‍♂️', reputation: 1923, badge: '🥉' },
    { name: 'rust_guru', avatar: '🦀', reputation: 1654, badge: '' },
    { name: 'nft_artist', avatar: '🎨', reputation: 1432, badge: '' },
  ]

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'news': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'discussion': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      case 'tutorial': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'hiring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'question': return '❓'
      case 'news': return '📰'
      case 'discussion': return '💬'
      case 'tutorial': return '📚'
      case 'hiring': return '💼'
      default: return '📝'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-20">
      <AppNav />
      
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-16 z-40 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                Community Feed
              </h1>
              <p className="text-muted-foreground">Discover, learn, and connect with builders 🌟</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none w-64"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="space-y-6">
            <Card className="border-white/10">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-purple-400" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <Badge variant="outline" className="text-xs">{cat.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="border-white/10">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Trending
                </h3>
                <div className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">#</span>
                        <span className="font-medium group-hover:text-purple-400 transition-colors">{topic.tag}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{topic.posts} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card className="border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg">
                    {user?.username?.charAt(0).toUpperCase() || '😎'}
                  </div>
                  <div className="flex-1 space-y-3">
                    {!isAuthenticated && (
                      <p className="text-sm text-muted-foreground">Connect your wallet to post</p>
                    )}
                    <Input
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Post title..."
                      className="bg-white/5 border-white/10 focus:border-purple-500/50"
                      disabled={!isAuthenticated || isSubmitting}
                    />
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share something with the community... 💡"
                      className="w-full bg-transparent border-none focus:outline-none resize-none text-lg"
                      rows={2}
                      disabled={!isAuthenticated || isSubmitting}
                    />
                    {submitError && (
                      <p className="text-sm text-red-400">{submitError}</p>
                    )}

                    {/* Image Preview */}
                    {postImagePreview && (
                      <div className="relative rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={postImagePreview}
                          alt="Preview"
                          className="w-full max-h-64 object-cover"
                        />
                        <button
                          onClick={clearPostImage}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => imageInputRef.current?.click()}
                          disabled={!isAuthenticated || isSubmitting}
                          className={`p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                            postImage ? 'text-purple-400' : 'text-muted-foreground hover:text-white'
                          } disabled:opacity-50`}
                        >
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer">
                          <Code className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white cursor-pointer">
                          <LinkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <Button
                        className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 cursor-pointer"
                        onClick={handleSubmitPost}
                        disabled={!isAuthenticated || isSubmitting || !postTitle.trim() || !postContent.trim()}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {isUploadingImage ? 'Uploading...' : isSubmitting ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            {isLoadingPosts ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : apiPosts.length === 0 ? (
              <Card className="border-white/10">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                </CardContent>
              </Card>
            ) : (
              apiPosts.map((post: any) => (
              <Card
                key={post.id}
                className={`border-white/10 hover:border-purple-500/30 transition-all group ${
                  post.is_pinned ? 'border-purple-500/30 bg-purple-500/5' : ''
                }`}
              >
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl overflow-hidden">
                        {post.author?.avatar_url ? (
                          <img src={post.author.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          post.author?.username?.charAt(0).toUpperCase() || '👤'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{post.author?.username || 'Anonymous'}</span>
                          {post.author?.is_verified && (
                            <Badge variant="glow" className="gap-1 text-xs">
                              <Award className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatTimeAgo(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPostTypeColor(post.type)} text-xs`}>
                        {getPostTypeIcon(post.type)} {post.type}
                      </Badge>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Post Image */}
                  {post.image_url && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                      <img
                        src={post.image_url}
                        alt=""
                        className="w-full max-h-96 object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      {/* Upvote/Downvote */}
                      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        <button
                          onClick={() => handleVote(post.id, 'up')}
                          className="p-2 rounded-lg hover:bg-purple-500/20 hover:text-purple-400 transition-all cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm px-2">{(post.upvotes || 0) - (post.downvotes || 0)}</span>
                        <button
                          onClick={() => handleVote(post.id, 'down')}
                          className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>

                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white cursor-pointer">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comment</span>
                      </button>

                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white cursor-pointer">
                        <Repeat2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-yellow-400 cursor-pointer">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="gap-2">
                Load More Posts
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card className="border-white/10">
              <CardContent className="p-4">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {topContributors.map((user, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="text-lg font-bold text-muted-foreground w-4">
                        {index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium group-hover:text-purple-400 transition-colors">{user.name}</span>
                          {user.badge && <span>{user.badge}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{user.reputation} rep</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-3 gap-2">
                  View Leaderboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-white/10">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Ask a Question
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Code className="w-4 h-4" />
                    Share a Tutorial
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="w-4 h-4" />
                    Find Team Members
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  Community First
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Be respectful, helpful, and supportive. We're all here to learn and grow together! 🌱
                </p>
                <Button variant="ghost" size="sm" className="gap-1 text-purple-400">
                  Read Guidelines
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

