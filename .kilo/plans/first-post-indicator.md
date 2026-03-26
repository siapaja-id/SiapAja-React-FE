# Plan: Move "First Post" Indicator & Show on Detail Page

## Context
The "First" badge currently renders above the post header (absolute positioned at `-top-2.5`) in `BaseFeedCard`. The user wants it:
1. Moved **above the content** (between header and body), not above the post header
2. Shown on the **post detail page** when viewing a post that is the author's very first post on the platform

The current `isFirst` prop is based on feed array index (`idx === 0`), which just means "first item in the feed". The new approach uses an `isFirstPost` data field to represent the user's first-ever post on the platform.

## Changes

### 1. Add `isFirstPost` field to data types
**File:** `src/shared/types/domain.type.ts`
- Add `isFirstPost?: boolean` to `SocialPostData`, `TaskData`, and `EditorialData`

### 2. Set `isFirstPost` on sample data
**File:** `src/shared/constants/domain.constant.tsx`
- Add `isFirstPost: true` to the first sample item (`id: 'first-post-1'`, Alice Smith's post)

### 3. Remove `isFirst` prop from feed rendering
**File:** `src/App.tsx` (line 155)
- Remove `isFirst={idx === 0}` from `FeedItemRenderer`

### 4. Update `BaseFeedCard` to render badge inline above content
**File:** `src/features/feed/components/FeedItems.Component.tsx`
- Remove the absolute-positioned badge block (lines 254-261)
- Remove `isFirst` from `BaseFeedCard` props
- Add inline badge rendering between header and children div, using `data.isFirstPost`

### 5. Remove `isFirst` prop from SocialPost, TaskCard, EditorialCard
**File:** `src/features/feed/components/FeedItems.Component.tsx`
- Remove `isFirst={isFirst}` from BaseFeedCard calls in all three components
- Remove `isFirst` from destructured props in each component

### 6. Clean up `FeedItemProps` type
**File:** `src/features/feed/types/feed.types.ts`
- Remove `isFirst?: boolean` from `FeedItemProps`

### 7. Badge auto-shows on PostDetailPage for social/editorial
`BaseFeedCard` checks `data.isFirstPost`, so the badge automatically appears when rendering the main post in PostDetailPage.

### 8. Show badge on PostDetailPage for task posts
**File:** `src/features/feed/components/TaskMainContent.Component.tsx`
- Add the "First Post" badge below the header, gated on `task.isFirstPost`

## Files Modified
1. `src/shared/types/domain.type.ts` — add `isFirstPost` to 3 interfaces
2. `src/shared/constants/domain.constant.tsx` — set flag on sample data
3. `src/App.tsx` — remove `isFirst` prop
4. `src/features/feed/components/FeedItems.Component.tsx` — move badge inline, use `data.isFirstPost`
5. `src/features/feed/types/feed.types.ts` — remove `isFirst` from `FeedItemProps`
6. `src/features/feed/components/TaskMainContent.Component.tsx` — add badge for task detail
