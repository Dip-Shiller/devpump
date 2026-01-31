'use client'

import { useState } from 'react'
import { useProfileBuilder } from '@/hooks/use-profile-builder'
import { BuilderCanvas } from './builder-canvas'
import { BlockPalette } from './block-palette'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { BlockType, ProfileType } from '@/types/profile'
import { Edit3, Eye, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileBuilderProps {
  userId: string
  initialProfileType?: ProfileType
}

export function ProfileBuilder({ userId, initialProfileType = 'personal' }: ProfileBuilderProps) {
  const [isEditMode, setIsEditMode] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const {
    blocks,
    profileType,
    config,
    isLoading,
    isSaving,
    error,
    isDirty,
    addBlock,
    removeBlock,
    updateBlock,
    reorderBlocks,
    saveLayout,
    canAddBlock,
    validateLayout,
  } = useProfileBuilder({ userId, initialProfileType })

  const handleAddBlock = (blockType: BlockType) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      position: { x: 0, y: 0, w: 12, h: 4 },
      data: {},
      isVisible: true,
    }
    addBlock(newBlock)
  }

  const handleSave = async () => {
    // Validate before saving
    const validation = validateLayout()
    if (!validation.valid) {
      setSaveMessage({
        type: 'error',
        text: `Missing required blocks: ${validation.missingBlocks.join(', ')}`
      })
      setTimeout(() => setSaveMessage(null), 5000)
      return
    }

    const result = await saveLayout()
    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Profile saved successfully!' })
      setTimeout(() => setSaveMessage(null), 3000)
    } else {
      setSaveMessage({ type: 'error', text: result.error || 'Failed to save' })
      setTimeout(() => setSaveMessage(null), 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 border-destructive/50 bg-destructive/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-destructive mb-1">Error loading profile</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            {error.includes('Failed to load profile') && (
              <div className="p-3 bg-background/50 rounded-lg border border-border text-sm space-y-2">
                <p className="font-medium">💡 Database setup required</p>
                <p className="text-muted-foreground">
                  The profile builder requires new database columns. Run this migration in your Supabase SQL Editor:
                </p>
                <code className="block p-2 bg-muted rounded text-xs overflow-x-auto">
                  See: migrations/add-profile-builder.sql
                </code>
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Profile Builder</h2>
          <p className="text-sm text-muted-foreground">
            Customize your <span className="font-medium capitalize">{profileType}</span> profile with drag-and-drop blocks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit/Preview Toggle */}
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className="gap-2"
          >
            {isEditMode ? (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Edit
              </>
            )}
          </Button>

          {/* Save Button */}
          <Button
            variant="gradient"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Save Status Message */}
      {saveMessage && (
        <Card className={cn(
          'p-4',
          saveMessage.type === 'success' 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-destructive/10 border-destructive/30'
        )}>
          <div className="flex items-center gap-3">
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            <p className={cn(
              'text-sm font-medium',
              saveMessage.type === 'success' ? 'text-green-500' : 'text-destructive'
            )}>
              {saveMessage.text}
            </p>
          </div>
        </Card>
      )}

      {/* Unsaved Changes Warning */}
      {isDirty && !saveMessage && (
        <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            ⚠️ You have unsaved changes
          </p>
        </Card>
      )}

      {/* Main Builder Layout */}
      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        {/* Canvas */}
        <div className="min-h-[500px]">
          <BuilderCanvas
            blocks={blocks}
            onReorder={reorderBlocks}
            onUpdateBlock={updateBlock}
            onRemoveBlock={removeBlock}
            isEditMode={isEditMode}
          />
        </div>

        {/* Sidebar - Block Palette */}
        {isEditMode && (
          <div className="lg:sticky lg:top-6 lg:self-start">
            <BlockPalette
              profileType={profileType}
              allowedBlocks={config.allowedBlocks}
              onAddBlock={handleAddBlock}
              canAddMore={canAddBlock()}
              currentBlockCount={blocks.length}
              maxBlocks={config.customization.maxBlocks}
            />
          </div>
        )}
      </div>

      {/* Preview Mode Info */}
      {!isEditMode && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-center text-muted-foreground">
            👁️ Preview Mode - This is how your profile appears to others
          </p>
        </Card>
      )}
    </div>
  )
}
