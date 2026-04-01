# Plan: Refactor Data Shape Structure

## Context

The current data types use flat, duplicated fields across `SocialPostData`, `TaskData`, and `EditorialData`. Engagement counters, media fields, bid info, and thread metadata are copy-pasted identically. `ChatMessage` stores sender data as 3 flat strings instead of using the existing `Author` type. `TaskData` has both `status` (untyped string) and `taskStatus` (properly typed) — a semantic conflict.

Another agent is currently handling file organization (splitting `domain.type.ts`, moving types to `src/shared/types/`, updating imports). This plan focuses purely on **data shape improvements** and should be applied after or alongside that work.

---

## Step 1: Extract shared sub-interfaces into `src/shared/types/feed.types.ts`

Add these new interfaces:

```typescript
export interface EngagementStats {
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
}

export interface MediaContent {
  images?: string[];
  video?: string;
  voiceNote?: string;
}

export interface BidInfo {
  amount: string;
  status: BidStatus;
}

export interface ThreadInfo {
  count: number;
  index: number;
}
```

## Step 2: Refactor `SocialPostData`

**Before:**
```typescript
export interface SocialPostData {
  // ...
  images?: string[];
  video?: string;
  voiceNote?: string;
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
  isBid?: boolean;
  bidAmount?: string;
  bidStatus?: BidStatus;
  threadCount?: number;
  threadIndex?: number;
  isFirstPost?: boolean;
}
```

**After:**
```typescript
export interface SocialPostData {
  id: string;
  type: 'social';
  author: Author;
  content: string;
  media?: MediaContent;
  timestamp: string;
  engagement: EngagementStats;
  replyAvatars?: string[];
  bid?: BidInfo;
  quote?: FeedItem;
  thread?: ThreadInfo;
  isFirstPost?: boolean;
}
```

## Step 3: Refactor `TaskData`

**Before:**
```typescript
export interface TaskData {
  // ... plus: images?, video?, voiceNote?, replies, reposts, shares, votes, status?, taskStatus?
}
```

**After:**
```typescript
export interface TaskData {
  id: string;
  type: 'task';
  author: Author;
  category: string;
  title: string;
  description: string;
  price: string;
  timestamp: string;
  status: TaskStatus;               // single unified field, remove `taskStatus`
  icon: React.ReactNode;
  details?: string;
  tags?: string[];
  meta?: string;
  engagement: EngagementStats;
  mapUrl?: string;
  media?: MediaContent;
  quote?: FeedItem;
  isFirstPost?: boolean;
  isFirstTask?: boolean;
  assignedWorker?: Author;
  acceptedBidAmount?: string;
}
```

Key change: Merge `status?: string` and `taskStatus?: TaskStatus` into a single `status: TaskStatus`. The store's `updateTaskStatus` currently writes to `.status`, while UI reads `.taskStatus` with fallback. Unifying resolves this.

## Step 4: Refactor `EditorialData`

**Before:**
```typescript
export interface EditorialData {
  // ... plus: replies, reposts, shares, votes, isFirstPost?
}
```

**After:**
```typescript
export interface EditorialData {
  id: string;
  type: 'editorial';
  author: Author;
  tag: string;
  title: string;
  excerpt: string;
  timestamp: string;
  engagement: EngagementStats;
  quote?: FeedItem;
  isFirstPost?: boolean;
}
```

## Step 5: Refactor `ChatMessage` in `src/shared/types/chat.types.ts`

**Before:**
```typescript
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
}
```

**After:**
```typescript
export interface ChatMessage {
  id: string;
  sender: Author;
  content: string;
  timestamp: string;
  isMe: boolean;
}
```

## Step 6: Update store operations in `src/store/feed.slice.ts`

All engagement operations need to target `item.engagement.*` instead of `item.*`:

| Operation | Before | After |
|-----------|--------|-------|
| `incrementVotes` | `{ ...item, votes: (item.votes \|\| 0) + 1 }` | `{ ...item, engagement: { ...item.engagement, votes: item.engagement.votes + 1 } }` |
| `decrementVotes` | `{ ...item, votes: item.votes - 1 }` | `{ ...item, engagement: { ...item.engagement, votes: item.engagement.votes - 1 } }` |
| `incrementReplies` | `{ ...item, replies: (item.replies \|\| 0) + 1 }` | `{ ...item, engagement: { ...item.engagement, replies: item.engagement.replies + 1 } }` |
| `incrementReposts` | `{ ...item, reposts: (item.reposts \|\| 0) + 1 }` | `{ ...item, engagement: { ...item.engagement, reposts: item.engagement.reposts + 1 } }` |
| `incrementShares` | `{ ...item, shares: (item.shares \|\| 0) + 1 }` | `{ ...item, engagement: { ...item.engagement, shares: item.engagement.shares + 1 } }` |
| `updateTaskStatus` | `{ ...item, status }` | `{ ...item, status }` (no change, now uses proper `TaskStatus`) |
| `getTasksByStatus` | `item.status === status` | `item.status === status` (no change) |
| `getFilteredItems` | `item.status as TaskStatus` | `item.status` (no cast needed) |

## Step 7: Update component access patterns

### `src/features/feed/components/FeedItems.Component.tsx`

