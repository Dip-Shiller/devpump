# Integration Points - Where New Features Appear in the App

## Navigation & Sidebar
**File:** `components/layout/sidebar.tsx`

New section "Collaborate & Connect" added with:
- Collabs → `/collabs`
- Group Chats → `/group-chats`
- Messages → `/messages`
- Daily Updates → `/feed/daily-updates`

Visible to all logged-in users.

---

## Builder Cards
**File:** `components/builder/builder-card.tsx`

**New Element:** `CollabButton` at bottom of each builder card
- Shows "Add Collab" for non-connected users
- Shows "Collab ✓" for accepted connections
- Shows "Request Sent" for pending requests
- Shows "Accept Collab" for incoming requests

**How it works:**
```typescript
<CollabButton 
  userId={user.id} 
  targetUserId={builder.id} 
  className="w-full"
/>
```

Users can add collabs directly from the builders directory.

---

## Profile Page
**File:** `app/profile/page.tsx`

**Enhanced with 3 tabs:**

### Tab 1: Profile Info (Existing)
- Username, display name, bio
- Social links (Twitter, GitHub, website)
- Avatar URL

### Tab 2: Photos (NEW)
- Upload photo by URL
- Gallery grid view
- Set primary photo
- Delete photos

### Tab 3: Daily Updates (NEW)
- Post daily updates
- Visibility controls (Public/Collab-only/Private)
- View personal update history
- Delete updates

---

## Messages Area
**File:** `app/messages/page.tsx` (to be updated)

Consider adding:
- Distinction between P2P messages (collabs) and group messages
- Quick access to recent collabs
- Group chat integration

---

## New Standalone Pages

### 1. Collabs Page
**Path:** `/collabs`
**File:** `app/collabs/page.tsx`

Two tabs:
- **Active Collabs** - Established connections (can message)
- **Requests** - Pending collab requests (accept/decline)

Shows:
- Connection date
- Quick message button
- Accept/Decline options

---

### 2. Group Chats Page
**Path:** `/group-chats`
**File:** `app/group-chats/page.tsx`

Features:
- Create new group (form popup)
- List all user's groups
- Click to open chat
- Manage group settings (admin only)

Shows:
- Group name & description
- Member count
- Group image (if available)

---

### 3. Daily Updates Feed
**Path:** `/feed/daily-updates`
**File:** `app/feed/daily-updates/page.tsx`

Features:
- Post update form at top
- Infinite scroll feed
- Like updates
- Delete own updates
- Filter by visibility

Shows:
- All public updates
- Update content
- Author info
- Like count
- Timestamps

---

## Features Throughout the App

### When Logged In - Users See:
```
Sidebar:
├── Collabs (pending requests badge)
├── Group Chats (unread count)
├── Messages (existing)
└── Daily Updates Feed

Builder Cards:
└── Collab Button (context-aware state)

Profile:
├── Photos Tab (new)
├── Daily Updates Tab (new)
└── Edit Info Tab (existing)
```

### Quick Access Points:
1. **Add Collab:** Click button on any builder card
2. **Create Group:** `/group-chats` → Click "+ New"
3. **Post Update:** `/profile` → "Daily Updates" tab
4. **View Feed:** `/feed/daily-updates`
5. **Manage Collabs:** `/collabs`

---

## Data Flow Diagram

### Collab Creation Flow:
```
User A (Builder Card)
    ↓
  [Add Collab Button]
    ↓
  POST /api/collabs
    ↓
  Create collab record (pending)
    ↓
  User B gets notification (if implemented)
    ↓
  User B sees request in /collabs → Accept/Decline
    ↓
  Status updates to "accepted"
    ↓
  Both users can now message
```

### Group Chat Flow:
```
User clicks Group Chat Creation
    ↓
  Form: Name, Description, Privacy
    ↓
  POST /api/group-chats
    ↓
  Group created with owner as admin
    ↓
  /api/group-chats?action=addMember
    ↓
  Members can now send messages
    ↓
  POST /api/group-chats?action=sendMessage
    ↓
  Messages appear in chat history
```

