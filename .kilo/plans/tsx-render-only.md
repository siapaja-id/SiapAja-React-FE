# Plan: Refactor TSX Files to Rendering-Only Concern

## Context

37 TSX files exist; 22 contain non-rendering logic (business logic, state management side effects, data transformations, mock data). Goal: TSX files handle only rendering — layout, styling, conditional rendering, JSX composition. Non-rendering logic extracted to `.ts` files (hooks + services).

## Architecture

- **Hooks (`hooks/*.ts`)** — stateful logic (useState, useEffect, store subscriptions, derived state)
- **Services (`services/*.ts`)** — pure functions (data construction, transformations, calculations)
- **Data (`data/*.ts`)** — mock/hardcoded arrays from `domain.constant.tsx`
- **`domain.constant.tsx`** → split into `domain.constant.ts` + `data/mock.*.ts` + `constants/category-icons.tsx`

## New Directory Layout

```
src/shared/data/                   # mock-authors.ts, mock-feeds.ts, mock-gigs.ts, mock-chats.ts
src/shared/constants/category-icons.tsx  # JSX icon map
src/shared/services/feed.service.ts     # getReplies, reply generation
src/shared/ui/hooks/               # usePostActions.ts, useSharedUI.ts
src/features/feed/hooks/           # usePostDetail.ts, useCreatePost.ts, useFeedCard.ts
src/features/feed/services/        # post-detail.service.ts
src/features/gigs/hooks/           # useRadar.ts, usePayment.ts
src/features/creation/hooks/       # useAIChat.ts
src/features/chat/hooks/           # useChatRoom.ts, useInbox.ts
src/features/kanban/hooks/         # useKanbanColumn.ts, useDesktopKanbanLayout.ts
src/features/profile/hooks/        # useProfile.ts
src/features/wallet/hooks/         # useWallet.ts
src/features/settings/hooks/       # useSettings.ts
src/App.hook.ts                    # App-level side effects
```

## Execution Steps

### Step 1: Extract mock data from `domain.constant.tsx`

| New File | Content |
|----------|---------|
| `src/shared/data/mock-authors.ts` | `MOCK_AUTHORS` |
| `src/shared/data/mock-feeds.ts` | `SAMPLE_DATA` |
| `src/shared/data/mock-gigs.ts` | `GIGS` |
| `src/shared/data/mock-chats.ts` | `SAMPLE_CHATS`, `SAMPLE_INBOX_THREADS` |
| `src/shared/constants/category-icons.tsx` | `CATEGORY_ICONS` (JSX) |

Rename `domain.constant.tsx` → `domain.constant.ts`. Keep: `TASK_STATUS`, `STORAGE_KEY`, `VALID_*`, `TASK_STATUS_COLORS`, `TASK_STATUS_ORDER`. Remove all imports of React/lucide.

### Step 2: Extract `getReplies` to service

**`src/shared/services/feed.service.ts`**
- Move `threadCache`, `getReplies()` from `FeedItems.Component.tsx` (lines 20-88)
- Pure function, depends only on `MOCK_AUTHORS` and types

### Step 3: Hooks for SEVERE violations (4 files)

**`src/features/feed/hooks/usePostDetail.ts`** ← `PostDetail.Page.tsx`
- Store subscriptions (lines 21-28)
- All useState (lines 33-51)
- Derived: `currentPost`, `localReplies`, `defaultBid`, `isNegotiable`, `isCreator`, `isAssignedToMe`
- All handlers: `handleAcceptBid`, `handleStartTask`, `handleCompleteTask`, `handleReviewTask`, `handleAction`, `handleBidSubmit`, `handleFullscreenReply`, `handleSendReply`, `scrollToBottom`, `handleBack`
- Both useEffects (lines 89-99)
- Returns `{ currentPost, localReplies, handleBack, handleSendReply, ... }`

**`src/features/feed/hooks/useFeedCard.ts`** ← `FeedItems.Component.tsx`
- `handleCardClick`, `handleUserClick` (lines 194-208)
- `handleAcceptBid` from SocialPost (lines 319-323), `canAcceptBid`
- Store: `currentUser`, `openColumn`, `isDesktop`
- ColumnContext access

