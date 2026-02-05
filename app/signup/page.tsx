'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/providers/wallet-provider'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import {
  Zap, Wallet, Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Github, Chrome, Shield, Sparkles,
  Check, Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { connected, connecting } = useWallet()
  const { setVisible: setWalletModalVisible } = useWalletModal()

  const [authMethod, setAuthMethod] = useState<'wallet' | 'email'>('wallet')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.push('/feed')
    }
  }, [authLoading, isAuthenticated, user, router])

  const handleWalletConnect = () => {
    setWalletModalVisible(true)
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      if (data.user) {
        localStorage.setItem('devpump_user', JSON.stringify(data.user))
        // Full page refresh to update auth context
        window.location.href = '/feed'
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const wallets = [
    { name: 'Phantom', icon: '👻', popular: true },
    { name: 'Solflare', icon: '🌞', popular: true },
    { name: 'Backpack', icon: '🎒', popular: false },
    { name: 'Ledger', icon: '🔐', popular: false },
  ]

  const benefits = [
    'Build your pseudonymous reputation',
    'Showcase on-chain contributions',
    'Connect with elite builders',
    'Find dream team opportunities'
  ]

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900/20 via-background to-cyan-900/20 p-12 flex-col justify-between overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">DevPump</span>
            <Badge variant="glow">ALPHA</Badge>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Welcome to the
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                builder revolution
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join thousands of Solana developers building the future together. 🚀
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-muted-foreground group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="group-hover:text-white transition-colors">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-green-400" />
          Your privacy is our priority. Stay pseudonymous, always.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DevPump</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Create your account</h2>
            <p className="text-muted-foreground">
              Choose how you'd like to join the community ✨
            </p>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex bg-card/50 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setAuthMethod('wallet')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                authMethod === 'wallet'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              Wallet
            </button>
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                authMethod === 'email'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                  : 'text-muted-foreground hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {authMethod === 'wallet' ? (
            /* Wallet Connection */
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Connect your Solana wallet to get started instantly 🔐
              </p>

              {connected ? (
                <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400">Wallet connected! Creating account...</p>
                </div>
              ) : connecting ? (
                <div className="text-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500 mx-auto mb-2" />
                  <p className="text-muted-foreground">Connecting wallet...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.name}
                      onClick={handleWalletConnect}
                      className="group relative flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 cursor-pointer"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{wallet.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{wallet.name}</div>
                        {wallet.popular && (
                          <div className="text-xs text-cyan-400">Popular</div>
                        )}
                      </div>
                      {wallet.popular && (
                        <Sparkles className="absolute top-2 right-2 w-3 h-3 text-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <Chrome className="w-4 h-4" />
                  Google
                </Button>
              </div>
            </div>
          ) : (
            /* Email/Password Form */
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="satoshi_builder"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/50 border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-muted-foreground">This will be your public identity</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/50 border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-card/50 border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/50 border border-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(153,69,255,0.3)] hover:shadow-[0_0_50px_rgba(153,69,255,0.5)] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{' '}
            <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
          </p>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="text-cyan-400 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
