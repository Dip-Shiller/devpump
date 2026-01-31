'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/providers/wallet-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Settings, LogOut, User, Shield } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, isLoading, logout } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="space-y-4">
        <Link href="/profile">
          <Card className="bg-gray-900 border-gray-800 hover:border-purple-500 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-6">
              <User className="h-6 w-6 text-purple-400" />
              <div>
                <h3 className="text-white font-medium">Edit Profile</h3>
                <p className="text-gray-400 text-sm">Update your username, bio, and social links</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="flex items-center gap-4 p-6">
            <Shield className="h-6 w-6 text-cyan-400" />
            <div className="flex-1">
              <h3 className="text-white font-medium">Account Security</h3>
              <p className="text-gray-400 text-sm">
                {user.wallet_address
                  ? `Connected wallet: ${user.wallet_address.slice(0, 8)}...${user.wallet_address.slice(-6)}`
                  : `Email: ${user.email}`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-red-900/50">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <LogOut className="h-6 w-6 text-red-400" />
              <div>
                <h3 className="text-white font-medium">Sign Out</h3>
                <p className="text-gray-400 text-sm">Log out of your account</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500/10"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
