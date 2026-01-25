'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Zap, Users, Rocket, 
  Code, Shield, Globe, Sparkles,
  MessageSquare, Plus, Heart,
  Eye, Target, Lock, ChevronRight,
  Briefcase, UserPlus, FileText,
  ArrowRight, Layers, Search,
  Star, Coffee, Lightbulb, Handshake,
  GraduationCap, Trophy, Flame
} from 'lucide-react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Stay Pseudonymous',
      description: 'Your identity, your rules. Build an amazing reputation without revealing who you are. Let your code do the talking! 🎭',
      gradient: 'from-purple-500 to-pink-500',
      emoji: '🔐'
    },
    {
      icon: <Code className="h-7 w-7" />,
      title: 'Prove Your Skills',
      description: 'Show off your deployed contracts, tokens, and contributions. Everything verifiable on-chain—no fluff, just facts. ✨',
      gradient: 'from-cyan-500 to-blue-500',
      emoji: '💻'
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: 'Get Endorsed',
      description: 'Earn trust through peer endorsements. When builders vouch for you, everyone notices. Build your web of trust! 🤝',
      gradient: 'from-pink-500 to-rose-500',
      emoji: '⭐'
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: 'Go Global',
      description: 'Connect with amazing builders from every corner of the world. Your next co-founder might be a timezone away! 🌍',
      gradient: 'from-yellow-500 to-orange-500',
      emoji: '🚀'
    }
  ]

  const coreValues = [
    { 
      icon: <Eye className="h-6 w-6" />, 
      title: 'Transparency', 
      description: 'Everything on-chain, verifiable by all',
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/20',
      hoverBorder: 'hover:border-purple-500/50'
    },
    { 
      icon: <Lock className="h-6 w-6" />, 
      title: 'Anonymity', 
      description: 'Your privacy is sacred to us',
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-500/50'
    },
    { 
      icon: <Target className="h-6 w-6" />, 
      title: 'Clarity', 
      description: 'Clear goals, honest communication',
      color: 'text-pink-400', 
      bg: 'bg-pink-500/10', 
      border: 'border-pink-500/20',
      hoverBorder: 'hover:border-pink-500/50'
    },
  ]

  const platformSections = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: 'Build Your Profile',
      tagline: 'Your professional home in Web3',
      description: 'Create a stunning pseudonymous profile that showcases your journey, skills, and achievements. This is where your story begins! 🌟',
      cta: 'Create Profile',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Showcase your skills & expertise', 'Track your building journey', 'Display on-chain contributions', 'Collect peer endorsements']
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Form Dream Teams',
      tagline: 'Great things are built together',
      description: 'Find your tribe! Create or join teams of passionate builders. Together, you can tackle bigger challenges and ship faster. 🚀',
      cta: 'Explore Teams',
      gradient: 'from-cyan-500 to-blue-500',
      features: ['Build team profiles', 'Define roles & responsibilities', 'Track project milestones', 'Share collective reputation']
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: 'Launch Projects',
      tagline: 'From idea to reality',
      description: 'Got a brilliant idea? Share it with the world! Find contributors, gather feedback, and watch your vision come to life. 💡',
      cta: 'Post Project',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Showcase your projects', 'Recruit talented builders', 'Share progress updates', 'Get community feedback']
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'Learn & Share',
      tagline: 'Knowledge grows when shared',
      description: 'Ask questions, share wisdom, help others grow. Every answer you give builds your reputation as a helpful community member. 📚',
      cta: 'Join Discussions',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Ask technical questions', 'Share your expertise', 'Earn reputation for helping', 'Build knowledge base']
    }
  ]

  const welcomeMessages = [
    { icon: <Coffee className="h-5 w-5" />, text: "Whether you're a seasoned dev or just starting out" },
    { icon: <Lightbulb className="h-5 w-5" />, text: "Got ideas? We want to hear them" },
    { icon: <Handshake className="h-5 w-5" />, text: "Looking for collaborators? You'll find them here" },
    { icon: <GraduationCap className="h-5 w-5" />, text: "Want to learn? Our community loves teaching" },
  ]

  return (
    <div className="relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/5 rounded-full blur-[200px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="min-h-[95vh] flex items-center justify-center py-20 px-6">
        <div className={`max-w-5xl mx-auto text-center space-y-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 px-6 py-3 rounded-full text-sm animate-bounce" style={{ animationDuration: '2s' }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-muted-foreground">Welcome to the future of Web3 careers</span>
            <Badge variant="glow" className="ml-1">Alpha</Badge>
          </div>
          
          {/* Main Headline */}
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              <span className="inline-block hover:scale-105 transition-transform cursor-default">The</span>{' '}
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-default animate-gradient bg-[length:200%_auto]">
                LinkedIn
              </span>
              {' '}<span className="inline-block hover:scale-105 transition-transform cursor-default">for</span>
              <br />
              <span className="inline-block bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform cursor-default animate-gradient bg-[length:200%_auto]" style={{ animationDelay: '0.5s' }}>
                Solana
              </span>
              {' '}<span className="inline-block hover:scale-105 transition-transform cursor-default">Builders</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hey there, builder! 👋 Ready to showcase your work, find your dream team, and grow your reputation? 
              Do it all while staying{' '}
              <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-default">completely pseudonymous</span>.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="xl" 
              className="group gap-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_40px_rgba(153,69,255,0.4)] hover:shadow-[0_0_60px_rgba(153,69,255,0.6)] transition-all duration-500 hover:-translate-y-2 rounded-2xl"
            >
              <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Start Your Journey
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="group gap-3 border-2 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-500 hover:-translate-y-2 rounded-2xl"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Meet the Community
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8">
            {[
              { value: '2,500+', label: 'Builders', gradient: 'from-purple-400 to-pink-400', icon: <Users className="h-4 w-4" /> },
              { value: '450+', label: 'Projects', gradient: 'from-cyan-400 to-emerald-400', icon: <Briefcase className="h-4 w-4" /> },
              { value: '$12M+', label: 'Earned', gradient: 'from-pink-400 to-purple-400', icon: <Trophy className="h-4 w-4" /> },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center group cursor-default"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2 group-hover:text-white transition-colors">
                  {stat.icon}
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WELCOME MESSAGE ===== */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(153,69,255,0.4)] animate-pulse">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">We built this for you 💜</h2>
                  <p className="text-muted-foreground text-lg">A home for every Solana builder, no matter where you are in your journey.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {welcomeMessages.map((msg, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all duration-300 cursor-default group"
                  >
                    <div className="text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all">
                      {msg.icon}
                    </div>
                    <span className="text-muted-foreground group-hover:text-white transition-colors">{msg.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ===== CORE VALUES ===== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-4">Our Promise</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Built on principles that matter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <Card 
                key={index} 
                className={`${value.bg} ${value.border} ${value.hoverBorder} hover:scale-105 transition-all duration-500 cursor-default group overflow-hidden`}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${value.color} mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ===== WHY DEVPUMP ===== */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Badge variant="gradient" className="mb-4">Why DevPump?</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                thrive
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              No gatekeeping. No popularity contests. Just a welcoming space where your work speaks for itself. 
              Ready to build something amazing? 🚀
            </p>
          </div>
          
          {/* Features Grid with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`group hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(153,69,255,0.15)] overflow-hidden ${activeFeature === index ? 'border-purple-500/50 shadow-[0_0_40px_rgba(153,69,255,0.2)]' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-8 relative">
                  {/* Animated background on active */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                        <span className="text-white">{feature.icon}</span>
                      </div>
                      <span className="text-3xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{feature.emoji}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ===== PLATFORM SECTIONS ===== */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Badge variant="info" className="mb-4">Platform Features</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Your complete{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                builder toolkit
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Everything you need in one place. Build your profile, form teams, launch projects, and grow together. 
              We've got you covered! 🛠️
            </p>
          </div>

          {/* Platform Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platformSections.map((section, index) => (
              <Card 
                key={index}
                className="group hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(153,69,255,0.1)] overflow-hidden"
              >
                <CardContent className="p-10 relative">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      <span className="text-white">{section.icon}</span>
                    </div>
                    
                    <Badge variant="outline" className="mb-4">{section.tagline}</Badge>
                    <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">{section.description}</p>
                    
                    {/* Feature List */}
                    <ul className="space-y-3 mb-8">
                      {section.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${section.gradient} group-hover:scale-150 transition-transform`} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      variant="outline" 
                      className="gap-2 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-xl group/btn"
                    >
                      {section.cta}
                      <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ===== BUILDERS PREVIEW (Empty State) ===== */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <Badge variant="purple" className="mb-4">Community</Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Meet the{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Builders
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">Talented developers ready to create the future 🌟</p>
            </div>
            <Button variant="outline" className="gap-2 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-xl">
              <Users className="h-4 w-4" />
              View All Builders
            </Button>
          </div>

          {/* Empty State Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card 
                key={i}
                className="border-dashed hover:border-purple-500/30 transition-all duration-500 group cursor-pointer"
              >
                <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[280px]">
                  <Avatar className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-2xl">?</AvatarFallback>
                  </Avatar>
                  <div className="h-4 w-32 bg-white/5 rounded mb-2 group-hover:bg-purple-500/20 transition-colors" />
                  <div className="h-3 w-24 bg-white/5 rounded mb-6 group-hover:bg-purple-500/10 transition-colors" />
                  <div className="flex gap-2">
                    <Badge variant="outline" className="opacity-50">Skill</Badge>
                    <Badge variant="outline" className="opacity-50">Skill</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    This could be you! ✨
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Be among the first to join our community of builders</p>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-xl shadow-[0_0_30px_rgba(153,69,255,0.3)] hover:shadow-[0_0_50px_rgba(153,69,255,0.5)] hover:-translate-y-1 transition-all duration-300">
              <Plus className="h-4 w-4" />
              Create Your Profile
            </Button>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ===== PROJECTS PREVIEW (Empty State) ===== */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <Badge variant="info" className="mb-4">Projects</Badge>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Active{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">Find your next big opportunity 🚀</p>
            </div>
            <Button variant="outline" className="gap-2 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-xl">
              <Briefcase className="h-4 w-4" />
              View All Projects
            </Button>
          </div>

          {/* Empty State Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card 
                key={i}
                className="border-dashed hover:border-cyan-500/30 transition-all duration-500 group cursor-pointer"
              >
                <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 mb-6 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <Flame className="h-8 w-8 text-cyan-400/50" />
                  </div>
                  <div className="h-5 w-48 bg-white/5 rounded mb-3 group-hover:bg-cyan-500/20 transition-colors" />
                  <div className="h-3 w-64 bg-white/5 rounded mb-2" />
                  <div className="h-3 w-56 bg-white/5 rounded mb-6" />
                  <div className="flex gap-2 mb-6">
                    <Badge variant="outline" className="opacity-50">Tech</Badge>
                    <Badge variant="outline" className="opacity-50">Stack</Badge>
                    <Badge variant="outline" className="opacity-50">Here</Badge>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-0 bg-gradient-to-r from-cyan-500 to-emerald-500 group-hover:w-1/3 transition-all duration-1000" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    Your project could be here! 💡
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Have an idea? Share it with the community!</p>
            <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 rounded-xl shadow-[0_0_30px_rgba(20,241,149,0.3)] hover:shadow-[0_0_50px_rgba(20,241,149,0.5)] hover:-translate-y-1 transition-all duration-300">
              <Plus className="h-4 w-4" />
              Post Your Project
            </Button>
          </div>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ===== CTA SECTION ===== */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-12">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 animate-pulse shadow-[0_0_60px_rgba(153,69,255,0.5)]" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Zap className="h-12 w-12 text-white" />
            </div>
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ready to start your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              builder journey
            </span>
            ?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join a community that celebrates every builder. Whether you're shipping your first line of code 
            or your hundredth project, there's a place for you here. Let's build the future together! 🌟
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="group gap-3 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_50px_rgba(153,69,255,0.4)] hover:shadow-[0_0_80px_rgba(153,69,255,0.6)] transition-all duration-500 hover:-translate-y-2 rounded-2xl"
            >
              <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Create Your Profile
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="gap-3 border-2 border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <FileText className="h-5 w-5" />
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              Secure & Private
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              Community Driven
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-400" />
              Built on Solana
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all">DevPump</span>
              <Badge variant="glow">ALPHA</Badge>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              {['Discord', 'Twitter', 'GitHub', 'Docs'].map((link) => (
                <a 
                  key={link} 
                  href="#" 
                  className="hover:text-white transition-colors hover:-translate-y-0.5 transition-transform"
                >
                  {link}
                </a>
              ))}
            </div>
            
            {/* Made with love */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 text-pink-500 animate-pulse" /> on Solana
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