**`src/features/gigs/hooks/useRadar.ts`** ← `Radar.Page.tsx`
- All state (lines 192-207)
- Store subscriptions (lines 196-201)
- Auto-Pilot useEffect (lines 210-217)
- `handleSwipe`, `advanceNext`, `handleBidSubmit`, `handleContinue`
- `visibleGigs` computation (lines 260-264)

**`src/features/creation/hooks/useAIChat.ts`** ← `AIChatRequest.Component.tsx`
- All useState (lines 10-19), useRef (lines 21-23)
- Both useEffects (lines 25-38)
- `addMessage`, `updateDraft`, `insertMediaToCanvas`, `handleSend`, `processAIResponse`, `handleOpenMap`, `confirmMapLocation`

### Step 4: Hooks for MODERATE violations (8 files)

| Hook | Source File | Extracted Logic |
|------|-------------|-----------------|
| `src/features/feed/hooks/useCreatePost.ts` | `CreatePost.Page.tsx` | Store subs, threads state, `addThread`/`removeThread`/`updateThread`/`handlePost`/`calculateProgress` |
| `src/features/chat/hooks/useChatRoom.ts` | `ChatRoom.Component.tsx` | Store subs, auto-scroll, `handleSend` |
| `src/features/kanban/hooks/useKanbanColumn.ts` | `KanbanColumn.tsx` | Store subs, `startResize`, resize useEffect |
| `src/shared/ui/hooks/usePostActions.ts` | `PostActions.Component.tsx` | Store subs, vote calc, `handleUpvote`/`handleDownvote` |
| `src/shared/ui/hooks/useSharedUI.ts` | `SharedUI.Component.tsx` | FollowButton store/toggle, AutoResizeTextarea height logic |
| `src/features/gigs/hooks/usePayment.ts` | `Payment.Page.tsx` | Store subs, `handlePayment` timeout chain, redirect guard |
| `src/features/feed/services/post-detail.service.ts` | `PostDetail.Page.tsx` | Bid/reply/CreationContext object construction (pure functions) |
| `src/features/feed/components/TaskMainContent.hook.ts` | `TaskMainContent.Component.tsx` | `handleClaim`, markdown body construction |

### Step 5: Hooks for MINOR violations (7 files)

| Hook | Source File | Extracted Logic |
|------|-------------|-----------------|
| `src/features/wallet/hooks/useWallet.ts` | `Wallet.Page.tsx` | TRANSACTIONS mock, tab filtering |
| `src/features/settings/hooks/useSettings.ts` | `Settings.Page.tsx` | Store destructuring |
| `src/features/profile/hooks/useProfile.ts` | `Profile.Page.tsx` | Store subs, navigation, feed filtering, scroll transforms |
| `src/features/chat/hooks/useInbox.ts` | `Inbox.Page.tsx` | Store subs, `handleOpenChat` |
| `src/features/kanban/hooks/useDesktopKanbanLayout.ts` | `DesktopKanbanLayout.tsx` | Auto-scroll useEffect |
| `src/features/kanban/components/FloatingSidebar.hook.ts` | `FloatingSidebar.tsx` | Store subs, nav actions |
| `src/App.hook.ts` | `App.tsx` | MobileLayout nav, theme useEffect, localStorage sub, resize listener |

### Step 6: Update all imports

Update every TSX file to import from new hook/service/data locations. Remove inline logic.

### Step 7: Verify domain.constant.tsx fully migrated

Confirm renamed `.ts` has zero JSX imports. `CATEGORY_ICONS` only in `category-icons.tsx`.

## Post-Refactor TSX Pattern

```tsx
import { usePostDetail } from '../hooks/usePostDetail';
export const PostDetailPage: React.FC = () => {
  const { currentPost, handleBack, handleSendReply, ... } = usePostDetail();
  return <PageSlide><DetailHeader onBack={handleBack} ... /></PageSlide>;
};
```

## Verification

1. `npx tsc --noEmit` — type safety
2. `npm run dev` — runtime check
3. Grep for `useState`, `useEffect`, `useStore` in `.tsx` files — should only appear in extracted hooks
4. Visual check: feed, post detail, radar, chat, profile pages

## File Counts

| Type | Count |
|------|-------|
| New hook files | ~18 |
| New service files | ~3 |
| New data files | ~4 |
| Modified TSX files | 22 |
| Renamed | 1 (.tsx → .ts) |
| New constants | 1 |
| **Total** | ~49 |
