'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Zap, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal,
  TrendingUp, Clock, Flame, Filter, Search, Plus, Image,
  Link as LinkIcon, Code, ChevronUp, ChevronDown, Award,
  Eye, Users, Star, Sparkles, Hash, ArrowRight, Send,
  ThumbsUp, MessageCircle, Repeat2, ExternalLink
} from 'lucide-react'
export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('trending')
  const [postContent, setPostContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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
  const posts = [
    {
      id: 1,
      type: 'question',
      author: { name: 'rust_newbie', avatar: '🦀', verified: false },
      title: 'How do I implement a custom PDA in Anchor?',
      content: 'I\'m trying to create a program that uses PDAs for user accounts, but I\'m running into issues with seed derivation. Can someone explain the best practices? 🙏',
      tags: ['Anchor', 'Rust', 'PDA'],
      stats: { upvotes: 42, comments: 15, views: '1.2K' },
      time: '2 hours ago',
      hasAcceptedAnswer: true,
      isPinned: false,
    },
    {
      id: 2,
      type: 'news',
      author: { name: 'solana_news', avatar: '📰', verified: true },
      title: '🚀 Solana Breakpoint 2024 Announced!',
      content: 'The biggest Solana event of the year is coming! Join us for 3 days of workshops, hackathons, and networking with the top builders in the ecosystem. Early bird tickets now available!',
      tags: ['Breakpoint', 'Event', 'Announcement'],
      stats: { upvotes: 847, comments: 124, views: '12.4K' },
      time: '5 hours ago',
      hasAcceptedAnswer: false,
      isPinned: true,
    },
    {
      id: 3,
      type: 'discussion',
      author: { name: 'defi_wizard', avatar: '🧙‍♂️', verified: true },
      title: 'Thoughts on concentrated liquidity vs traditional AMMs?',
      content: 'I\'ve been researching different DEX models and I\'m curious what the community thinks about the trade-offs between concentrated liquidity (like Orca) vs traditional constant product AMMs. What has your experience been?',
      tags: ['DeFi', 'DEX', 'Discussion'],
      stats: { upvotes: 156, comments: 67, views: '3.8K' },
      time: '8 hours ago',
      hasAcceptedAnswer: false,
      isPinned: false,
    },
    {
      id: 4,
      type: 'tutorial',
      author: { name: 'anchor_master', avatar: '⚓', verified: true },
      title: '📚 Complete Guide: Building a Token Staking Program',
      content: 'Just published a comprehensive tutorial on building a token staking program with Anchor. Covers everything from account structures to reward distribution. Hope it helps someone! Link in comments.',
      tags: ['Tutorial', 'Anchor', 'Staking'],
      stats: { upvotes: 324, comments: 45, views: '5.2K' },
      time: '1 day ago',
      hasAcceptedAnswer: false,
      isPinned: false,
    },
    {
      id: 5,
      type: 'hiring',
      author: { name: 'cool_startup', avatar: '🚀', verified: false },
      title: '💼 Hiring: Senior Solana Developer (Remote, $150-200K)',
      content: 'We\'re building the next generation of DeFi infrastructure and looking for experienced Rust/Solana developers. Competitive salary, token allocation, and flexible hours. DM if interested!',
      tags: ['Hiring', 'Remote', 'DeFi'],
      stats: { upvotes: 89, comments: 23, views: '2.1K' },
      time: '1 day ago',
      hasAcceptedAnswer: false,
      isPinned: false,
    },
  ]
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
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-background/80 backdrop-blur-xl sticky top-16 z-40">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
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
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
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
                    😎
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share something with the community... 💡"
                      className="w-full bg-transparent border-none focus:outline-none resize-none text-lg"
                      rows={2}
                    />
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                          <Image className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                          <Code className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                          <LinkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500">
                        <Send className="w-4 h-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Posts */}
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className={`border-white/10 hover:border-purple-500/30 transition-all group ${
                  post.isPinned ? 'border-purple-500/30 bg-purple-500/5' : ''
                }`}
              >
                <CardContent className="p-6">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl">
                        {post.author.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{post.author.name}</span>
                          {post.author.verified && (
                            <Badge variant="default" className="gap-1 text-xs">
                              <Award className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{post.time}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.stats.views}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getPostTypeColor(post.type)} text-xs`}>
                        {getPostTypeIcon(post.type)} {post.type}
                      </Badge>
                      {post.hasAcceptedAnswer && (
                        <Badge variant="default" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">✓ Solved</Badge>
                      )}
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground">
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
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      {/* Upvote/Downvote */}
                      <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        <button className="p-2 rounded-lg hover:bg-purple-500/20 hover:text-purple-400 transition-all">
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm px-2">{post.stats.upvotes}</span>
                        <button className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{post.stats.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
                        <Repeat2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-yellow-400">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
