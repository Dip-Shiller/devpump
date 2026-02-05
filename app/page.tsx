'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WalletButton } from '@/components/wallet-button'
import {
  Zap, Rocket, Shield, Eye, Target, Lock,
  ArrowRight, Search, ChevronLeft, ChevronRight as ChevronRightIcon,
  ThumbsUp, MessageSquare, User
} from 'lucide-react'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  type: string
  author: {
    username: string
    avatar_url: string | null
  }
  upvotes: number
  created_at: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchLatestPosts()
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    if (posts.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(posts.length, 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [posts.length])

  const fetchLatestPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=6')
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

  const displayPosts = posts.length > 0 ? posts.slice(0, 3) : []

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(displayPosts.length, 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(displayPosts.length, 1)) % Math.max(displayPosts.length, 1))
  }

  const coreValues = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: 'Transparency',
      description: 'Everything on-chain, verifiable by all',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500'
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: 'Anonymity',
      description: 'Your privacy is sacred to us',
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500'
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Clarity',
      description: 'Clear goals, honest communication',
      color: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500'
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-500/20 text-blue-400'
      case 'news': return 'bg-green-500/20 text-green-400'
      case 'tutorial': return 'bg-purple-500/20 text-purple-400'
      case 'hiring': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-cyan-500/20 text-cyan-400'
    }
  }

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

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DevPump</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">
                  Login
                </Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32">
        <section className={`min-h-[70vh] flex flex-col items-center justify-center px-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                DevPump
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Where{' '}
              <span className="text-purple-400 font-semibold">Transparency</span>
              {' '}and{' '}
              <span className="text-emerald-400 font-semibold">Anonymity</span>
              {' '}meets{' '}
              <span className="text-purple-400 font-semibold">Clarity</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group gap-3 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white shadow-[0_0_30px_rgba(153,69,255,0.3)] hover:shadow-[0_0_50px_rgba(153,69,255,0.5)] transition-all duration-300 hover:-translate-y-1 rounded-xl px-8 py-6 text-lg cursor-pointer"
                >
                  <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="group gap-3 border-2 border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-white transition-all duration-300 hover:-translate-y-1 rounded-xl px-8 py-6 text-lg cursor-pointer"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Meet the Community
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Posts Carousel */}
        {!isLoading && displayPosts.length > 0 && (
          <section className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-cyan-400 font-medium mb-3 tracking-wide uppercase text-sm">Latest from the Community</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white">See what builders are sharing</h2>
              </div>

              {/* Carousel */}
              <div className="relative">
                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>

                {/* Carousel Content */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {displayPosts.map((post) => (
                      <div key={post.id} className="w-full flex-shrink-0 px-4">
                        <Link href="/feed">
                          <Card className="bg-[#111113] border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xl flex-shrink-0">
                                  {post.author?.avatar_url ? (
                                    <img src={post.author.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                  ) : (
                                    <User className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium text-white">{post.author?.username || 'Anonymous'}</span>
                                    <span className="text-sm text-zinc-500">{formatTimeAgo(post.created_at)}</span>
                                    <Badge className={`text-xs ${getTypeColor(post.type)}`}>
                                      {post.type}
                                    </Badge>
                                  </div>
                                  <h3 className="font-bold text-lg text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                                    {post.title}
                                  </h3>
                                  <p className="text-zinc-400 text-sm line-clamp-2">
                                    {post.content}
                                  </p>
                                  <div className="flex items-center gap-4 mt-4 text-sm text-zinc-500">
                                    <div className="flex items-center gap-1">
                                      <ThumbsUp className="w-4 h-4" />
                                      {post.upvotes || 0}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      Comments
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                  {displayPosts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        index === currentIndex
                          ? 'w-6 bg-purple-500'
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/feed">
                  <Button variant="outline" className="gap-2 cursor-pointer">
                    View All Posts
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

        {/* Our Promise Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-purple-400 font-medium mb-3 tracking-wide uppercase text-sm">Our Promise</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Built on principles that matter
              </h2>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <Card
                  key={index}
                  className={`bg-[#111113] ${value.borderColor} ${value.hoverBorder} hover:bg-[#161618] transition-all duration-300 cursor-default group`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${value.color} mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-white">{value.title}</h3>
                    <p className="text-zinc-500">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Why DevPump Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-emerald-400 font-medium mb-3 tracking-wide uppercase text-sm">Why DevPump?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Everything you need to thrive
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              No gatekeeping. No popularity contests. Just a welcoming space where your work speaks for itself.
              Ready to build something amazing?
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-6 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DevPump</span>
              </div>

              {/* Links */}
              <div className="flex items-center gap-8 text-sm text-zinc-500">
                {['Discord', 'Twitter', 'GitHub', 'Docs'].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {link}
                  </a>
                ))}
              </div>

              {/* Built on Solana */}
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Shield className="h-4 w-4 text-purple-400" />
                Built on Solana
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
