# Extension Guide - Adding to New Features

This guide shows how to extend the new features with additional functionality.

## 1. Add Message Notifications for Collabs

### Step 1: Update Database
```sql
-- Add to lib/schema.sql
ALTER TABLE collabs ADD COLUMN last_message_at TIMESTAMPTZ;

-- Add notification for new collab requests
INSERT INTO notifications (user_id, type, title, message, link)
VALUES (
  NEW.receiver_id,
  'collab_request',
  'New Collab Request',
  'Someone wants to collaborate with you!',
  '/collabs'
);
```

### Step 2: Add to Hook
```typescript
// In hooks/use-api.ts
export function useCollabs() {
  const api = useApi()
  
  // Add notification check
  const getCollabRequests = useCallback((userId: string) => {
    return api.get(`/api/collabs?userId=${userId}&type=pending`)
  }, [api])
  
  return { ...api, getCollabRequests, /* ... */ }
}
```

---

## 2. Add Real-Time Group Messages

### Step 1: Extend useRealtime
```typescript
// In hooks/use-realtime.ts
export function useRealtimeGroupMessages(groupId: string) {
  const [messages, setMessages] = useState<GroupMessage[]>([])
  
  useEffect(() => {
    const channel = supabase
      .channel(`group_messages:${groupId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_chat_id=eq.${groupId}`
        },
        (payload) => {
          setMessages(prev => [prev, payload.new])
        }
      )
      .subscribe()
    
    return () => channel.unsubscribe()
  }, [groupId])
  
  return messages
}
```

### Step 2: Use in Component
```typescript
// In app/group-chats/[id]/page.tsx (new page)
export default function GroupChatPage({ params }) {
  const liveMessages = useRealtimeGroupMessages(params.id)
  const storedMessages = useGroupMessages(params.id)
  const allMessages = [...storedMessages, ...liveMessages]
  
  return <MessageList messages={allMessages} />
}
```

---

## 3. Add Search for Builders (for Collab Discovery)

### Step 1: Update useApi
```typescript
// In hooks/use-api.ts
export function useBuilders() {
  const api = useApi()
  
  const searchBuilders = useCallback((query: string, skills?: string[]) => {
    const params = new URLSearchParams({
      search: query,
      ...(skills?.length && { skill: skills[0] })
    })
    return api.get(`/api/users?${params}`)
  }, [api])
  
  return { ...api, searchBuilders }
}
```

### Step 2: Add Search Component
```typescript
// New: components/builder-search.tsx
export function BuilderSearch() {
  const { searchBuilders, data: results } = useBuilders()
  const [query, setQuery] = useState('')
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    searchBuilders(e.target.value)
  }
  
  return (
    <>
      <Input placeholder="Search builders..." onChange={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results?.users?.map(builder => (
          <BuilderCard key={builder.id} builder={builder} />
        ))}
      </div>
    </>
  )
}
```

---

## 4. Add Collab Directory/List

### Step 1: Enhance useCollabs
```typescript
export function useCollabs() {
  const api = useApi()
  
  const getCollabsWithDetails = useCallback((userId: string) => {
    return api.get(`/api/collabs?userId=${userId}&includeDetails=true`)
  }, [api])
  
  return { ...api, getCollabsWithDetails }
}
```

### Step 2: Enhance API Route
```typescript
// In app/api/collabs/route.ts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const includeDetails = searchParams.get('includeDetails') === 'true'
  
  const collabs = await getCollabs(userId)
  
  if (includeDetails) {
    // Fetch user details for each collab
    const withDetails = await Promise.all(
      collabs.map(async (collab) => {
        const partnerId = collab.user_id_1 === userId ? collab.user_id_2 : collab.user_id_1
        const partner = await getUserById(partnerId)
        return { ...collab, partner }
      })
    )
    return NextResponse.json({ collabs: withDetails })
  }
  
  return NextResponse.json({ collabs })
}
```

---

## 5. Add Photo Albums in Group Chats

### Step 1: Extend Group Chats
```sql
-- Add to lib/schema.sql
CREATE TABLE group_chat_albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_chat_id UUID REFERENCES group_chats(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE album_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID REFERENCES group_chat_albums(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Add Database Functions
```typescript
// In lib/db.ts
export async function createAlbum(groupChatId: string, title: string) {
  return await supabase.from('group_chat_albums')
    .insert({ group_chat_id: groupChatId, title })
    .select().single()
}

export async function addPhotoToAlbum(albumId: string, photoUrl: string, uploaderId: string) {
  return await supabase.from('album_photos')
    .insert({ album_id: albumId, photo_url: photoUrl, uploaded_by: uploaderId })
    .select().single()
}
```

---

## 6. Add Update Comments/Replies

### Step 1: Create Replies Table
```sql
-- Add to lib/schema.sql
CREATE TABLE profile_update_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  update_id UUID REFERENCES profile_updates(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_update_comments ON profile_update_comments(update_id, created_at DESC);
```

### Step 2: Add to Hook
```typescript
export function useProfileUpdates() {
  const api = useApi()
  
  const addComment = useCallback((updateId: string, userId: string, content: string) => {
    return api.post('/api/profile-updates', {
      action: 'comment',
      updateId,
      userId,
      content
    })
  }, [api])
  
  return { ...api, addComment }
}
```

---

## 7. Add User Mentions in Updates

### Step 1: Add Mention Detection
```typescript
// In components/ui/profile-update.tsx
function detectMentions(content: string): string[] {
  const regex = /@(\w+)/g
  const mentions: string[] = []
  let match
  
  while ((match = regex.exec(content)) !== null) {
    mentions.push(match[1])
  }
  
  return mentions
}
```

### Step 2: Add Mention Links
```typescript
function linkMentions(content: string) {
  return content.replace(
    /@(\w+)/g,
    '<a href="/builders/$1" class="text-purple-500">@$1</a>'
  )
}
```

---

## 8. Add Notification System

### Step 1: Create Notifications Hook
```typescript
export function useNotifications() {
  const api = useApi()
  
  const getNotifications = useCallback((userId: string) => {
    return api.get(`/api/notifications?userId=${userId}`)
  }, [api])
  
  const markAsRead = useCallback((notificationId: string) => {
    return api.patch(`/api/notifications/${notificationId}`, { is_read: true })
  }, [api])
  
  return { ...api, getNotifications, markAsRead }
}
```

### Step 2: Add Notification Component
```typescript
export function NotificationBell() {
  const { user } = useWallet()
  const { getNotifications, markAsRead } = useNotifications()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id)
    }
  }, [user?.id])
  
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        🔔 {notifications.length}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4">
          {notifications.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notification={notif}
              onRead={() => markAsRead(notif.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 9. Add Photo Filters/Effects

### Step 1: Add Image Processing
```typescript
// New: lib/image-processing.ts
export async function applyFilter(
  imageUrl: string,
  filter: 'grayscale' | 'sepia' | 'blur' | 'brighten'
): Promise<string> {
  // Use canvas or image processing library
  // Return processed image URL
}
```

### Step 2: Add to Photo Upload
```typescript
export function uploadProfilePhoto(
  userId: string,
  photoUrl: string,
  filter?: string
) {
  const processedUrl = filter 
    ? await applyFilter(photoUrl, filter)
    : photoUrl
    
  return api.post('/api/profile-photos', {
    action: 'upload',
    userId,
    photoUrl: processedUrl
  })
}
```

---

## 10. Add Export/Download

### Step 1: Create Export Function
```typescript
export async function exportCollabs(userId: string) {
  const collabs = await getCollabs(userId)
  const csv = collabs.map(c => `${c.user_id_1},${c.user_id_2},${c.status}`)
  return csv.join('\n')
}

export function downloadAsCSV(data: string, filename: string) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data))
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
```

### Step 2: Add to UI
```typescript
<Button onClick={() => {
  const csv = await exportCollabs(user.id)
  downloadAsCSV(csv, 'collabs.csv')
}}>
  Download as CSV
</Button>
```

---

## Testing Extensions

### Unit Test Example
```typescript
// In __tests__/collabs.test.ts
describe('Collabs', () => {
  it('should create collab request', async () => {
    const result = await createCollab('user1', 'user2')
    expect(result.status).toBe('pending')
    expect(result.user_id_1).toBe('user1')
    expect(result.user_id_2).toBe('user2')
  })
  
  it('should accept collab', async () => {
    const collab = await createCollab('user1', 'user2')
    const result = await acceptCollab(collab.id)
    expect(result.status).toBe('accepted')
  })
})
```

---

## Best Practices for Extensions

1. **Follow Existing Patterns** - Use same hook structure, API patterns
2. **Add Types** - Always define interfaces in `lib/supabase.ts`
3. **Add DB Functions** - Create wrapper functions in `lib/db.ts`
4. **Add RLS Policies** - Secure new data with row-level security
5. **Add Indexes** - Create indexes for frequently queried columns
6. **Test Thoroughly** - Write unit and integration tests
7. **Document Changes** - Update this file with new extension
8. **Update Sidebar** - Add nav items if creating new pages
9. **Mobile First** - Ensure responsive design
10. **Performance** - Monitor query performance, add pagination

---

## Common Extension Patterns

### Adding a New CRUD Entity
```typescript
// 1. Database (lib/schema.sql)
CREATE TABLE entity (...)
CREATE INDEX idx_entity_... 

// 2. Types (lib/supabase.ts)
export interface Entity { ... }

// 3. DB Functions (lib/db.ts)
export async function createEntity(...) { ... }
export async function getEntity(...) { ... }
export async function updateEntity(...) { ... }
export async function deleteEntity(...) { ... }

// 4. API Route (app/api/entity/route.ts)
export async function GET/POST/PUT/DELETE(req) { ... }

// 5. Hook (hooks/use-api.ts)
export function useEntity() { ... }

// 6. Components (components/ui/entity.tsx)
export function EntityCard() { ... }

// 7. Page (app/entity/page.tsx)
export default function EntityPage() { ... }

// 8. Navigation (components/layout/sidebar.tsx)
{ icon: <Icon />, label: 'Entity', href: '/entity' }
```

This pattern ensures consistency throughout the app!
