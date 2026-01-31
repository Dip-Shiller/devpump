'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { BlockType, ProfileType } from '@/types/profile'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockPaletteProps {
  profileType: ProfileType
  allowedBlocks: BlockType[]
  onAddBlock: (blockType: BlockType) => void
  canAddMore: boolean
  currentBlockCount: number
  maxBlocks?: number
}

const BLOCK_DEFINITIONS: Record<BlockType, {
  icon: string
  label: string
  description: string
  color: string
}> = {
  'text': {
    icon: '📝',
    label: 'Text',
    description: 'Add custom text content',
    color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30'
  },
  'image': {
    icon: '🖼️',
    label: 'Image',
    description: 'Add images or media',
    color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30'
  },
  'wallet-display': {
    icon: '👛',
    label: 'Wallet',
    description: 'Display your wallet address',
    color: 'from-purple-500/20 to-cyan-500/20 border-purple-500/30'
  },
  'skills': {
    icon: '⚡',
    label: 'Skills',
    description: 'Showcase your expertise',
    color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
  },
  'projects': {
    icon: '🚀',
    label: 'Projects',
    description: 'Featured projects',
    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
  },
  'social-links': {
    icon: '🔗',
    label: 'Social Links',
    description: 'GitHub, Twitter, etc.',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
  },
  'team-members': {
    icon: '👥',
    label: 'Team Members',
    description: 'Show your team',
    color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30'
  },
  'achievements': {
    icon: '🏆',
    label: 'Achievements',
    description: 'Badges and awards',
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30'
  },
  'testimonials': {
    icon: '💬',
    label: 'Testimonials',
    description: 'Reviews and endorsements',
    color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30'
  },
  'roadmap': {
    icon: '🗺️',
    label: 'Roadmap',
    description: 'Project timeline',
    color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30'
  },
  'tokenomics': {
    icon: '💰',
    label: 'Tokenomics',
    description: 'Token distribution',
    color: 'from-green-500/20 to-teal-500/20 border-green-500/30'
  },
  'github-stats': {
    icon: '📊',
    label: 'GitHub Stats',
    description: 'Contribution graph',
    color: 'from-gray-500/20 to-slate-500/20 border-gray-500/30'
  },
}

export function BlockPalette({
  profileType,
  allowedBlocks,
  onAddBlock,
  canAddMore,
  currentBlockCount,
  maxBlocks,
}: BlockPaletteProps) {
  const handleAddBlock = (blockType: BlockType) => {
    if (canAddMore) {
      onAddBlock(blockType)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Content Blocks</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Profile Type: <span className="text-foreground font-medium capitalize">{profileType}</span>
          </span>
          <span className={cn(
            'font-medium',
            !canAddMore && 'text-destructive'
          )}>
            {currentBlockCount}/{maxBlocks || '∞'} blocks
          </span>
        </div>
      </div>

      {/* Warning if at limit */}
      {!canAddMore && (
        <Card className="p-3 bg-destructive/10 border-destructive/30">
          <p className="text-sm text-destructive">
            Maximum blocks reached. Remove a block to add more.
          </p>
        </Card>
      )}

      {/* Block List */}
      <div className="space-y-2">
        {allowedBlocks.map((blockType) => {
          const def = BLOCK_DEFINITIONS[blockType]
          const isDisabled = !canAddMore

          return (
            <button
              key={blockType}
              onClick={() => handleAddBlock(blockType)}
              disabled={isDisabled}
              className={cn(
                'w-full text-left p-4 rounded-lg border transition-all duration-200',
                'hover:scale-[1.02] active:scale-[0.98]',
                `bg-gradient-to-r ${def.color}`,
                isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{def.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{def.label}</h4>
                    <Plus className={cn(
                      'w-4 h-4 transition-opacity',
                      isDisabled ? 'opacity-0' : 'opacity-70'
                    )} />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {def.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Help Text */}
      <Card className="p-3 bg-muted/50">
        <p className="text-xs text-muted-foreground">
          💡 Drag blocks to reorder them on your profile. Click edit to customize content.
        </p>
      </Card>
    </div>
  )
}
