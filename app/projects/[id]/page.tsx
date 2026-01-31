'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Globe, Github } from 'lucide-react'
import type { Project, User } from '@/lib/supabase'

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [owner, setOwner] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchProject(params.id as string)
    }
  }, [params.id])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data.project)
        if (data.project?.owner_id) {
          fetchOwner(data.project.owner_id)
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOwner = async (ownerId: string) => {
    try {
      const response = await fetch(`/api/users/${ownerId}`)
      if (response.ok) {
        const data = await response.json()
        setOwner(data.user)
      }
    } catch (error) {
      console.error('Error fetching owner:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Project not found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl text-white mb-2">{project.name}</CardTitle>
              <div className="flex gap-2">
                {project.category && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500">
                    {project.category}
                  </Badge>
                )}
                {project.status && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500">
                    {project.status}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {project.website && (
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </Button>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </a>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {project.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
              <p className="text-gray-200 whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {owner && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Created by</h3>
              <Link href={`/builders/${owner.id}`}>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                  <Avatar>
                    <AvatarImage src={owner.avatar_url || undefined} />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {owner.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{owner.display_name || owner.username}</p>
                    <p className="text-gray-400 text-sm">@{owner.username}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
