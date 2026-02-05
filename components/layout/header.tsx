'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useWallet } from '@/providers/wallet-provider'
import { useRealtimeNotifications } from '@/hooks/use-realtime'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, User, Settings, LogOut, Folder } from 'lucide-react'

export function Header() {
  const { user, isLoading, logout } = useWallet()
  const router = useRouter()
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only mount on client to avoid SSR issues with realtime
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only use realtime when mounted on client and user exists
  useRealtimeNotifications({
    userId: mounted && user?.id ? user.id : '',
    onNewNotification: () => {
      setHasNewNotification(true)
    },
  })

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              DevPump
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/builders" className="text-gray-400 hover:text-white transition-colors">
              Builders
            </Link>
            <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
              Projects
            </Link>
            <Link href="/feed" className="text-gray-400 hover:text-white transition-colors">
              Feed
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-10 rounded-full bg-gray-800 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                onClick={() => setHasNewNotification(false)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-300" />
                {hasNewNotification && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-purple-600 text-white">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-purple-600 text-white text-sm">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">
                        {user.display_name || user.username}
                      </span>
                      <span className="text-xs text-gray-400">@{user.username}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
                    <Link href="/projects">
                      <Folder className="mr-2 h-4 w-4" />
                      My Projects
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-gray-300 focus:bg-gray-800 focus:text-white cursor-pointer">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:bg-gray-800 focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/signin">
                <Button variant="ghost" className="text-gray-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}