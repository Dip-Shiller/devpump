'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Zap, MessageSquare, Users, User, Newspaper, 
  Home, Bell
} from 'lucide-react'
export function AppNav() {
  const pathname = usePathname()
  const navLinks = [
    { href: '/feed', label: 'Feed', icon: <Newspaper className="w-4 h-4" /> },
    { href: '/teams', label: 'Teams', icon: <Users className="w-4 h-4" /> },
    { href: '/messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
    { href: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">DevPump</span>
          </Link>
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`gap-2 ${
                    pathname === link.href
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-sm cursor-pointer hover:scale-105 transition-transform">
              😎
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
