import { Search, Bell, User, Zap, Menu } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl blur group-hover:blur-lg transition-all duration-300" />
              <div className="relative bg-gradient-to-r from-purple-600 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">DevPump</h1>
              <p className="text-xs text-muted-foreground">Build • Connect • Grow</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/builders" className="text-sm font-medium hover:text-primary transition-colors">
            Builders
          </Link>
          <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
            Projects
          </Link>
          <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
            Jobs
          </Link>
          <Link href="/endorsements" className="text-sm font-medium hover:text-primary transition-colors">
            Endorsements
          </Link>
          <Link href="/learn" className="text-sm font-medium hover:text-primary transition-colors">
            Learn
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="search"
                placeholder="Search builders, projects..."
                className="pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </div>
          
          <Button variant="gradient" className="gap-2">
            <User className="h-4 w-4" />
            Connect Wallet
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}