| Line | Before | After |
|------|--------|-------|
| 53 | `parentPost.replies === 0` | `parentPost.engagement.replies === 0` |
| 267 | `votes={data.votes} replies={data.replies} reposts={data.reposts} shares={data.shares}` | `votes={data.engagement.votes} replies={data.engagement.replies} reposts={data.engagement.reposts} shares={data.engagement.shares}` |
| 268 | `data.replies > 0` | `data.engagement.replies > 0` |
| 271 | `data.replies` | `data.engagement.replies` |
| 315 | `spData.isBid && spData.bidStatus !== 'accepted'` | `spData.bid && spData.bid.status !== 'accepted'` |
| 320 | `{ bidStatus: 'accepted' }` | `{ bid: { ...spData.bid!, status: 'accepted' } }` |
| 324-326 | `spData.threadCount`, `spData.threadIndex` | `spData.thread?.count`, `spData.thread?.index` |
| 351 | `spData.isBid` | `spData.bid` |
| 358 | `spData.bidAmount` | `spData.bid?.amount` |
| 361,367 | `spData.bidStatus === 'accepted'` | `spData.bid?.status === 'accepted'` |
| 394-402 | `spData.images`, `spData.video`, `spData.voiceNote` | `spData.media?.images`, `spData.media?.video`, `spData.media?.voiceNote` |
| 449 | `task.status` (display) | `task.status` (now typed) |
| 483-501 | `task.images`, `task.video`, `task.voiceNote` | `task.media?.images`, `task.media?.video`, `task.media?.voiceNote` |

### `src/features/feed/components/TaskMainContent.Component.tsx`

| Line | Before | After |
|------|--------|-------|
| 37 | `task.taskStatus \|\| 'open'` | `task.status` (always typed) |
| 67-69 | `task.status` (display) | `task.status` |
| 115 | `task.taskStatus` | `task.status` |
| 176-229 | `task.images`, `task.video`, `task.voiceNote` | `task.media?.images`, `task.media?.video`, `task.media?.voiceNote` |
| 260 | `votes={task.votes} replies={task.replies}...` | `votes={task.engagement.votes} replies={task.engagement.replies}...` |

### `src/features/feed/components/post-detail/TaskActionFooter.Component.tsx`

| Line | Before | After |
|------|--------|-------|
| 37 | `task.taskStatus \|\| TASK_STATUS.OPEN` | `task.status` |

### `src/features/feed/pages/PostDetail.Page.tsx`

| Line | Before | After |
|------|--------|-------|
| 61 | `{ bidStatus: 'accepted' }` | `{ bid: { ...existingBid, status: 'accepted' } }` |
| 66 | `bid.bidAmount` | `bid.bid?.amount` |
| 64,73,78,84 | `taskStatus: TASK_STATUS.*` | `status: TASK_STATUS.*` |
| 120-122 | `isBid: true, bidAmount: ..., bidStatus: ...` | `bid: { amount: ..., status: 'accepted' }` |
| 127 | `taskStatus: TASK_STATUS.ASSIGNED` | `status: TASK_STATUS.ASSIGNED` |
| 236-237 | `.threadCount` | `.thread?.count` |

### `src/features/chat/components/ChatRoom.Component.tsx`

| Line | Before | After |
|------|--------|-------|
| 27-29 | `senderId: 'me', senderName: 'Me', senderAvatar: '...'` | `sender: { name: 'Me', handle: 'me', avatar: '...' }` |
| 108 | `msg.senderAvatar` | `msg.sender.avatar` |

### `src/shared/constants/domain.constant.tsx`

Update all sample data objects to use the new nested shapes:

- Engagement: `replies: 0, reposts: 0, shares: 0, votes: 0` → `engagement: { replies: 0, reposts: 0, shares: 0, votes: 0 }`
- Media: `images: [...]` → `media: { images: [...] }`
- Bid: `isBid: true, bidAmount: ..., bidStatus: ...` → `bid: { amount: ..., status: ... }`
- Thread: `threadCount: N, threadIndex: N` → `thread: { count: N, index: N }`
- Chat sender: `senderId: ..., senderName: ..., senderAvatar: ...` → `sender: { name: ..., handle: ..., avatar: ... }`
- Task status: `status: TASK_STATUS.OPEN` (keep, remove `taskStatus` if present)

## Step 8: Run typecheck

```bash
npx tsc --noEmit
```

## Files affected

| File | Changes |
|------|---------|
| `src/shared/types/feed.types.ts` | Add 4 sub-interfaces, refactor 3 data types |
| `src/shared/types/chat.types.ts` | Refactor `ChatMessage` to use `sender: Author` |
| `src/store/feed.slice.ts` | Update all engagement operations, remove `taskStatus` casts |
| `src/features/feed/components/FeedItems.Component.tsx` | Update ~20 field accesses |
| `src/features/feed/components/TaskMainContent.Component.tsx` | Update ~10 field accesses |
| `src/features/feed/components/post-detail/TaskActionFooter.Component.tsx` | Update 1 field access |
| `src/features/feed/pages/PostDetail.Page.tsx` | Update ~10 field accesses |
| `src/features/chat/components/ChatRoom.Component.tsx` | Update 2 construction sites |
| `src/shared/constants/domain.constant.tsx` | Update all sample data objects |

## Risk notes

- The `PostDetail.Page.tsx` bid acceptance logic writes `{ bidStatus: 'accepted' }` via `updateReply`. After refactoring, it must spread the existing bid object: `{ bid: { ...existingBid, status: 'accepted' } }`. Need to verify `existingBid` is available in scope or restructure the update.
- `feed.slice.ts` `updateTaskStatus` writes to `item.status` — this aligns with the new unified `status: TaskStatus` field, so no change needed there.
- `getFilteredItems` casts `item.status as TaskStatus` — after refactoring, `status` is already `TaskStatus`, so the cast can be removed.
