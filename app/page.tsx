import { Button } from '@/components/ui/button'
import { 
  Zap, Users, Rocket, 
  Code, Shield, Globe, Sparkles,
  MessageSquare, Plus, 
  Eye, Target, Lock,
  Briefcase, UserPlus, FileText,
  ArrowRight, Layers, Search
} from 'lucide-react'
export default function Home() {
  const features = [
    {
      icon: <Shield className="h-7 w-7" />,
      title: 'Pseudonymous Identity',
      description: 'Build your reputation without revealing personal information. Your work speaks for itself.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Code className="h-7 w-7" />,
      title: 'On-Chain Portfolio',
      description: 'Showcase deployed contracts, tokens, and contributions that anyone can verify on Solana.',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: 'Peer Endorsements',
      description: 'Get verified by other builders with signed attestations that build real trust.',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Globe className="h-7 w-7" />,
      title: 'Global Network',
      description: 'Connect with builders worldwide. Find teams and opportunities across timezones.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]
  const coreValues = [
    { icon: <Eye className="h-6 w-6" />, title: 'Transparency', description: 'Verified on-chain activity', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { icon: <Lock className="h-6 w-6" />, title: 'Anonymity', description: 'Build without doxxing', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: <Target className="h-6 w-6" />, title: 'Clarity', description: 'Clear purpose & goals', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  ]
  const platformSections = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: 'Build Your Profile',
      description: 'Create a pseudonymous developer profile showcasing your skills, experience, and on-chain contributions.',
      cta: 'Create Profile',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Skills & expertise', 'Work history', 'On-chain portfolio', 'Peer endorsements']
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Form Teams',
      description: 'Create or join teams to collaborate on projects. Build group profiles and showcase collective work.',
      cta: 'Explore Teams',
      gradient: 'from-cyan-500 to-blue-500',
      features: ['Team profiles', 'Role management', 'Project tracking', 'Shared reputation']
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: 'Promote Projects',
      description: 'Showcase your projects, find contributors, and connect with potential collaborators or investors.',
      cta: 'Post Project',
      gradient: 'from-pink-500 to-rose-500',
      features: ['Project showcase', 'Team recruiting', 'Progress updates', 'Community feedback']
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: 'Q&A Board',
      description: 'Ask questions, share knowledge, and learn from the community. Build reputation through helpful answers.',
      cta: 'Browse Questions',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Technical Q&A', 'Community voting', 'Expert answers', 'Knowledge base']
    }
  ]
  return (
    <div className="relative">
      {/* Subtle Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>
      {/* ===== HERO SECTION ===== */}
      <section className="min-h-[90vh] flex items-center justify-center py-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-muted-foreground">Now in Alpha</span>
            <span className="text-white font-medium">Join the waitlist</span>
          </div>
          
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
              The{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                LinkedIn
              </span>
              {' '}for
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Solana
              </span>
              {' '}Developers
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Showcase your work, build teams, and grow your reputation in the Solana ecosystem—all while staying{' '}
              <span className="text-cyan-400 font-semibold">pseudonymous</span>.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="gap-3 text-lg px-8 py-7 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_40px_rgba(153,69,255,0.3)] hover:shadow-[0_0_60px_rgba(153,69,255,0.5)] transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <Rocket className="h-5 w-5" />
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-3 text-lg px-8 py-7 border-2 border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 rounded-2xl">
              <Search className="h-5 w-5" />
              Explore Builders
            </Button>
          </div>
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-12 pt-10">
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">2,500+</div>
              <div className="text-sm text-muted-foreground mt-1">Builders</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">450+</div>
              <div className="text-sm text-muted-foreground mt-1">Projects</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">$12M+</div>
              <div className="text-sm text-muted-foreground mt-1">Earned</div>
            </div>
          </div>
        </div>
      </section>
      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* ===== CORE VALUES ===== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-5 p-6 rounded-2xl ${value.bg} border ${value.border} transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center ${value.color}`}>
                  {value.icon}
                </div>
                <div>
                  <div className="font-bold text-lg text-foreground">{value.title}</div>
                  <div className="text-sm text-muted-foreground">{value.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* ===== WHY DEVPUMP ===== */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Why{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                DevPump
              </span>
              ?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A space for the betterment of the crypto space—but most importantly, each other. 
              No blue checks. No gatekeeping. Just builders building.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04]"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* ===== PLATFORM SECTIONS ===== */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Build your profile, form teams, promote projects, and engage with the community—all in one place.
            </p>
          </div>
          {/* Platform Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platformSections.map((section, index) => (
              <div 
                key={index}
                className="group bg-white/[0.02] border border-white/5 rounded-3xl p-10 hover:border-white/10 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white">{section.icon}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">{section.description}</p>
                
                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {section.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.gradient}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="gap-2 border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl">
                  {section.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* ===== BUILDERS PREVIEW (Empty State) ===== */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Featured{' '}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Builders
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">Top developers in the Solana ecosystem</p>
            </div>
            <Button variant="outline" className="gap-2 border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl">
              <Users className="h-4 w-4" />
              View All Builders
            </Button>
          </div>
          {/* Empty State Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="bg-white/[0.02] border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[280px]"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 mb-4" />
                <div className="h-4 w-32 bg-white/5 rounded mb-2" />
                <div className="h-3 w-24 bg-white/5 rounded mb-6" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/5 rounded-lg" />
                  <div className="h-6 w-16 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Be among the first to create your profile</p>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-xl">
              <Plus className="h-4 w-4" />
              Create Your Profile
            </Button>
          </div>
        </div>
      </section>
      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* ===== PROJECTS PREVIEW (Empty State) ===== */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Active{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">Join teams building the future of Solana</p>
            </div>
            <Button variant="outline" className="gap-2 border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl">
              <Briefcase className="h-4 w-4" />
              View All Projects
            </Button>
          </div>
          {/* Empty State Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div 
                key={i}
                className="bg-white/[0.02] border border-white/5 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 mb-4" />
                <div className="h-5 w-48 bg-white/5 rounded mb-3" />
                <div className="h-3 w-64 bg-white/5 rounded mb-2" />
                <div className="h-3 w-56 bg-white/5 rounded mb-6" />
                <div className="flex gap-2 mb-6">
                  <div className="h-6 w-16 bg-white/5 rounded-lg" />
                  <div className="h-6 w-16 bg-white/5 rounded-lg" />
                  <div className="h-6 w-16 bg-white/5 rounded-lg" />
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Have a project? Share it with the community</p>
            <Button className="gap-2 bg-gradient-to-r from-cyan-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 rounded-xl">
              <Plus className="h-4 w-4" />
              Post Your Project
            </Button>
          </div>
        </div>
      </section>
      {/* ===== DIVIDER ===== */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* ===== CTA SECTION ===== */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(153,69,255,0.4)]">
            <Zap className="h-10 w-10 text-white" />
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Ready to Build Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Reputation
            </span>
            ?
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the community of builders showcasing their work, forming teams, and finding opportunities on DevPump.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-3 text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_50px_rgba(153,69,255,0.4)] hover:shadow-[0_0_80px_rgba(153,69,255,0.6)] transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <Sparkles className="h-5 w-5" />
              Create Your Profile
            </Button>
            <Button size="lg" variant="outline" className="gap-3 text-lg px-10 py-7 border-2 border-white/10 hover:border-white/20 hover:bg-white/5 rounded-2xl">
              <FileText className="h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>
      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-16 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">DevPump</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">ALPHA</span>
            </div>
            
            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
            </div>
            
            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              © 2024 DevPump. Built on Solana.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
