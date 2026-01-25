import { BuilderCard } from '@/components/builder/builder-card'
import { ProjectCard } from '@/components/project/project-card'
import { Button } from '@/components/ui/button'
import { 
  Zap, Users, TrendingUp, Rocket, 
  Code, Shield, Globe, Sparkles,
  MessageSquare, Plus, ChevronUp, ChevronDown,
  Eye, EyeOff, Target, Award, GitBranch,
  Layers, Lock, Unlock, UserPlus, Send
} from 'lucide-react'
export default function Home() {
  const featuredBuilders = [
    {
      id: '1',
      username: 'solanabuilder',
      title: 'Senior Solana Developer',
      location: 'Remote',
      reputation: 98,
      skills: ['Rust', 'Anchor', 'TypeScript', 'Solana', 'Web3'],
      projects: 24,
      endorsements: 156,
      isAvailable: true,
      isVerified: true
    },
    {
      id: '2',
      username: 'web3wizard',
      title: 'Full-Stack Web3 Engineer',
      location: 'San Francisco, CA',
      reputation: 92,
      skills: ['React', 'Next.js', 'Solidity', 'EVM', 'GraphQL'],
      projects: 18,
      endorsements: 89,
      isAvailable: false,
      isVerified: true
    },
    {
      id: '3',
      username: 'defidev',
      title: 'DeFi Protocol Architect',
      location: 'Singapore',
      reputation: 95,
      skills: ['Rust', 'Security', 'DeFi', 'Smart Contracts', 'ZK'],
      projects: 32,
      endorsements: 210,
      isAvailable: true,
      isVerified: true
    },
    {
      id: '4',
      username: 'cryptodao',
      title: 'DAO Contributor & Developer',
      location: 'Lisbon, Portugal',
      reputation: 88,
      skills: ['Governance', 'TypeScript', 'DAO', 'Community'],
      projects: 15,
      endorsements: 67,
      isAvailable: true,
      isVerified: false
    }
  ]
  const featuredProjects = [
    {
      id: '1',
      title: 'Decentralized Exchange on Solana',
      description: 'Building a next-generation DEX with concentrated liquidity and advanced trading features.',
      status: 'active' as const,
      teamSize: 5,
      skills: ['Rust', 'Anchor', 'React', 'TypeScript'],
      timeline: '3 months',
      progress: 65,
      isFeatured: true
    },
    {
      id: '2',
      title: 'NFT Marketplace Platform',
      description: 'Multi-chain NFT marketplace with social features and creator tools.',
      status: 'active' as const,
      teamSize: 8,
      skills: ['Next.js', 'GraphQL', 'Solidity', 'IPFS'],
      timeline: '6 months',
      progress: 40,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Web3 Social Media Protocol',
      description: 'Decentralized social media platform with on-chain reputation and content monetization.',
      status: 'planning' as const,
      teamSize: 3,
      skills: ['Rust', 'IPFS', 'React Native', 'Ceramic'],
      timeline: '9 months',
      progress: 10,
      isFeatured: true
    }
  ]
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Pseudonymous Identity',
      description: 'Build reputation without revealing personal information. Your work speaks for itself.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'On-Chain Portfolio',
      description: 'Showcase deployed contracts, tokens, and real contributions that anyone can verify.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Peer Endorsements',
      description: 'Get verified by other builders. Signed attestations that build real trust.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Network',
      description: 'Connect with builders worldwide. Find teams and opportunities across timezones.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]
  const teams = [
    { id: '1', name: 'DeFi Explorers', initials: 'DX', members: 8, focus: 'DeFi, Trading, Analytics', gradient: 'from-purple-500 to-pink-500' },
    { id: '2', name: 'NFT Forge', initials: 'NF', members: 12, focus: 'NFTs, Art, Marketplace', gradient: 'from-cyan-500 to-blue-500' },
    { id: '3', name: 'ZK Pioneers', initials: 'ZK', members: 5, focus: 'Zero Knowledge, Privacy', gradient: 'from-yellow-500 to-orange-500' },
  ]
  const questions = [
    { id: '1', title: 'How to implement CPI in Anchor?', excerpt: 'Best practices for cross-program invocation...', author: '@rustdev', votes: 42, answers: 12, time: '2h ago' },
    { id: '2', title: 'Token-2022 vs SPL Token?', excerpt: 'When should I use the new token standard...', author: '@tokenmaster', votes: 28, answers: 8, time: '5h ago' },
    { id: '3', title: 'Looking for a security auditor', excerpt: 'Our DEX is ready for mainnet, need audit...', author: '@dexbuilder', votes: 15, answers: 5, time: '1d ago' },
  ]
  const coreValues = [
    { icon: <Eye className="h-6 w-6" />, title: 'Transparency', description: 'Verified on-chain activity', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { icon: <Lock className="h-6 w-6" />, title: 'Anonymity', description: 'Build without doxxing', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { icon: <Target className="h-6 w-6" />, title: 'Clarity', description: 'Clear purpose & goals', color: 'text-pink-400', bg: 'bg-pink-500/20' },
  ]
  return (
    <div className="space-y-16 relative">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-secondary/30 border border-primary/20 p-8 md:p-16">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(153,69,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(153,69,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-primary px-4 py-2 rounded-full text-sm font-medium animate-pulse">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <Sparkles className="h-4 w-4" />
              Welcome to DevPump Alpha
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              The{' '}
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_30px_rgba(153,69,255,0.5)]">
                LinkedIn
              </span>
              <br />for{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_30px_rgba(20,241,149,0.5)]">
                Solana
              </span>
              <br />Developers
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Showcase your work, find elite projects, build teams, and grow your reputation in the 
              Solana ecosystem—all while staying{' '}
              <span className="text-cyan-400 font-bold">pseudonymous</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="gradient" className="gap-3 text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_40px_rgba(153,69,255,0.4),0_0_80px_rgba(20,241,149,0.2)] hover:shadow-[0_0_60px_rgba(153,69,255,0.6),0_0_120px_rgba(20,241,149,0.4)] transition-all duration-300 hover:-translate-y-1">
                <Rocket className="h-6 w-6" />
                Start Building
              </Button>
              <Button size="lg" variant="outline" className="gap-3 text-lg px-8 py-6 border-2 border-white/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <Users className="h-6 w-6" />
                Explore Builders
              </Button>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">2,500+</div>
                <div className="text-sm text-muted-foreground">Builders</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">450+</div>
                <div className="text-sm text-muted-foreground">Projects</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">$12M+</div>
                <div className="text-sm text-muted-foreground">Earned</div>
              </div>
            </div>
          </div>
          {/* Floating Cards */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Builder Card */}
            <div className="absolute top-0 right-0 w-72 bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(153,69,255,0.2)] animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">S</div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    solanabuilder
                    <Award className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-sm text-muted-foreground">Senior Solana Developer</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Rust', 'Anchor', 'TypeScript'].map(skill => (
                  <span key={skill} className="px-2 py-1 rounded-lg text-xs bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-cyan-300">{skill}</span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">24 projects</span>
                <span className="text-cyan-400 font-semibold">98% reputation</span>
              </div>
            </div>
            {/* Project Card */}
            <div className="absolute top-40 left-0 w-64 bg-card/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(20,241,149,0.2)] animate-float-delayed">
              <div className="text-sm text-muted-foreground mb-2">Active Project</div>
              <div className="font-semibold mb-3">Decentralized Exchange</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: '65%' }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">65% complete</span>
                <span className="text-cyan-400">5 team members</span>
              </div>
            </div>
            {/* Team Card */}
            <div className="absolute bottom-20 right-10 w-56 bg-card/80 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-4 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-float-slow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-semibold text-sm">Team Formed!</span>
              </div>
              <div className="flex -space-x-2">
                {['bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-yellow-500'].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-background`} />
                ))}
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-xs">+3</div>
              </div>
            </div>
          </div>
        </div>
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
      </section>
      {/* Core Values Banner */}
      <section className="py-8 border-y border-white/5 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {coreValues.map((value, index) => (
            <div key={index} className="flex items-center gap-3 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <span className={value.color}>{value.icon}</span>
              </div>
              <div>
                <div className="font-bold text-foreground">{value.title}</div>
                <div className="text-sm text-muted-foreground">{value.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Why <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">DevPump</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A space for the betterment of the Crypto Space—but most importantly, each other. 
            No blue checks from X. No soy boy remarks from Reddit. Just builders building.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(153,69,255,0.2)] hover:-translate-y-2 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <span className="text-white">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Featured Builders */}
      <section className="relative py-12 rounded-3xl bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Featured <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Builders</span>
            </h2>
            <p className="text-xl text-muted-foreground">Top developers in the Solana ecosystem</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 gap-2 border-2 hover:border-primary/50 hover:bg-primary/5">
            <Users className="h-4 w-4" />
            View All Builders
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBuilders.map((builder) => (
            <BuilderCard key={builder.id} builder={builder} />
          ))}
        </div>
      </section>
      {/* Featured Projects */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Active <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-muted-foreground">Join teams building the future of Solana</p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0 border-2 hover:border-primary/50 hover:bg-primary/5">
            View All Projects
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
      {/* Teams & Q&A Section */}
      <section className="py-12 rounded-3xl bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Teams */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Build Your <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">Create groups, form teams, and collaborate on the next big thing in Web3.</p>
            
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="group bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(153,69,255,0.15)] hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${team.gradient} flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform`}>
                    {team.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{team.name}</div>
                    <div className="text-sm text-muted-foreground">{team.members} members • {team.focus}</div>
                  </div>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </Button>
                </div>
              ))}
            </div>
            
            <Button className="mt-6 gap-2 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(153,69,255,0.3)] hover:shadow-[0_0_50px_rgba(153,69,255,0.5)] transition-all">
              <Plus className="h-5 w-5" />
              Create Your Team
            </Button>
          </div>
          
          {/* Q&A Board */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Community <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Q&A</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">Ask questions, share knowledge, and learn from the community.</p>
            
            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="group bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(20,241,149,0.15)]">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <button className="text-muted-foreground hover:text-cyan-400 transition-colors">
                        <ChevronUp className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-bold text-cyan-400">{question.votes}</span>
                      <button className="text-muted-foreground hover:text-purple-400 transition-colors">
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{question.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{question.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>by {question.author}</span>
                        <span>•</span>
                        <span>{question.answers} answers</span>
                        <span>•</span>
                        <span>{question.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="mt-6 gap-2 border-2 hover:border-primary/50 hover:bg-primary/5">
              <MessageSquare className="h-5 w-5" />
              Ask a Question
            </Button>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/20 via-background to-cyan-500/30 border border-primary/20 p-12 md:p-20 text-center">
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-bounce" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-8 shadow-[0_0_60px_rgba(153,69,255,0.5)] animate-pulse">
            <Zap className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Build Your{' '}
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              Reputation
            </span>?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of developers showcasing their work, forming teams, and finding 
            amazing opportunities on DevPump.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-3 text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_50px_rgba(153,69,255,0.5),0_0_100px_rgba(20,241,149,0.3)] hover:shadow-[0_0_80px_rgba(153,69,255,0.7),0_0_150px_rgba(20,241,149,0.5)] transition-all duration-300 hover:-translate-y-1">
              <Sparkles className="h-6 w-6" />
              Create Your Profile
            </Button>
            <Button size="lg" variant="outline" className="gap-3 text-lg px-10 py-6 border-2 border-white/20 hover:border-primary/50 hover:bg-primary/5">
              See How It Works
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
