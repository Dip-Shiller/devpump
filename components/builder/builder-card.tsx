import { MapPin, Briefcase, Star, CheckCircle, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface BuilderCardProps {
  builder: {
    id: string
    username: string
    title: string
    location: string
    reputation: number
    skills: string[]
    projects: number
    endorsements: number
    isAvailable: boolean
    isVerified: boolean
  }
}

export function BuilderCard({ builder }: BuilderCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
      {/* Verified Badge */}
      {builder.isVerified && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Verified
          </div>
        </div>
      )}

      {/* Availability Indicator */}
      <div className="absolute top-4 left-4">
        <div className={`w-3 h-3 rounded-full ${builder.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Builder Avatar & Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {builder.username.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold">{builder.username}</h3>
              <p className="text-muted-foreground text-sm">{builder.title}</p>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-bold">{builder.reputation}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {builder.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              {builder.projects} projects
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {builder.skills.slice(0, 4).map((skill) => (
            <Badge 
              key={skill} 
              className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
            >
              {skill}
            </Badge>
          ))}
          {builder.skills.length > 4 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{builder.skills.length - 4}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-secondary/50 rounded-xl">
          <div className="text-2xl font-bold text-primary">{builder.projects}</div>
          <div className="text-xs text-muted-foreground">Projects</div>
        </div>
        <div className="text-center p-4 bg-secondary/50 rounded-xl">
          <div className="text-2xl font-bold text-primary">{builder.endorsements}</div>
          <div className="text-xs text-muted-foreground">Endorsements</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="flex-1 gap-2">
          View Profile
        </Button>
        <Button variant="outline" size="icon">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}