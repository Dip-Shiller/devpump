'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AppNav } from '@/components/layout/app-nav'
import { 
  Zap, MapPin, Calendar, Link as LinkIcon, Github, Twitter,
  Globe, Edit3, Settings, Share2, Shield, Award, Star,
  Briefcase, Code, Users, MessageSquare, Heart, Eye,
  ChevronRight, Plus, ExternalLink, Copy, Check,
  TrendingUp, Target, Sparkles, Clock, BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://devpump.io/u/solana_builder')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Code className="w-4 h-4" /> },
    { id: 'experience', label: 'Experience', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'endorsements', label: 'Endorsements', icon: <Heart className="w-4 h-4" /> },
  ]

  const skills = [
    { name: 'Rust', level: 95, endorsements: 48 },
    { name: 'Anchor', level: 92, endorsements: 41 },
    { name: 'TypeScript', level: 88, endorsements: 35 },
    { name: 'React', level: 85, endorsements: 29 },
    { name: 'Solana', level: 90, endorsements: 52 },
    { name: 'Smart Contracts', level: 87, endorsements: 38 },
  ]

  const achievements = [
    { icon: '🏆', title: 'Top Builder', description: 'Top 1% of builders' },
    { icon: '🔥', title: 'Streak Master', description: '30 day contribution streak' },
    { icon: '💎', title: 'Diamond Hands', description: 'Early adopter badge' },
    { icon: '🌟', title: 'Rising Star', description: 'Fastest growing reputation' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0b] pb-20">
      <AppNav />
      
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-900/50 via-purple-800/30 to-emerald-900/50 overflow-hidden mt-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        {/* Edit Cover Button */}
        <button className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-sm hover:bg-black/70 transition-all">
          <Edit3 className="w-4 h-4" />
          Edit Cover
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-1 shadow-[0_0_40px_rgba(153,69,255,0.3)]">
              <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                <span className="text-5xl md:text-6xl">👨‍💻</span>
              </div>
            </div>
            <button className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
              <Edit3 className="w-5 h-5 text-white" />
            </button>
            
            {/* Online Status */}
            <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-background">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold">solana_builder</h1>
                  <Badge variant="glow" className="gap-1">
                    <Award className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground">Senior Solana Developer</p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyLink}>
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-500">
                  <Users className="w-4 h-4" />
                  Connect
                </Button>
              </div>
            </div>

            {/* Bio */}
            <p className="text-muted-foreground max-w-2xl leading-relaxed">
              Building the future of DeFi on Solana 🚀 Core contributor to multiple protocols. 
              Passionate about creating secure, scalable smart contracts. Always open to collaborate 
              on innovative projects. Let's build something amazing together! ✨
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Remote, Worldwide
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined March 2024
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Available for work
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {[
            { label: 'Reputation', value: '98', icon: <Star className="w-5 h-5 text-yellow-400" />, color: 'from-yellow-500/20 to-orange-500/20' },
            { label: 'Projects', value: '24', icon: <Briefcase className="w-5 h-5 text-purple-400" />, color: 'from-purple-500/20 to-pink-500/20' },
            { label: 'Endorsements', value: '156', icon: <Heart className="w-5 h-5 text-pink-400" />, color: 'from-pink-500/20 to-rose-500/20' },
            { label: 'Connections', value: '342', icon: <Users className="w-5 h-5 text-cyan-400" />, color: 'from-cyan-500/20 to-blue-500/20' },
            { label: 'Views', value: '2.4K', icon: <Eye className="w-5 h-5 text-green-400" />, color: 'from-green-500/20 to-emerald-500/20' },
          ].map((stat, index) => (
            <Card key={index} className={`bg-gradient-to-br ${stat.color} border-white/10 hover:border-white/20 transition-all cursor-default group`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border-b-2 border-purple-500'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    About
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Hey there! 👋 I'm a passionate Solana developer with 5+ years of experience in 
                  blockchain development. I specialize in building DeFi protocols, NFT platforms, 
                  and complex smart contract systems.
                  <br /><br />
                  My journey in Web3 started in 2019, and since then I've contributed to multiple 
                  successful projects in the Solana ecosystem. I believe in building secure, 
                  efficient, and user-friendly applications that push the boundaries of what's 
                  possible in decentralized finance.
                  <br /><br />
                  When I'm not coding, you can find me mentoring new developers, contributing to 
                  open-source projects, or exploring the latest innovations in the crypto space. 
                  Always open to interesting conversations and collaboration opportunities! 🚀
                </p>
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    Featured Projects
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      title: 'SolSwap DEX',
                      description: 'Decentralized exchange with concentrated liquidity',
                      role: 'Lead Developer',
                      status: 'Live',
                      tech: ['Rust', 'Anchor', 'React'],
                    },
                    {
                      title: 'NFT Launchpad',
                      description: 'Fair launch platform for NFT collections',
                      role: 'Core Contributor',
                      status: 'Live',
                      tech: ['Solana', 'TypeScript', 'Next.js'],
                    },
                    {
                      title: 'Yield Aggregator',
                      description: 'Auto-compounding yield optimization protocol',
                      role: 'Smart Contract Dev',
                      status: 'Beta',
                      tech: ['Rust', 'Anchor', 'Python'],
                    },
                  ].map((project, index) => (
                    <div 
                      key={index}
                      className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold group-hover:text-purple-400 transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                        <Badge variant={project.status === 'Live' ? 'success' : 'warning'}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{project.role}</Badge>
                          <div className="flex gap-1">
                            {project.tech.map((t) => (
                              <span key={t} className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-400" />
                    Skills & Expertise
                  </h3>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Heart className="w-3 h-3" />
                            {skill.endorsements}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(153,69,255,0.5)]"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Achievements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all cursor-default text-center group"
                    >
                      <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">{achievement.icon}</span>
                      <div className="text-sm font-medium">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* On-Chain Activity */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  On-Chain Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Contracts Deployed', value: '47' },
                    { label: 'Transactions', value: '1,234' },
                    { label: 'Programs Created', value: '12' },
                    { label: 'Total Value Locked', value: '$2.4M' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-bold text-cyan-400">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View on Explorer
                </Button>
              </CardContent>
            </Card>

            {/* Similar Builders */}
            <Card className="border-white/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  Similar Builders
                </h3>
                <div className="space-y-3">
                  {['web3wizard', 'defidev', 'rustacean'].map((user, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-lg">
                        {user[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-purple-400 transition-colors">{user}</div>
                        <div className="text-xs text-muted-foreground">Solana Developer</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
