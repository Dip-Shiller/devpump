import { Calendar, Users, Target, Zap, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    status: 'active' | 'completed' | 'planning'
    teamSize: number
    skills: string[]
    timeline: string
    progress: number
    isFeatured: boolean
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    planning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  }

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      {/* Featured Badge */}
      {project.isFeatured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
            <Zap className="h-3 w-3" />
            Featured
          </div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <Badge 
          variant="outline" 
          className={`${statusColors[project.status]} font-medium`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
      </div>

      {/* Project Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Progress Bar (only for active projects) */}
      {project.status === 'active' && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 4).map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="text-xs font-medium"
            >
              {skill}
            </Badge>
          ))}
          {project.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.skills.length - 4}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{project.teamSize} team members</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{project.timeline}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 gap-2">
          <Target className="h-4 w-4" />
          View Details
        </Button>
        <Button variant="outline" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
