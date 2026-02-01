'use client'

import { useState, useCallback, useEffect } from 'react'
import { create } from 'zustand'
import type { ContentBlock, LayoutConfig, ProfileType } from '@/types/profile'
import { getProfileConfig } from '@/types/profile'

interface ProfileBuilderStore {
  blocks: ContentBlock[]
  profileType: ProfileType
  isDirty: boolean
  setBlocks: (blocks: ContentBlock[]) => void
  addBlock: (block: ContentBlock) => void
  removeBlock: (blockId: string) => void
  updateBlock: (blockId: string, data: Partial<ContentBlock>) => void
  reorderBlocks: (oldIndex: number, newIndex: number) => void
  setProfileType: (type: ProfileType) => void
  setDirty: (dirty: boolean) => void
  reset: () => void
}

export const useProfileBuilderStore = create<ProfileBuilderStore>((set) => ({
  blocks: [],
  profileType: 'personal',
  isDirty: false,
  setBlocks: (blocks) => set({ blocks, isDirty: true }),
  addBlock: (block) =>
    set((state) => ({ blocks: [...state.blocks, block], isDirty: true })),
  removeBlock: (blockId) =>
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== blockId),
      isDirty: true,
    })),
  updateBlock: (blockId, data) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === blockId ? { ...b, ...data } : b
      ),
      isDirty: true,
    })),
  reorderBlocks: (oldIndex, newIndex) =>
    set((state) => {
      const newBlocks = [...state.blocks]
      const [removed] = newBlocks.splice(oldIndex, 1)
      newBlocks.splice(newIndex, 0, removed)
      return { blocks: newBlocks, isDirty: true }
    }),
  setProfileType: (type) => set({ profileType: type }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  reset: () => set({ blocks: [], isDirty: false }),
}))

interface UseProfileBuilderOptions {
  userId: string
  initialProfileType?: ProfileType
}

export function useProfileBuilder({ userId, initialProfileType = 'personal' }: UseProfileBuilderOptions) {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const blocks = useProfileBuilderStore((state) => state.blocks)
  const profileType = useProfileBuilderStore((state) => state.profileType)
  const isDirty = useProfileBuilderStore((state) => state.isDirty)
  const setBlocks = useProfileBuilderStore((state) => state.setBlocks)
  const addBlock = useProfileBuilderStore((state) => state.addBlock)
  const removeBlock = useProfileBuilderStore((state) => state.removeBlock)
  const updateBlock = useProfileBuilderStore((state) => state.updateBlock)
  const reorderBlocks = useProfileBuilderStore((state) => state.reorderBlocks)
  const setProfileType = useProfileBuilderStore((state) => state.setProfileType)
  const setDirty = useProfileBuilderStore((state) => state.setDirty)

  const config = getProfileConfig(profileType)

  // Load profile layout from API
  const loadLayout = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error('Failed to load profile')
      
      const { user } = await response.json()
      
      // Handle profile_layout - it might not exist yet in DB
      if (user.profile_layout && Array.isArray(user.profile_layout.blocks)) {
        setBlocks(user.profile_layout.blocks)
      } else {
        // Initialize with empty layout if not present
        setBlocks([])
      }
      
      // Handle profile_type - default to initialProfileType if not set
      if (user.profile_type) {
        setProfileType(user.profile_type)
      } else {
        setProfileType(initialProfileType)
      }
      
      setDirty(false)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
      // Even on error, initialize with defaults so user can still use builder
      setBlocks([])
      setProfileType(initialProfileType)
      setDirty(false)
    } finally {
      setIsLoading(false)
    }
  }, [userId, initialProfileType, setBlocks, setProfileType, setDirty])

  // Save profile layout to API
  const saveLayout = useCallback(async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      const layout: LayoutConfig = {
        blocks,
        theme: 'default',
        columns: 12,
      }
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_layout: layout,
          profile_type: profileType,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to save profile')
      
      setDirty(false)
      return { success: true }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save profile'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsSaving(false)
    }
  }, [userId, blocks, profileType, setDirty])

  // Check if we can add more blocks
  const canAddBlock = useCallback(() => {
    return blocks.length < (config.customization.maxBlocks || Infinity)
  }, [blocks.length, config])

  // Check if a block type is allowed
  const isBlockTypeAllowed = useCallback((blockType: string) => {
    return config.allowedBlocks.includes(blockType as any)
  }, [config])

  // Validate required blocks are present
  const validateLayout = useCallback(() => {
    const requiredBlocks = config.customization.requiredBlocks || []
    const presentBlockTypes = blocks.map(b => b.type)
    const missingBlocks = requiredBlocks.filter(
      type => !presentBlockTypes.includes(type)
    )
    return {
      valid: missingBlocks.length === 0,
      missingBlocks,
    }
  }, [blocks, config])

  // Load layout on mount
  useEffect(() => {
    loadLayout()
  }, [loadLayout])

  return {
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
    setProfileType,
    saveLayout,
    loadLayout,
    canAddBlock,
    isBlockTypeAllowed,
    validateLayout,
  }
}
