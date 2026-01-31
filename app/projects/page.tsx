'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Folder, Plus, ExternalLink } from 'lucide-react'
import { useWallet } from '@/providers/wallet-provider'
import type { Project } from '@/lib/supabase'

export default function ProjectsPage() {
  const { user } = useWallet()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) =>
    project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Folder className="h-8 w-8 text-purple-500" />
          <h1 className="text-3xl font-bold text-white">Projects</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {user && (
            <Link href="/projects/new">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
          )}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 mb-4">No projects found</p>
          {user && (
            <Link href="/projects/new">
              <Button variant="outline" className="border-purple-500 text-purple-400">
                Create the first project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-white">{project.title}</CardTitle>
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-purple-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4">{project.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {project.category && (
                      <Badge variant="outline" className="border-cyan-500 text-cyan-400">
                        {project.category}
                      </Badge>
                    )}
                    {project.status && (
                      <Badge variant="outline" className="border-purple-500 text-purple-400">
                        {project.status}
                      </Badge>
                    )}
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
