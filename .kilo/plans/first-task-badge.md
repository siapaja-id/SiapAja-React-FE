# Plan: Add "First Task" Badge (Independent from "First Post")

## Context
The user wants a "First Task" badge for a user's first task creation on the platform, independent from the existing "First Post" badge. A user can have both a "First Post" on their social post AND a "First Task" on their first task.

## Changes

### 1. Add `isFirstTask?: boolean` to `TaskData`
**File:** `src/shared/types/domain.type.ts` (line 72)
- Add `isFirstTask?: boolean;` after the existing `isFirstPost?: boolean;`

### 2. Set `isFirstTask: true` on sample task
**File:** `src/shared/constants/domain.constant.tsx` (line 42)
- Add `isFirstTask: true` to the task with `id: 'task-empty-1'` (Bob Jones's "Need a quick logo animation")

### 3. Add "First Task" badge in `BaseFeedCard`
**File:** `src/features/feed/components/FeedItems.Component.tsx` (after line 260)
- Add badge block after the "First Post" badge, gated on `'isFirstTask' in data && data.isFirstTask && !isQuote && !isParent`
- Use primary color scheme (`bg-primary`) to visually distinguish from the emerald "First Post" badge

### 4. Add "First Task" badge in `TaskMainContent`
**File:** `src/features/feed/components/TaskMainContent.Component.tsx` (after line 72)
- Add badge block after the "First Post" badge, gated on `task.isFirstTask`
- Same primary color scheme

## Files Modified
1. `src/shared/types/domain.type.ts` — add `isFirstTask` to `TaskData`
2. `src/shared/constants/domain.constant.tsx` — flag sample task
3. `src/features/feed/components/FeedItems.Component.tsx` — add badge in BaseFeedCard
4. `src/features/feed/components/TaskMainContent.Component.tsx` — add badge in detail view
