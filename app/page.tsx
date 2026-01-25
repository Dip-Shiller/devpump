'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Zap, Rocket, Shield, Eye, Target, Lock,
  ArrowRight, Search
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const coreValues = [
    { 
      icon: <Eye className="h-8 w-8" />, 
      title: 'Transparency', 
      description: 'Everything on-chain, verifiable by all',
      color: 'text-purple-400', 
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500'
    },
    { 
      icon: <Lock className="h-8 w-8" />, 
      title: 'Anonymity', 
      description: 'Your privacy is sacred to us',
      color: 'text-emerald-400', 
      borderColor: 'border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-500'
    },
    { 
      icon: <Target className="h-8 w-8" />, 
      title: 'Clarity', 
      description: 'Clear goals, honest communication',
      color: 'text-purple-400', 
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500'
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DevPump</span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/signup">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white rounded-xl px-6">
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32">
        <section className={`min-h-[70vh] flex flex-col items-center justify-center px-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              <span className="text-white">Welcome to</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                DevPump
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Where{' '}
              <span className="text-purple-400 font-semibold">Transparency</span>
              {' '}and{' '}
              <span className="text-emerald-400 font-semibold">Anonymity</span>
              {' '}meets{' '}
              <span className="text-purple-400 font-semibold">Clarity</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="group gap-3 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white shadow-[0_0_30px_rgba(153,69,255,0.3)] hover:shadow-[0_0_50px_rgba(153,69,255,0.5)] transition-all duration-300 hover:-translate-y-1 rounded-xl px-8 py-6 text-lg"
                >
                  <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group gap-3 border-2 border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5 text-white transition-all duration-300 hover:-translate-y-1 rounded-xl px-8 py-6 text-lg"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Meet the Community
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-16" />

        {/* Our Promise Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-purple-400 font-medium mb-3 tracking-wide uppercase text-sm">Our Promise</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Built on principles that matter
              </h2>
            </div>
            
            {/* Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <Card 
                  key={index} 
                  className={`bg-[#111113] ${value.borderColor} ${value.hoverBorder} hover:bg-[#161618] transition-all duration-300 cursor-default group`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${value.color} mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-white">{value.title}</h3>
                    <p className="text-zinc-500">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Why DevPump Section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-emerald-400 font-medium mb-3 tracking-wide uppercase text-sm">Why DevPump?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Everything you need to thrive
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              No gatekeeping. No popularity contests. Just a welcoming space where your work speaks for itself. 
              Ready to build something amazing?
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-6 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DevPump</span>
              </div>
              
              {/* Links */}
              <div className="flex items-center gap-8 text-sm text-zinc-500">
                {['Discord', 'Twitter', 'GitHub', 'Docs'].map((link) => (
                  <a 
                    key={link} 
                    href="#" 
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                ))}
              </div>
              
              {/* Built on Solana */}
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Shield className="h-4 w-4 text-purple-400" />
                Built on Solana
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
