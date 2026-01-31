'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/providers/wallet-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfilePhotos, useProfileUpdates } from '@/hooks/use-api'
import { ProfilePhotoGrid } from '@/components/ui/profile-photos'
import { ProfileUpdateCard } from '@/components/ui/profile-update'
import { ProfileBuilder } from '@/components/profile-builder/profile-builder'
import { Loader2, Save, User, Upload, Heart, Blocks } from 'lucide-react'

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useWallet()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'builder' | 'profile' | 'photos' | 'updates'>('builder')
  const { getProfilePhotos, uploadProfilePhoto, setPrimaryProfilePhoto, deleteProfilePhoto, isLoading: photosLoading } = useProfilePhotos()
  const { getProfileUpdates, createProfileUpdate, deleteProfileUpdate, isLoading: updatesLoading } = useProfileUpdates()
  const [photos, setPhotos] = useState<any[]>([])
  const [updates, setUpdates] = useState<any[]>([])
  const [photoUrl, setPhotoUrl] = useState('')
  const [updateContent, setUpdateContent] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    avatar_url: '',
    website: '',
    twitter: '',
    github: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        display_name: user.display_name || '',
        bio: user.bio || '',
        avatar_url: user.avatar_url || '',
        website: user.website || '',
        twitter: user.twitter || '',
        github: user.github || '',
      })
      
      // Load photos and updates
      loadPhotos()
      loadUpdates()
    }
  }, [user])

  const loadPhotos = async () => {
    if (!user?.id) return
    const result = await getProfilePhotos(user.id)
    setPhotos(result?.photos || [])
  }

  const loadUpdates = async () => {
    if (!user?.id) return
    const result = await getProfileUpdates(user.id)
    setUpdates(result?.updates || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      router.refresh()
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !photoUrl.trim()) return
    
    await uploadProfilePhoto(user.id, photoUrl.trim())
    setPhotoUrl('')
    loadPhotos()
  }

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !updateContent.trim()) return
    
    try {
      const result = await createProfileUpdate(user.id, updateContent.trim(), undefined, 'public')
      if (result?.success || result?.update) {
        setUpdateContent('')
        await loadUpdates()
      } else {
        console.error('Failed to post update')
      }
    } catch (error) {
      console.error('Error posting update:', error)
    }
  }

  const handleDeletePhoto = async (photoId: string) => {
    await deleteProfilePhoto(photoId)
    loadPhotos()
  }

  const handleDeleteUpdate = async (updateId: string) => {
    await deleteProfileUpdate(updateId)
    setUpdates(prev => prev.filter(u => u.id !== updateId))
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('builder')}
          className={`px-4 py-2 font-medium transition flex items-center gap-2 ${
            activeTab === 'builder'
              ? 'border-b-2 border-purple-500 text-purple-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Blocks className="h-4 w-4" />
          Builder
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'profile'
              ? 'border-b-2 border-purple-500 text-purple-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'photos'
              ? 'border-b-2 border-purple-500 text-purple-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Photos ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'updates'
              ? 'border-b-2 border-purple-500 text-purple-500'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Daily Updates ({updates.length})
        </button>
      </div>

      {/* Profile Builder Tab */}
      {activeTab === 'builder' && user && (
        <ProfileBuilder 
          userId={user.id} 
          initialProfileType={(user.profile_type as any) || 'personal'}
        />
      )}

      {/* Profile Info Tab */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">
                    {formData.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="avatar_url">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="https://example.com/avatar (.jpg, .png, .gif, .webp)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="@handle"
                  />
                </div>
                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="username"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadPhoto} className="space-y-3">
                <Input
                  type="url"
                  placeholder="Photo URL (.jpg, .png, .gif, .webp)"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={photosLoading || !photoUrl.trim()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </form>
            </CardContent>
          </Card>

          <ProfilePhotoGrid
            photos={photos}
            isOwn={true}
            onDelete={handleDeletePhoto}
          />
        </div>
      )}

      {/* Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Daily Update</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostUpdate} className="space-y-3">
                <Textarea
                  placeholder="What's on your mind today?"
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  className="min-h-24"
                />
                <Button
                  type="submit"
                  disabled={updatesLoading || !updateContent.trim()}
                  className="w-full bg-gradient-to-r from-cyan-400 to-purple-500"
                >
                  Post Update
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {updates.length > 0 ? (
              updates.map((update) => (
                <ProfileUpdateCard
                  key={update.id}
                  update={update}
                  currentUserId={user.id}
                  onDelete={() => handleDeleteUpdate(update.id)}
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No daily updates yet. Post one to get started!</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
