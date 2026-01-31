# Profile Builder Guide

The Profile Builder is a drag-and-drop system that allows users to customize their profiles with modular content blocks.

## Quick Start

1. Navigate to `/profile` and click the **"Builder"** tab
2. Click blocks in the sidebar to add them to your profile
3. Drag blocks to reorder them
4. Click the edit icon on any block to customize its content
5. Click **"Save Changes"** when done

## Profile Types

DevPump supports 4 profile types, each with different allowed blocks and limits:

### Personal (Individual Developers)
- **Max blocks:** 10
- **Required blocks:** wallet-display, skills
- **Available blocks:** text, image, wallet-display, skills, projects, social-links, achievements, github-stats

### Team (Development Teams)
- **Max blocks:** 15
- **Required blocks:** team-members
- **Available blocks:** text, image, team-members, projects, social-links, achievements, roadmap

### Community (DAOs & Communities)
- **Max blocks:** 12
- **Required blocks:** text
- **Available blocks:** text, image, team-members, projects, social-links, testimonials, roadmap

### Project (Individual Projects)
- **Max blocks:** 12
- **Required blocks:** text, roadmap
- **Available blocks:** text, image, team-members, social-links, roadmap, tokenomics, github-stats, achievements

## Block Types

### Text Block 📝
Add custom text content with an optional title. Supports multiline text.

### Wallet Display Block 👛
Shows your Solana wallet address. Option to display full address or truncated.

### Skills Block ⚡
Add and display your technical skills as tags. Skills are displayed as badges.

### Projects Block 🚀
Showcase your featured projects. Projects are pulled from your projects list.

### Team Members Block 👥
Display team members with avatars and roles. For Team and Community profiles.

### Roadmap Block 🗺️
Show project milestones with status (pending, in-progress, completed).

### Social Links Block 🔗
GitHub, Twitter, website, and other social profiles.

### Achievements Block 🏆
Display badges, awards, and accomplishments.

### Testimonials Block 💬
Show reviews and endorsements from other users.

### Tokenomics Block 💰
Display token distribution information (for Project profiles).

### GitHub Stats Block 📊
Show contribution graphs and GitHub activity.

## Implementation Details

### Architecture

```
ProfileBuilder (Main Component)
├── BuilderCanvas (Drag-drop area)
│   └── SortableBlock (Wrapper for each block)
│       └── ContentBlockWrapper
│           └── [Specific Block Component]
└── BlockPalette (Sidebar with available blocks)
```

### State Management

The builder uses Zustand for global state management:

```typescript
import { useProfileBuilder } from '@/hooks/use-profile-builder'

const {
  blocks,           // Current blocks array
  profileType,      // Current profile type
  config,           // Profile type configuration
  addBlock,         // Add a new block
  removeBlock,      // Remove a block
  updateBlock,      // Update block data
  reorderBlocks,    // Change block order
  saveLayout,       // Save to database
  canAddBlock,      // Check if can add more
  validateLayout,   // Validate required blocks
} = useProfileBuilder({ userId, initialProfileType })
```

### Data Structure

Blocks are stored in the database as JSONB:

```typescript
interface ContentBlock {
  id: string
  type: BlockType
  position: { x: number; y: number; w: number; h: number }
  data: Record<string, any>  // Block-specific data
  isVisible: boolean
}
```

### Creating New Block Types

1. Add type to `types/profile.ts`:
```typescript
export type BlockType = 'existing-types' | 'new-block-type'
```

2. Create block component in `components/profile-builder/content-blocks.tsx`:
```typescript
export function NewBlockTypeBlock({ block, onUpdate, isEditing }: TextBlockProps) {
  // Implementation
}
```

3. Add to block renderer in `builder-canvas.tsx`:
```typescript
case 'new-block-type':
  return <NewBlockTypeBlock {...props} />
```

4. Add definition to `block-palette.tsx`:
```typescript
'new-block-type': {
  icon: '🆕',
  label: 'New Block',
  description: 'Description here',
  color: 'from-color-500/20 to-color-500/20 border-color-500/30'
}
```

5. Update profile type configs in `types/profile.ts` to include the new block type in `allowedBlocks`.

## API Endpoints

The builder uses these API endpoints:

- `GET /api/users/:id` - Load profile layout
- `PUT /api/users/:id` - Save profile layout
  - Body: `{ profile_layout: LayoutConfig, profile_type: ProfileType }`

## Database Schema

```sql
ALTER TABLE users 
  ADD COLUMN profile_type TEXT DEFAULT 'personal',
  ADD COLUMN profile_layout JSONB DEFAULT '{"blocks": [], "theme": "default"}',
  ADD COLUMN privacy_settings JSONB DEFAULT '{}';
```

## Usage Examples

### Basic Integration

```tsx
import { ProfileBuilder } from '@/components/profile-builder/profile-builder'

function MyProfilePage() {
  const { user } = useWallet()
  
  return (
    <ProfileBuilder 
      userId={user.id} 
      initialProfileType={user.profile_type || 'personal'}
    />
  )
}
```

### Custom Validation

```typescript
const { validateLayout } = useProfileBuilder({ userId, initialProfileType })

const validation = validateLayout()
if (!validation.valid) {
  console.log('Missing blocks:', validation.missingBlocks)
}
```

## Tips for Contributors

1. **Testing blocks:** Use Preview mode to see how blocks appear to viewers
2. **Validation:** Always validate required blocks before saving
3. **Performance:** Blocks are lazy-loaded for better performance
4. **Accessibility:** All blocks support keyboard navigation
5. **Mobile:** Builder is responsive and works on mobile devices

## Known Limitations

- Maximum of 15 blocks per profile (varies by type)
- Some blocks require data from other parts of the app (e.g., Projects block)
- Drag-and-drop requires JavaScript enabled
- Layout is saved to database on explicit "Save" action

## Future Enhancements

- [ ] Import/export profile layouts
- [ ] Profile templates
- [ ] Block preview before adding
- [ ] Undo/redo functionality
- [ ] Block duplication
- [ ] Advanced layout options (multi-column)
- [ ] Block animations and transitions
- [ ] AI-assisted content suggestions
