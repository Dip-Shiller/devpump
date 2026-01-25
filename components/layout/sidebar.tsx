import { Home, Users, FolderKanban, Briefcase, Award, TrendingUp, Settings, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Users className="h-5 w-5" />, label: 'Builders', href: '/builders', count: 24 },
    { icon: <FolderKanban className="h-5 w-5" />, label: 'Projects', href: '/projects', count: 18 },
    { icon: <Briefcase className="h-5 w-5" />, label: 'Jobs', href: '/jobs', count: 42 },
    { icon: <Award className="h-5 w-5" />, label: 'Endorsements', href: '/endorsements' },
    { icon: <TrendingUp className="h-5 w-5" />, label: 'Analytics', href: '/analytics' },
  ]

  const bottomItems = [
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', href: '/settings' },
    { icon: <HelpCircle className="h-5 w-5" />, label: 'Help & Support', href: '/help' },
  ]

  return (
    <div className="sticky top-24 space-y-8">
      {/* Profile Summary */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            YB
          </div>
          <div>
            <h3 className="font-semibold">Your Profile</h3>
            <p className="text-sm text-muted-foreground">Beginner Builder</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reputation</span>
            <span className="font-semibold">--</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Projects</span>
            <span className="font-semibold">0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Endorsements</span>
            <span className="font-semibold">0</span>
          </div>
        </div>
        
        <Button className="w-full mt-6" variant="outline">
          Complete Profile
        </Button>
      </div>

      {/* Navigation */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground group-hover:text-primary">
                  {item.icon}
                </span>
                {item.label}
              </div>
              {item.count && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium transition-colors group"
            >
              <span className="text-muted-foreground group-hover:text-primary">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h4 className="font-semibold mb-4">Quick Stats</h4>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Active Builders</span>
              <span className="font-semibold">1,234</span>
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full w-3/4" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Open Projects</span>
              <span className="font-semibold">567</span>
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}