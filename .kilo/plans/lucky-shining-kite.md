# Plan: Reorganize All Types to src/shared/types/

## Context

All types and interfaces should live in `src/shared/types/`, not in `.tsx` files or scattered across feature directories. Currently:
- `domain.type.ts` is a monolithic 200-line file mixing types from all features
- Feature-specific type files exist in `src/features/*/types/`
- 17 inline anonymous types exist in `.tsx` files
- Store slices define their own interfaces in `src/store/`

## Step 1: Split `domain.type.ts` into feature-specific files

Create new files in `src/shared/types/`:

**`app.types.ts`** — app-level types:
- `TabState`, `ThemeColor`, `TextSize`, `ZoomLevel` (simple types)
- `AppColumn`, `AppSlice` (interfaces)

**`auth.types.ts`** — user/author types:
- `Author`

**`feed.types.ts`** — feed domain types:
- `BidStatus`, `TaskStatus`, `CreationContext`
- `SocialPostData`, `TaskData`, `EditorialData`, `FeedItem`

**`chat.types.ts`** — chat domain types:
- `InboxThread`, `ChatMessage`

**`gigs.types.ts`** — gig domain types:
- `Gig`

**`order.types.ts`** — order domain types:
- `OrderData`

## Step 2: Move feature-specific prop types to shared

Move interfaces from `src/features/*/types/` files into `src/shared/types/`:

**Into `src/shared/types/feed.types.ts`:**
- From `src/features/feed/types/feed.types.ts`: `FeedItemProps`, `MediaCarouselProps`, `ThreadBlock`, `BidSheetProps`, `CompletionSheetProps`, `ReviewSheetProps`, `EmptyRepliesStateProps`, `TaskActionFooterProps`

**Into `src/shared/types/creation.types.ts`** (new file):
- From `src/features/creation/types/creation.types.ts`: `AIChatMessage`, `AIChatRequestProps`, `CreateType`, `SelectionButtonProps`, `SocialFormProps`, `QuickActionCardProps`

**Into `src/shared/types/gigs.types.ts`:**
- From `src/features/gigs/types/gigs.types.ts`: `MatchSuccessProps`, `GigCardProps`, `GigInfoBlockProps`

**Into `src/shared/types/profile.types.ts`** (new file):
- `ProfilePageProps` (extracted from Profile.Page.tsx inline)

**Into `src/shared/types/kanban.types.ts`** (new file):
- `KanbanColumnProps` (extracted from KanbanColumn.tsx inline)
- `ColumnRoutesProps` (extracted from routes.tsx inline)

## Step 3: Move store types to shared

Create `src/shared/types/store.types.ts`:
- `ChatSlice` (from `src/store/chat.slice.ts`)
- `FeedFilters`, `FeedSlice` (from `src/store/feed.slice.ts`)
- `OrderSlice` (from `src/store/order.slice.ts`)
- `StoreState` (from `src/store/main.store.ts`)

## Step 4: Extract inline types from `.tsx` files into `ui.types.ts`

Add these new interfaces to `src/shared/types/ui.types.ts`:

From `src/shared/ui/SharedUI.Component.tsx`:
- `FollowButtonProps` (line 45)
- `SpoilerTextProps` (line 246)
- `LinkPreviewNodeProps` (line 265)
- `RichLinkAnchorProps` (line 359)
- `RichTextProps` (line 375)
- `PageSlideProps` (line 524)

From `src/features/feed/components/FeedItems.Component.tsx`:
- `BaseFeedCardProps` (line 183)
- `SocialPostProps` (line 307)
- `TaskCardProps` (line 440)
- `EditorialCardProps` (line 546)

From `src/features/feed/components/TaskMainContent.Component.tsx`:
- `TaskMainContentProps` (line 11)

From `src/features/feed/components/post-detail/TaskActionFooter.Component.tsx`:
- `StatusIndicatorProps` (line 7)

From `src/features/gigs/components/PaymentOption.Component.tsx`:
- `PaymentOptionProps` (line 4)

From `src/features/creation/components/PropertyRow.Component.tsx`:
- `PropertyRowProps` (line 3)

## Step 5: Update all imports

Update every `.tsx`/`.ts` file that imports from the old locations:
- `@/src/shared/types/domain.type` → new file-specific imports
- `@/src/features/feed/types/feed.types` → `@/src/shared/types/feed.types`
- `@/src/features/creation/types/creation.types` → `@/src/shared/types/creation.types`
- `@/src/features/gigs/types/gigs.types` → `@/src/shared/types/gigs.types`
- Store slice imports of their own interfaces → `@/src/shared/types/store.types`

## Step 6: Delete old files

Remove:
- `src/shared/types/domain.type.ts`
- `src/features/feed/types/feed.types.ts`
- `src/features/creation/types/creation.types.ts`
- `src/features/gigs/types/gigs.types.ts`

## Step 7: Run typecheck

Run `npx tsc --noEmit` to verify all imports resolve correctly and no type errors are introduced.

## Files affected

~30+ files need import updates. Key ones:
- `src/store/*.ts` (5 files)
- `src/shared/ui/*.tsx` (2 files)
- `src/shared/constants/domain.constant.tsx`
- `src/shared/contexts/column.context.tsx`
- All feature component/page files that import types
