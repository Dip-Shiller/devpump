'use client'

import { useState } from 'react'
import type { ContentBlock } from '@/types/profile'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X, GripVertical, Edit2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentBlockWrapperProps {
  block: ContentBlock
  onUpdate: (data: Partial<ContentBlock>) => void
  onRemove: () => void
  isEditing?: boolean
  isDragging?: boolean
  children: React.ReactNode
}

export function ContentBlockWrapper({
  block,
  onUpdate,
  onRemove,
  isEditing = false,
  isDragging = false,
  children,
}: ContentBlockWrapperProps) {
  const [editMode, setEditMode] = useState(false)

  return (
    <Card
      className={cn(
        'relative group transition-all duration-200 bg-card/50 backdrop-blur',
        isDragging && 'opacity-50 scale-95',
        isEditing && 'ring-2 ring-purple-500/50'
      )}
    >
      {/* Drag Handle */}
      {isEditing && (
        <div className="absolute -left-10 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      {/* Edit Controls */}
      {isEditing && (
        <div className="absolute -top-3 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-background/80 backdrop-blur"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <Check className="w-3 h-3" />
            ) : (
              <Edit2 className="w-3 h-3" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 rounded-full bg-background/80 backdrop-blur hover:bg-destructive/20"
            onClick={onRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </Card>
  )
}

// Text Block
interface TextBlockProps {
  block: ContentBlock
  onUpdate: (data: Partial<ContentBlock>) => void
  isEditing?: boolean
}

export function TextBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  const content = block.data.content || ''

  return (
    <div className="space-y-2">
      {block.data.title && (
        <h3 className="text-xl font-bold">{block.data.title}</h3>
      )}
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={block.data.title || ''}
            onChange={(e) => onUpdate({ data: { ...block.data, title: e.target.value } })}
            placeholder="Block title (optional)"
            className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg"
          />
          <Textarea
            value={content}
            onChange={(e) => onUpdate({ data: { ...block.data, content: e.target.value } })}
            placeholder="Enter your text here..."
            className="min-h-[120px] bg-background/50"
          />
        </div>
      ) : (
        <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
      )}
    </div>
  )
}

// Wallet Display Block
export function WalletDisplayBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  const walletAddress = block.data.walletAddress || ''
  const showFull = block.data.showFull || false

  const truncateAddress = (addr: string) => {
    if (!addr) return 'Not connected'
    if (showFull) return addr
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">👛</span> Wallet Address
      </h3>
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => onUpdate({ data: { ...block.data, walletAddress: e.target.value } })}
            placeholder="Enter wallet address"
            className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg font-mono text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showFull}
              onChange={(e) => onUpdate({ data: { ...block.data, showFull: e.target.checked } })}
              className="rounded"
            />
            Show full address
          </label>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg border border-purple-500/20">
          <code className="text-sm font-mono text-purple-300">
            {truncateAddress(walletAddress)}
          </code>
        </div>
      )}
    </div>
  )
}

// Skills Block
export function SkillsBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  const skills = block.data.skills || []
  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdate({ data: { ...block.data, skills: [...skills, newSkill.trim()] } })
      setNewSkill('')
    }
  }

  const removeSkill = (index: number) => {
    onUpdate({ data: { ...block.data, skills: skills.filter((_: any, i: number) => i !== index) } })
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">⚡</span> Skills
      </h3>
      
      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill..."
            className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-lg"
          />
          <Button onClick={addSkill} size="sm">Add</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && !isEditing && (
          <p className="text-sm text-muted-foreground">No skills added yet</p>
        )}
        {skills.map((skill: string, index: number) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-sm rounded-full border border-purple-500/30 flex items-center gap-2"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => removeSkill(index)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

// Projects Block
export function ProjectsBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  const projects = block.data.projects || []

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">🚀</span> Featured Projects
      </h3>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {isEditing ? 'Add projects from your projects page' : 'No projects to display'}
        </p>
      ) : (
        <div className="space-y-2">
          {projects.map((project: any, index: number) => (
            <div key={index} className="p-3 bg-background/50 rounded-lg border border-border">
              <h4 className="font-semibold">{project.title}</h4>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Team Members Block
export function TeamMembersBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  const members = block.data.members || []

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">👥</span> Team Members
      </h3>
      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No team members added</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {members.map((member: any, index: number) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500" />
              <div>
                <p className="font-medium text-sm">{member.username}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Roadmap Block
export function RoadmapBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  const milestones = block.data.milestones || []
  const [newMilestone, setNewMilestone] = useState({ title: '', status: 'pending' })

  const addMilestone = () => {
    if (newMilestone.title.trim()) {
      onUpdate({
        data: {
          ...block.data,
          milestones: [...milestones, { ...newMilestone, id: Date.now() }]
        }
      })
      setNewMilestone({ title: '', status: 'pending' })
    }
  }

  const removeMilestone = (id: number) => {
    onUpdate({
      data: {
        ...block.data,
        milestones: milestones.filter((m: any) => m.id !== id)
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500'
      case 'in-progress': return 'text-yellow-500'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">🗺️</span> Roadmap
      </h3>
      
      {isEditing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
            placeholder="Milestone title..."
            className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-lg text-sm"
          />
          <select
            value={newMilestone.status}
            onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
            className="px-3 py-2 bg-background/50 border border-border rounded-lg text-sm"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <Button onClick={addMilestone} size="sm">Add</Button>
        </div>
      )}

      <div className="space-y-2">
        {milestones.length === 0 && (
          <p className="text-sm text-muted-foreground">No milestones added</p>
        )}
        {milestones.map((milestone: any) => (
          <div key={milestone.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border">
            <div className={cn('w-3 h-3 rounded-full', getStatusColor(milestone.status))} style={{ backgroundColor: 'currentColor' }} />
            <span className="flex-1 text-sm">{milestone.title}</span>
            {isEditing && (
              <button
                onClick={() => removeMilestone(milestone.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