### Profile Update Flow:
```
User goes to /profile → Daily Updates tab
    ↓
  Write update content
    ↓
  Choose visibility
    ↓
  POST /api/profile-updates
    ↓
  Update stored in DB
    ↓
  Appears in:
    - User's /profile (always)
    - /feed/daily-updates (if public)
    - Collab feeds (if collab_only + user is collab)
```

---

## Component Hierarchy

```
App Layout
├── Sidebar (updated with new nav)
│   └── New menu items link to pages
│
├── BuilderCard (in /builders)
│   └── CollabButton (new)
│
├── Profile (enhanced)
│   ├── Profile Info Tab
│   ├── Photos Tab (new)
│   │   └── ProfilePhotoGrid
│   │       └── ProfilePhotoCard
│   └── Daily Updates Tab (new)
│       └── ProfileUpdateForm
│       └── ProfileUpdateCard[]
│
├── Collabs Page (new)
│   ├── Tab: Active Collabs
│   │   └── CollabCardView[]
│   └── Tab: Requests
│       └── Request Card[]
│
├── Group Chats Page (new)
│   ├── GroupChatForm
│   └── GroupChatList
│       └── GroupChatCard[]
│
└── Daily Updates Feed (new)
    ├── ProfileUpdateForm
    └── ProfileUpdateCard[]
```

---

## State Management

### Using Custom Hooks:
```typescript
// In any component
const { getCollabs, createCollab, isLoading } = useCollabs()
const { getGroupChats, sendGroupMessage } = useGroupChats()
const { getProfilePhotos, uploadProfilePhoto } = useProfilePhotos()
const { getProfileUpdates, likeProfileUpdate } = useProfileUpdates()
```

### Auth Context:
```typescript
const { user, isLoading } = useWallet()
// User object available throughout app
```

---

## Real-Time Ready

Although WebSocket is not yet implemented, the structure supports it:

```typescript
// Could add to use-realtime.ts:
export function useRealtimeGroupMessages(groupId: string) {
  // Subscribe to new messages for this group
}

export function useRealtimeCollabNotifications(userId: string) {
  // Get live collab request notifications
}

export function useRealtimeUpdateLikes(updateId: string) {
  // Get live like count updates
}
```

---

## Mobile Responsiveness

All new components are mobile-friendly:
- Collabs: Stack on mobile
- Group Chats: Grid reduces to 1 column on mobile
- Photos: Responsive grid (2 cols on mobile, 4 on desktop)
- Updates: Full width on mobile with proper spacing

---

## Accessibility

Features include:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Alt text for images
- Color contrast compliance
- Loading states for UX

---

## Testing Integration Points

### To Verify Everything Works:

1. **Login** → See new sidebar items
2. **Go to /builders** → Click "Add Collab" on a card
3. **Go to /collabs** → See collab requests/active
4. **Go to /group-chats** → Create group, add members
5. **Go to /profile** → Upload photo, post update
6. **Go to /feed/daily-updates** → See public feed
7. **Mobile** → Check responsiveness
8. **Permissions** → Verify users can't see others' private data

---

## Production Checklist

- [ ] Database schema deployed to production
- [ ] All API routes tested
- [ ] Error handling verified
- [ ] Rate limiting considered
- [ ] Audit logging for important actions
- [ ] User analytics tracked
- [ ] Performance monitoring set up
- [ ] Backup strategy verified
- [ ] Security audit completed
- [ ] Documentation updated

---

## Future Integration Opportunities

1. **Real-time Updates** - Add WebSocket subscriptions
2. **Notifications** - Alert users of collab requests, messages
3. **Search** - Find users, groups, updates
4. **Tagging** - Tag users in updates
5. **Reactions** - Emoji reactions to updates
6. **Comments** - Threaded comments on updates
7. **Analytics** - Track engagement metrics
8. **Moderation** - Report/block functionality
9. **Export** - Download updates/photos
10. **Integrations** - Connect with external services
