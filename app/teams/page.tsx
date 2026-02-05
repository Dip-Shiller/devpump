'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppNav } from '@/components/layout/app-nav'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/wallet-provider'
import { useTeams, useTeamDetails } from '@/hooks/use-teams'
import {
  Users, Plus, Search, Send, Smile, Paperclip, MoreVertical,
  Hash, Bell, Pin, Settings, Crown, Shield, MessageSquare,
  ChevronRight, Circle, Filter, Grid, List, Sparkles,
  Zap, Target, Calendar, Link as LinkIcon, ExternalLink,
  UserPlus, Lock, Globe, Star, Heart, Eye, Loader2, X, Camera
} from 'lucide-react'

export default function TeamsPage() {
  const { user } = useAuth()
  const { teams, isLoading: teamsLoading, createTeam } = useTeams(user?.id)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const { team: selectedTeamData, members: teamMembers, isLoading: teamDetailsLoading } = useTeamDetails(selectedTeam)
  const [message, setMessage] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: '',
    is_private: false
  })

  // Team image upload state
  const [teamImage, setTeamImage] = useState<File | null>(null)
  const [teamImagePreview, setTeamImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const teamImageInputRef = useRef<HTMLInputElement>(null)

  const handleTeamImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        alert('Invalid image type. Use JPG, PNG, GIF, or WEBP')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image too large. Maximum size is 5MB')
        return
      }
      setTeamImage(file)
      setTeamImagePreview(URL.createObjectURL(file))
    }
  }

  const clearTeamImage = () => {
    setTeamImage(null)
    if (teamImagePreview) {
      URL.revokeObjectURL(teamImagePreview)
    }
    setTeamImagePreview(null)
    if (teamImageInputRef.current) {
      teamImageInputRef.current.value = ''
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamData.name.trim() || !user?.id) return

    setCreating(true)

    try {
      let imageUrl: string | undefined

      // Upload team image first if one is selected
      if (teamImage) {
        setUploadingImage(true)
        const formData = new FormData()
        formData.append('file', teamImage)
        formData.append('type', 'team')
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
        setUploadingImage(false)
      }

      const result = await createTeam({ ...newTeamData, image_url: imageUrl })

      if (result.success) {
        setShowCreateModal(false)
        setNewTeamData({ name: '', description: '', is_private: false })
        clearTeamImage()
        if (result.team) {
          setSelectedTeam(result.team.id)
        }
      } else {
        alert('Failed to create team: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating team:', error)
      alert('Failed to create team: ' + (error as Error).message)
    } finally {
      setCreating(false)
      setUploadingImage(false)
    }
  }

  // Convert real team members to display format
  const displayMembers = teamMembers.map(m => ({
    name: m.user?.username || 'Unknown',
    role: m.role.charAt(0).toUpperCase() + m.role.slice(1),
    status: 'online' as const,
    avatar: m.user?.avatar_url ? '👤' : '👨‍💻'
  }))

  const messages = [
    { user: 'solana_builder', avatar: '👨‍💻', message: 'Hey team! Just deployed the new smart contract. Can someone review? 🚀', time: '10:32 AM', isOwn: false },
    { user: 'web3wizard', avatar: '🧙', message: 'Looking at it now! The optimization looks great 👀', time: '10:35 AM', isOwn: false },
    { user: 'You', avatar: '😎', message: 'I can help with the frontend integration once the contract is approved!', time: '10:38 AM', isOwn: true },
    { user: 'defidev', avatar: '💻', message: 'The yield calculation logic is solid. Approved from my end ✅', time: '10:42 AM', isOwn: false },
    { user: 'solana_builder', avatar: '👨‍💻', message: 'Awesome! Let\'s ship it then. @You you\'re up! 🎉', time: '10:45 AM', isOwn: false },
  ]

  const bulletinPosts = [
    {
      title: 'New DEX Launch - Seeking Testers',
      author: 'solana_builder',
      time: '2 hours ago',
      replies: 12,
      pinned: true,
      tags: ['Testing', 'DeFi'],
    },
    {
      title: 'Anchor Tutorial Series Starting Next Week',
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

  return (
    <div className="min-h-screen pb-20">
      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create New Team</CardTitle>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                {/* Team Image Upload */}
                <div>
                  <Label>Team Image</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div
                      onClick={() => teamImageInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors overflow-hidden"
                    >
                      {teamImagePreview ? (
                        <img src={teamImagePreview} alt="Team" className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Click to upload a team image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, GIF or WEBP (max 5MB)
                      </p>
                      {teamImage && (
                        <button
                          type="button"
                          onClick={clearTeamImage}
                          className="text-sm text-red-400 mt-1 cursor-pointer hover:text-red-300"
                        >
                          Remove image
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    ref={teamImageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleTeamImageSelect}
                    className="hidden"
                  />
                </div>

                <div>
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={newTeamData.name}
                    onChange={(e) => setNewTeamData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter team name..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team-desc">Description</Label>
                  <textarea
                    id="team-desc"
                    value={newTeamData.description}
                    onChange={(e) => setNewTeamData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What is this team about?"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none min-h-[80px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="team-private"
                    checked={newTeamData.is_private}
                    onChange={(e) => setNewTeamData(prev => ({ ...prev, is_private: e.target.checked }))}
                    className="cursor-pointer"
                  />
                  <Label htmlFor="team-private" className="cursor-pointer flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Private team (invite only)
                  </Label>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating || !newTeamData.name.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 cursor-pointer"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        {uploadingImage ? 'Uploading...' : 'Creating...'}
                      </>
                    ) : (
                      'Create Team'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/10 bg-background/80 backdrop-blur-xl sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Teams
              </h1>
              <p className="text-muted-foreground">Collaborate with builders worldwide</p>
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
              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 cursor-pointer"
              >
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

            {teamsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            ) : teams.length === 0 ? (
              <Card className="border-dashed border-white/10">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">No teams yet</p>
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 cursor-pointer"
                  >
                    Create Your First Team
                  </Button>
                </CardContent>
              </Card>
            ) : (
              teams.map((team) => (
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
                        {team.image_url ? (
                          <img src={team.image_url} alt={team.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          team.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold truncate">{team.name}</h3>
                          {team.is_private && <Lock className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{team.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {team.member_count || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

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
            {teamDetailsLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : selectedTeamData ? (
              <>
                {/* Team Header */}
                <Card className="border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg overflow-hidden">
                          {selectedTeamData.image_url ? (
                            <img src={selectedTeamData.image_url} alt={selectedTeamData.name} className="w-full h-full object-cover" />
                          ) : (
                            selectedTeamData.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{selectedTeamData.name}</h2>
                            {selectedTeamData.is_private ? (
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
                    Members ({displayMembers.length})
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    Invite
                  </Button>
                </div>

                {/* Member List */}
                {displayMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {selectedTeam ? 'No members yet' : 'Select a team to see members'}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {displayMembers.map((member, index) => (
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
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 cursor-pointer">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
