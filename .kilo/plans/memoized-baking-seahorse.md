# Plan: Add Follow Button on Post Detail (Inline with Profile Header)

## Goal
Add a follow button positioned inline with the author's profile header on the post detail page. The button should only appear when viewing another user's post (not your own), and should support toggle (follow/unfollow) state.

## Files to Modify

1. **`src/store/app.slice.ts`** — Add `followedHandles: string[]` state and `toggleFollow(handle: string)` action
2. **`src/features/feed/components/FeedItems.Component.tsx`** — Add follow button in `BaseFeedCard` header area, inline with author info, visible only on `isMain` view for non-own posts
3. **`src/features/profile/pages/Profile.Page.tsx`** — Wire the existing Follow button to use `toggleFollow` from the store (replacing static button)

## Implementation Details

### 1. `src/store/app.slice.ts`
- Add `followedHandles: string[]` (default `[]`) to `AppSlice` interface and initial state
- Add `toggleFollow: (handle: string) => void` — adds handle if not present, removes if present

### 2. `src/features/feed/components/FeedItems.Component.tsx` — `BaseFeedCard`
- Import `UserPlus` and `UserCheck` from lucide-react
- Import `useStore` to access `followedHandles` and `toggleFollow`
- In the header row (line ~231), after the timestamp/more-button area, add a follow button when:
  - `isMain` is true (detail view only)
  - `!resolvedIsAuthor` (not viewing own post)
- Button style: small pill button matching Profile.Page follow button style (`rounded-full px-3 py-1 text-[10px]`)
- Show `UserPlus + Follow` when not following, `UserCheck + Following` when following
- Animated with framer-motion for micro-interaction feel

### 3. `src/features/profile/pages/Profile.Page.tsx`
- Wire the existing Follow/Unfollow button to call `toggleFollow(user.handle)` from the store
- Conditionally render Follow vs Following based on `followedHandles.includes(user.handle)`

## Verification
- Open post detail of another user's post → follow button should appear inline right of the timestamp
- Click follow → button toggles to "Following" state
- Navigate to profile of that user → follow button state should match
- Open own post detail → no follow button shown
- Run `npm run build` to verify no type errors
