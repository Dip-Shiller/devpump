'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppNav } from '@/components/layout/app-nav'
import { 
  Users, Plus, Search, Send, Smile, Paperclip, MoreVertical,
  Hash, Bell, Pin, Settings, Crown, Shield, MessageSquare,
  ChevronRight, Circle, Filter, Grid, List, Sparkles,
  Zap, Target, Calendar, Link as LinkIcon, ExternalLink,
  UserPlus, Lock, Globe, Star, Heart, Eye
} from 'lucide-react'

export default function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>('solana-builders')
  const [message, setMessage] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const teams = [
    {
      id: 'solana-builders',
      name: 'Solana Builders',
      description: 'Core contributors building the future of Solana',
      members: 24,
      online: 8,
      isPrivate: false,
      role: 'Admin',
      unread: 3,
      image: '🚀',
    },
    {
      id: 'defi-devs',
      name: 'DeFi Developers',
      description: 'Building next-gen DeFi protocols',
      members: 18,
      online: 5,
      isPrivate: true,
      role: 'Member',
      unread: 0,
      image: '💰',
    },
    {
      id: 'nft-creators',
      name: 'NFT Creators',
      description: 'Artists and developers creating digital art',
      members: 32,
      online: 12,
      isPrivate: false,
      role: 'Member',
      unread: 7,
      image: '🎨',
    },
  ]

  const teamMembers = [
    { name: 'solana_builder', role: 'Admin', status: 'online', avatar: '👨‍💻' },
    { name: 'web3wizard', role: 'Moderator', status: 'online', avatar: '🧙' },
    { name: 'defidev', role: 'Member', status: 'online', avatar: '💻' },
    { name: 'rustacean', role: 'Member', status: 'away', avatar: '🦀' },
    { name: 'cryptobuilder', role: 'Member', status: 'online', avatar: '🔧' },
    { name: 'nftartist', role: 'Member', status: 'offline', avatar: '🎨' },
    { name: 'smartcontract', role: 'Member', status: 'online', avatar: '📜' },
    { name: 'tokenmaster', role: 'Member', status: 'offline', avatar: '🪙' },
  ]

  const messages = [
    { user: 'solana_builder', avatar: '👨‍💻', message: 'Hey team! Just deployed the new smart contract. Can someone review? 🚀', time: '10:32 AM', isOwn: false },
    { user: 'web3wizard', avatar: '🧙', message: 'Looking at it now! The optimization looks great 👀', time: '10:35 AM', isOwn: false },
    { user: 'You', avatar: '😎', message: 'I can help with the frontend integration once the contract is approved!', time: '10:38 AM', isOwn: true },
    { user: 'defidev', avatar: '💻', message: 'The yield calculation logic is solid. Approved from my end ✅', time: '10:42 AM', isOwn: false },
    { user: 'solana_builder', avatar: '👨‍💻', message: 'Awesome! Let\'s ship it then. @You you\'re up! 🎉', time: '10:45 AM', isOwn: false },
  ]

  const bulletinPosts = [
    {
      title: '🚀 New DEX Launch - Seeking Testers',
      author: 'solana_builder',
      time: '2 hours ago',
      replies: 12,
      pinned: true,
      tags: ['Testing', 'DeFi'],
    },
    {
      title: '📚 Anchor Tutorial Series Starting Next Week',
      author: 'web3wizard',
      time: '5 hours ago',
      replies: 8,
      pinned: true,
      tags: ['Tutorial', 'Anchor'],
    },
    {
      title: 'Looking for Frontend Dev for NFT Project',
      author: 'nftartist',
      time: '1 day ago',
      replies: 23,
      pinned: false,
      tags: ['Hiring', 'NFT'],
    },
    {
      title: 'Security Best Practices Discussion',
      author: 'defidev',
      time: '2 days ago',
      replies: 45,
      pinned: false,
      tags: ['Security', 'Discussion'],
    },
  ]

  const selectedTeamData = teams.find(t => t.id === selectedTeam)

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-background/80 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Teams
              </h1>
              <p className="text-muted-foreground">Collaborate with builders worldwide 🌍</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none w-64"
                />
              </div>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500">
                <Plus className="w-4 h-4" />
                Create Team
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Teams Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Your Teams</h2>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-500/20 text-purple-400' : 'text-muted-foreground hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {teams.map((team) => (
              <Card 
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`cursor-pointer transition-all hover:border-purple-500/50 ${
                  selectedTeam === team.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-2xl">
                      {team.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold truncate">{team.name}</h3>
                        {team.isPrivate && <Lock className="w-3 h-3 text-muted-foreground" />}
                        {team.unread > 0 && (
                          <Badge className="bg-purple-500 text-white text-xs px-2">
                            {team.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{team.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {team.members}
                        </span>
                        <span className="flex items-center gap-1">
                          <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                          {team.online} online
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Discover Teams */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Discover Teams
              </h3>
              <Button variant="outline" className="w-full gap-2">
                <Search className="w-4 h-4" />
                Browse All Teams
              </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTeamData ? (
              <>
                {/* Team Header */}
                <Card className="border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg">
                          {selectedTeamData.image}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{selectedTeamData.name}</h2>
                            {selectedTeamData.isPrivate ? (
                              <Badge variant="outline" className="gap-1">
                                <Lock className="w-3 h-3" />
                                Private
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="gap-1">
                                <Globe className="w-3 h-3" />
                                Public
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{selectedTeamData.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Bell className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Settings className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bulletin Board */}
                <Card className="border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Pin className="w-5 h-5 text-cyan-400" />
                        Bulletin Board
                      </h3>
                      <Button size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Post
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {bulletinPosts.map((post, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-xl border transition-all cursor-pointer hover:border-purple-500/50 ${
                            post.pinned ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30' : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {post.pinned && <Pin className="w-4 h-4 text-purple-400" />}
                                <h4 className="font-bold hover:text-purple-400 transition-colors">{post.title}</h4>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>by {post.author}</span>
                                <span>•</span>
                                <span>{post.time}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {post.replies}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Team Chat */}
                <Card className="border-white/10">
                  <CardContent className="p-0">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-muted-foreground" />
                        <span className="font-bold">general</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Pin className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4">
                      {messages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg flex-shrink-0">
                            {msg.avatar}
                          </div>
                          <div className={`max-w-[70%] ${msg.isOwn ? 'text-right' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              {!msg.isOwn && <span className="font-medium text-sm">{msg.user}</span>}
                              <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <div className={`p-3 rounded-2xl ${
                              msg.isOwn 
                                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-tr-none' 
                                : 'bg-white/10 rounded-tl-none'
                            }`}>
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500/50 focus:outline-none"
                        />
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-white">
                          <Smile className="w-5 h-5" />
                        </button>
                        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                          <Send className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-white/10 border-dashed">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Select a team</h3>
                  <p className="text-muted-foreground mb-4">Choose a team from the sidebar to view discussions and chat</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Members Sidebar */}
          <div className="space-y-4">
            <Card className="border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    Members
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <UserPlus className="w-4 h-4" />
                    Invite
                  </Button>
                </div>

                {/* Online Members */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                    ONLINE — {teamMembers.filter(m => m.status === 'online').length}
                  </div>
                  <div className="space-y-1">
                    {teamMembers.filter(m => m.status === 'online').map((member, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm">
                            {member.avatar}
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium truncate">{member.name}</span>
                            {member.role === 'Admin' && <Crown className="w-3 h-3 text-yellow-400" />}
                            {member.role === 'Moderator' && <Shield className="w-3 h-3 text-purple-400" />}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Away Members */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-yellow-500 text-yellow-500" />
                    AWAY — {teamMembers.filter(m => m.status === 'away').length}
                  </div>
                  <div className="space-y-1">
                    {teamMembers.filter(m => m.status === 'away').map((member, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer opacity-75"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/50 to-cyan-500/50 flex items-center justify-center text-sm">
                            {member.avatar}
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border-2 border-background" />
                        </div>
                        <span className="text-sm font-medium truncate">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offline Members */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-gray-500 text-gray-500" />
                    OFFLINE — {teamMembers.filter(m => m.status === 'offline').length}
                  </div>
                  <div className="space-y-1">
                    {teamMembers.filter(m => m.status === 'offline').map((member, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer opacity-50"
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500/50 to-gray-600/50 flex items-center justify-center text-sm grayscale">
                            {member.avatar}
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-background" />
                        </div>
                        <span className="text-sm font-medium truncate">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Stats */}
            <Card className="border-white/10">
              <CardContent className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Team Stats
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Projects Completed', value: '12', icon: <Target className="w-4 h-4 text-green-400" /> },
                    { label: 'Active Projects', value: '3', icon: <Zap className="w-4 h-4 text-yellow-400" /> },
                    { label: 'Total Contributions', value: '847', icon: <Star className="w-4 h-4 text-purple-400" /> },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {stat.icon}
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
