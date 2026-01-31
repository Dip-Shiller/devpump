/**
 * Profile Type System for DevPump
 * Supports 4 distinct profile types: Personal, Team, Community, Project
 */

export type ProfileType = 'personal' | 'team' | 'community' | 'project'

export type BlockType =
  | 'text'
  | 'image'
  | 'wallet-display'
  | 'skills'
  | 'projects'
  | 'social-links'
  | 'team-members'
  | 'achievements'
  | 'testimonials'
  | 'roadmap'
  | 'tokenomics'
  | 'github-stats'

export interface ContentBlock {
  id: string
  type: BlockType
  position: { x: number; y: number; w: number; h: number }
  data: Record<string, any>
  isVisible: boolean
}

export interface LayoutConfig {
  blocks: ContentBlock[]
  theme?: 'default' | 'minimal' | 'vibrant'
  columns?: number
}

export interface PrivacyConfig {
  walletAddressVisible: boolean
  emailVisible: boolean
  locationVisible: boolean
  skillsVisible: boolean
  projectsVisible: boolean
  anonymousMode: boolean
  customVisibility: Record<string, boolean>
}

export interface ProfileConfig {
  type: ProfileType
  allowedBlocks: BlockType[]
  defaultLayout: LayoutConfig
  privacySettings: PrivacyConfig
  customization: {
    draggable: boolean
    maxBlocks?: number
    requiredBlocks?: BlockType[]
  }
}

/**
 * Default configurations for each profile type
 */
export const PROFILE_TYPE_CONFIGS: Record<ProfileType, ProfileConfig> = {
  personal: {
    type: 'personal',
    allowedBlocks: [
      'text',
      'image',
      'wallet-display',
      'skills',
      'projects',
      'social-links',
      'achievements',
      'github-stats',
    ],
    defaultLayout: {
      blocks: [],
      theme: 'default',
      columns: 12,
    },
    privacySettings: {
      walletAddressVisible: true,
      emailVisible: false,
      locationVisible: true,
      skillsVisible: true,
      projectsVisible: true,
      anonymousMode: false,
      customVisibility: {},
    },
    customization: {
      draggable: true,
      maxBlocks: 10,
      requiredBlocks: ['wallet-display', 'skills'],
    },
  },
  team: {
    type: 'team',
    allowedBlocks: [
      'text',
      'image',
      'team-members',
      'projects',
      'social-links',
      'achievements',
      'roadmap',
    ],
    defaultLayout: {
      blocks: [],
      theme: 'default',
      columns: 12,
    },
    privacySettings: {
      walletAddressVisible: true,
      emailVisible: false,
      locationVisible: false,
      skillsVisible: true,
      projectsVisible: true,
      anonymousMode: false,
      customVisibility: {},
    },
    customization: {
      draggable: true,
      maxBlocks: 15,
      requiredBlocks: ['team-members'],
    },
  },
  community: {
    type: 'community',
    allowedBlocks: [
      'text',
      'image',
      'team-members',
      'projects',
      'social-links',
      'testimonials',
      'roadmap',
    ],
    defaultLayout: {
      blocks: [],
      theme: 'vibrant',
      columns: 12,
    },
    privacySettings: {
      walletAddressVisible: true,
      emailVisible: false,
      locationVisible: false,
      skillsVisible: false,
      projectsVisible: true,
      anonymousMode: false,
      customVisibility: {},
    },
    customization: {
      draggable: true,
      maxBlocks: 12,
      requiredBlocks: ['text'],
    },
  },
  project: {
    type: 'project',
    allowedBlocks: [
      'text',
      'image',
      'team-members',
      'social-links',
      'roadmap',
      'tokenomics',
      'github-stats',
      'achievements',
    ],
    defaultLayout: {
      blocks: [],
      theme: 'default',
      columns: 12,
    },
    privacySettings: {
      walletAddressVisible: true,
      emailVisible: false,
      locationVisible: false,
      skillsVisible: false,
      projectsVisible: true,
      anonymousMode: false,
      customVisibility: {},
    },
    customization: {
      draggable: true,
      maxBlocks: 12,
      requiredBlocks: ['text', 'roadmap'],
    },
  },
}

/**
 * Get configuration for a specific profile type
 */
export function getProfileConfig(type: ProfileType): ProfileConfig {
  return PROFILE_TYPE_CONFIGS[type]
}

/**
 * Validate if a block type is allowed for a profile type
 */
export function isBlockAllowed(profileType: ProfileType, blockType: BlockType): boolean {
  const config = getProfileConfig(profileType)
  return config.allowedBlocks.includes(blockType)
}
