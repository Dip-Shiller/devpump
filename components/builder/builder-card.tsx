import { Award, MapPin, Briefcase } from 'lucide-react'

interface Builder {
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

interface BuilderCardProps {
  builder: Builder
}

export function BuilderCard({ builder }: BuilderCardProps) {
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
    'from-green-500 to-emerald-500',
  ]
  
  const randomGradient = gradients[parseInt(builder.id) % gradients.length]
  
  return (
    <div className="group relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(153,69,255,0.25)] hover:-translate-y-2 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${randomGradient} flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {builder.username[0].toUpperCase()}
            </div>
            {builder.isAvailable && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold flex items-center gap-2 truncate">
              <span className="truncate">{builder.username}</span>
              {builder.isVerified && (
                <Award className="w-5 h-5 text-cyan-400 flex-shrink-0 animate-pulse" />
              )}
            </div>
            <div className="text-sm text-muted-foreground truncate">{builder.title}</div>
          </div>
        </div>

        {/* Location */}
        {builder.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{builder.location}</span>
          </div>
        )}
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {builder.skills.slice(0, 4).map((skill) => (
            <span 
              key={skill} 
              className="px-2 py-1 rounded-lg text-xs bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-cyan-300 hover:border-cyan-400/50 transition-colors cursor-default"
            >
              {skill}
            </span>
          ))}
          {builder.skills.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-xs bg-white/5 text-muted-foreground">
              +{builder.skills.length - 4}
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-bold">{builder.projects}</span> projects
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
            <span className="text-muted-foreground">
              <span className="text-cyan-400 font-bold">{builder.reputation}</span> rep
            </span>
          </div>
        </div>

        {/* Endorsements Badge */}
        {builder.endorsements > 100 && (
          <div className="absolute top-4 right-4">
            <div className="px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs font-medium text-cyan-300">
              🔥 {builder.endorsements}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
