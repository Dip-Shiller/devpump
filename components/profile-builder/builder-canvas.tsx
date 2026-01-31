'use client'

import { useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ContentBlock } from '@/types/profile'
import { ContentBlockWrapper, TextBlock, WalletDisplayBlock, SkillsBlock, ProjectsBlock, TeamMembersBlock, RoadmapBlock } from './content-blocks'
import { Card } from '@/components/ui/card'

interface BuilderCanvasProps {
  blocks: ContentBlock[]
  onReorder: (oldIndex: number, newIndex: number) => void
  onUpdateBlock: (blockId: string, data: Partial<ContentBlock>) => void
  onRemoveBlock: (blockId: string) => void
  isEditMode: boolean
}

function SortableBlock({
  block,
  onUpdate,
  onRemove,
  isEditMode,
}: {
  block: ContentBlock
  onUpdate: (data: Partial<ContentBlock>) => void
  onRemove: () => void
  isEditMode: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: !isEditMode })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderBlockContent = () => {
    const props = { block, onUpdate, isEditing: isEditMode }

    switch (block.type) {
      case 'text':
        return <TextBlock {...props} />
      case 'wallet-display':
        return <WalletDisplayBlock {...props} />
      case 'skills':
        return <SkillsBlock {...props} />
      case 'projects':
        return <ProjectsBlock {...props} />
      case 'team-members':
        return <TeamMembersBlock {...props} />
      case 'roadmap':
        return <RoadmapBlock {...props} />
      default:
        return (
          <div className="text-sm text-muted-foreground">
            Block type "{block.type}" not yet implemented
          </div>
        )
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ContentBlockWrapper
        block={block}
        onUpdate={onUpdate}
        onRemove={onRemove}
        isEditing={isEditMode}
        isDragging={isDragging}
      >
        {renderBlockContent()}
      </ContentBlockWrapper>
    </div>
  )
}

export function BuilderCanvas({
  blocks,
  onReorder,
  onUpdateBlock,
  onRemoveBlock,
  isEditMode,
}: BuilderCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id)
      const newIndex = blocks.findIndex((b) => b.id === over.id)
      onReorder(oldIndex, newIndex)
    }
  }

  if (blocks.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <div className="space-y-4">
          <div className="text-6xl">📦</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Your canvas is empty</h3>
            <p className="text-muted-foreground">
              {isEditMode
                ? 'Add blocks from the sidebar to start building your profile'
                : 'Switch to edit mode to add content blocks'}
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              onUpdate={(data) => onUpdateBlock(block.id, data)}
              onRemove={() => onRemoveBlock(block.id)}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
