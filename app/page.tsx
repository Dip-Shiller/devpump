import { BuilderCard } from '@/components/builder/builder-card'
import { ProjectCard } from '@/components/project/project-card'
import { Button } from '@/components/ui/button'
import { 
  Zap, Users, TrendingUp, Rocket, 
  Code, Shield, Globe, Sparkles 
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
      description: 'Build reputation without revealing personal information. Your work speaks for itself.'
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: 'On-Chain Portfolio',
      description: 'Showcase deployed contracts, tokens, and real contributions that anyone can verify.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Peer Endorsements',
      description: 'Get verified by other builders. Signed attestations that build real trust.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Network',
      description: 'Connect with builders worldwide. Find teams and opportunities across timezones.'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/20 border border-border p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Welcome to DevPump Alpha
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The{' '}
            <span className="gradient-text">LinkedIn</span>
            {' '}for{' '}
            <span className="gradient-text">Solana</span>
            {' '}Developers
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Showcase your work, find elite projects, and build your reputation in the 
            Solana ecosystem—all while staying pseudonymous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="gradient" className="gap-2">
              <Rocket className="h-5 w-5" />
              Start Building Your Profile
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <TrendingUp className="h-5 w-5" />
              Explore Top Builders
            </Button>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
      </section>

      {/* Features Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Why Build on DevPump</h2>
            <p className="text-muted-foreground">Designed for developers, by developers</p>
          </div>
          <Button variant="outline">Learn More</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Builders */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Builders</h2>
            <p className="text-muted-foreground">Top developers in the Solana ecosystem</p>
          </div>
          <Button variant="outline" className="gap-2">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Active Projects</h2>
            <p className="text-muted-foreground">Join teams building the future</p>
          </div>
          <Button variant="outline">View All Projects</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-secondary/30 border border-border p-8 md:p-12 text-center">
        <div className="relative z-10 max-w-2xl mx-auto">
          <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Reputation?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of developers already showcasing their work and finding 
            amazing opportunities on DevPump.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Create Your Profile
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              See How It Works
            </Button>
          </div>
        </div>
        
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient" />
      </section>
    </div>
  )
}