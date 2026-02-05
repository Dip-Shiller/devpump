'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AppNav } from '@/components/layout/app-nav'
import { useAuth } from '@/providers/wallet-provider'
import {
  Zap, MapPin, Calendar, Link as LinkIcon, Github, Twitter,
  Globe, Edit3, Share2, Award, Star,
  Briefcase, Code, Users, MessageSquare, Heart, Eye,
  ChevronRight, Plus, ExternalLink, Check, X,
  Sparkles, Clock, BookOpen, Loader2, Camera, Save
} from 'lucide-react'
import Link from 'next/link'
import type { Project } from '@/lib/supabase'

interface UserProfile {
  id: string
  username: string
  title: string | null
  bio: string | null
  location: string | null
  avatar_url: string | null
  cover_image_url: string | null
  skills: string[]
  reputation: number
  is_verified: boolean
  is_available: boolean
  github_url: string | null
  twitter_url: string | null
  website_url: string | null
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [endorsements, setEndorsements] = useState<any[]>([])
  const [skillEndorsements, setSkillEndorsements] = useState<{skill: string, count: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    bio: '',
    location: '',
    github_url: '',
    twitter_url: '',
    website_url: '',
    skills: [] as string[],
    is_available: true
  })
  const [newSkill, setNewSkill] = useState('')

  // Fetch user profile data
  useEffect(() => {
    if (user?.id) {
      fetchProfileData()
    }
  }, [user?.id])

  const fetchProfileData = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setProjects(data.projects || [])
        setEndorsements(data.endorsements || [])
        setSkillEndorsements(data.skillEndorsements || [])
        // Initialize edit form
        setEditForm({
          title: data.user.title || '',
          bio: data.user.bio || '',
          location: data.user.location || '',
          github_url: data.user.github_url || '',
          twitter_url: data.user.twitter_url || '',
          website_url: data.user.website_url || '',
          skills: data.user.skills || [],
          is_available: data.user.is_available ?? true
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    const username = profile?.username || user?.username || 'user'
    navigator.clipboard.writeText(`https://devpump.io/u/${username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFileUpload = async (
    file: File,
    type: 'avatar' | 'cover',
    setUploading: (v: boolean) => void
  ) => {
    if (!user?.id) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('userId', user.id)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const { url } = await response.json()

      // Update user profile with new URL
      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'avatar' ? 'avatar_url' : 'cover_image_url']: url
        })
      })

      // Refresh profile data
      await fetchProfileData()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, 'avatar', setUploadingAvatar)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, 'cover', setUploadingCover)
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return
    setIsSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        await fetchProfileData()
        setIsEditing(false)
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save profile: ' + (error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !editForm.skills.includes(newSkill.trim())) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(s => s !== skill)
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'endorsements', label: 'Endorsements', icon: <Heart className="w-4 h-4" /> },
  ]

  const achievements = [
    { icon: '🏆', title: 'Top Builder', description: 'Top 1% of builders' },
    { icon: '🔥', title: 'Streak Master', description: '30 day contribution streak' },
    { icon: '💎', title: 'Diamond Hands', description: 'Early adopter badge' },
    { icon: '🌟', title: 'Rising Star', description: 'Fastest growing reputation' },
  ]

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin?redirect=/profile')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!isAuthenticated || !profile) {
    return null
  }

  const joinDate = profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : 'Recently'

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-20">
      <AppNav />

      {/* Cover Image */}
      <div className="relative h-48 md:h-64 overflow-hidden mt-16">
        {profile.cover_image_url ? (
          <img src={profile.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-900/50 via-purple-800/30 to-emerald-900/50">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleCoverChange}
          className="hidden"
        />

        <button
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadingCover}
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-sm hover:bg-black/70 transition-all cursor-pointer disabled:opacity-50"
        >
          {uploadingCover ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          {uploadingCover ? 'Uploading...' : 'Edit Cover'}
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-1 shadow-[0_0_40px_rgba(153,69,255,0.3)]">
              <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl md:text-6xl">{profile.username?.charAt(0).toUpperCase() || '👤'}</span>
                )}
              </div>
            </div>

            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />

            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </button>

            {profile.is_available && (
              <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-background">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">{profile.username}</h1>
                  {profile.is_verified && (
                    <Badge variant="glow" className="gap-1">
                      <Award className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xl text-muted-foreground">{profile.title || 'Solana Developer'}</p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>
            </div>

            {/* Bio - Editable */}
            {isEditing ? (
              <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <Input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    placeholder="e.g. Senior Solana Developer"
                    className="mt-1 bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="mt-1 w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500/50 focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="e.g. Remote, Worldwide"
                    className="mt-1 bg-white/5 border-white/10"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">GitHub URL</label>
                    <Input
                      value={editForm.github_url}
                      onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                      placeholder="https://github.com/username"
                      className="mt-1 bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Twitter URL</label>
                    <Input
                      value={editForm.twitter_url}
                      onChange={(e) => setEditForm({ ...editForm, twitter_url: e.target.value })}
                      placeholder="https://twitter.com/username"
                      className="mt-1 bg-white/5 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Website</label>
                    <Input
                      value={editForm.website_url}
                      onChange={(e) => setEditForm({ ...editForm, website_url: e.target.value })}
                      placeholder="https://yoursite.com"
                      className="mt-1 bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Skills</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editForm.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="gap-1">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="bg-white/5 border-white/10"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <Button variant="outline" onClick={handleAddSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={editForm.is_available}
                    onChange={(e) => setEditForm({ ...editForm, is_available: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="available" className="text-sm">Available for work</label>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  {profile.bio || 'No bio yet. Click Edit Profile to add one!'}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {joinDate}
                  </div>
                  {profile.is_available && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Clock className="w-4 h-4" />
                      Available for work
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-3">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Reputation', value: profile.reputation || 0, icon: <Star className="w-5 h-5 text-yellow-400" />, color: 'from-yellow-500/20 to-orange-500/20' },
            { label: 'Projects', value: projects.length, icon: <Briefcase className="w-5 h-5 text-purple-400" />, color: 'from-purple-500/20 to-pink-500/20' },
            { label: 'Endorsements', value: endorsements.length, icon: <Heart className="w-5 h-5 text-pink-400" />, color: 'from-pink-500/20 to-rose-500/20' },
            { label: 'Skills', value: profile.skills?.length || 0, icon: <Code className="w-5 h-5 text-cyan-400" />, color: 'from-cyan-500/20 to-blue-500/20' },
          ].map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br ${stat.color} border-white/10 hover:border-white/20 transition-all cursor-default group`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills Display */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {profile.skills.map((skill) => {
              const endorsementCount = skillEndorsements.find(s => s.skill === skill)?.count || 0
              return (
                <Badge key={skill} variant="outline" className="gap-1 px-3 py-1">
                  {skill}
                  {endorsementCount > 0 && (
                    <span className="ml-1 text-xs text-purple-400">+{endorsementCount}</span>
                  )}
                </Badge>
              )
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border-b-2 border-purple-500'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Section */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    Projects
                  </h3>
                  <Link href="/projects/new">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add Project
                    </Button>
                  </Link>
                </div>

                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold group-hover:text-purple-400 transition-colors">
                              {project.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                          <Badge variant={project.status === 'completed' ? 'success' : project.status === 'active' ? 'glow' : 'outline'}>
                            {project.status}
                          </Badge>
                        </div>
                        {project.skills && project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.skills.map((skill) => (
                              <span key={skill} className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No projects yet. Add your first project!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  About
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.bio || 'No bio added yet.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all cursor-default text-center group"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{achievement.icon}</span>
                      <div className="text-sm font-medium">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Endorsements */}
            {endorsements.length > 0 && (
              <Card className="border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Recent Endorsements
                  </h3>
                  <div className="space-y-3">
                    {endorsements.slice(0, 5).map((endorsement: any, index: number) => (
                      <div key={index} className="p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{endorsement.from_user?.username || 'Anonymous'}</span>
                          <Badge variant="outline" className="text-xs">{endorsement.skill}</Badge>
                        </div>
                        {endorsement.message && (
                          <p className="text-sm text-muted-foreground">{endorsement.message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
