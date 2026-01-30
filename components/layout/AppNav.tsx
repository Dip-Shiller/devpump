'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Briefcase, MessageSquare, Bell, User, Search, Menu, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WalletButton } from '@/components/wallet-button'
import { cn } from '@/lib/utils'

export function AppNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: '/builders', label: 'Builders', icon: Users },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0b]/60">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl blur group-hover:blur-lg transition-all duration-300" />
            <div className="relative bg-gradient-to-r from-purple-600 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              DevPump
            </h1>
            <p className="text-xs text-muted-foreground">Build • Connect • Grow</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
          </div>
          <WalletButton />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
