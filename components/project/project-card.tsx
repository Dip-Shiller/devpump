import { Clock, Users, Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
interface Project {
  id: string
  title: string
  description: string
  status: 'active' | 'planning' | 'completed'
  teamSize: number
  skills: string[]
  timeline: string
  progress: number
  isFeatured: boolean
}
interface ProjectCardProps {
  project: Project
}
export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-500/20 text-green-400 border-green-500/30',
    planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }
  const statusLabels = {
    active: 'Active',
    planning: 'Planning',
    completed: 'Completed',
  }
  const teamColors = [
    'bg-purple-500',
    'bg-cyan-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
  ]
  return (
    <div className="group relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(20,241,149,0.2)] hover:-translate-y-2 overflow-hidden">
      {/* Featured Badge */}
      {project.isFeatured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-xs font-bold text-white shadow-lg">
            <Star className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 blur-xl" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{project.timeline}</span>
          </div>
        </div>
        
        {/* Title & Description */}
        <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-6 line-clamp-2">{project.description}</p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.skills.map((skill) => (
            <span 
              key={skill} 
              className="px-2 py-1 rounded-lg text-xs bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-cyan-300"
            >
              {skill}
            </span>
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-cyan-400 font-semibold">{project.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000 ease-out group-hover:shadow-[0_0_20px_rgba(20,241,149,0.5)]"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {/* Team Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(project.teamSize, 4) }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full ${teamColors[i % teamColors.length]} border-2 border-background transition-transform hover:scale-110 hover:z-10`}
                />
              ))}
              {project.teamSize > 4 && (
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-xs font-medium">
                  +{project.teamSize - 4}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{project.teamSize}</span>
            </div>
          </div>
          
          {/* Apply Button */}
          <Button 
            size="sm" 
            className="gap-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:text-white hover:border-purple-400/50 transition-all duration-300 group/btn"
          >
            Apply
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
