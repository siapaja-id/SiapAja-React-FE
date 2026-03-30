# Plan: Per-Column `activeTab` State

## Problem
`activeTab` is a single global value in the Zustand store. Opening two Home columns on desktop and switching the tab in one switches it in both. The existing `layoutId={`tab-${columnId}`}` workaround only prevents animation collisions, not state sharing.

## Approach
Move `activeTab` from a global store property into each `AppColumn` object. Add a `setColumnActiveTab` action. Update `HomePage` to read/write tab state from the column it's rendered in.

## Changes

### 1. `src/store/app.slice.ts`

- Add `activeTab?: TabState` to the `AppColumn` interface (optional for backward compat with non-Home columns like profile/post detail)
- Add `setColumnActiveTab: (columnId: string, tab: TabState) => void` to `AppSlice` interface
- Initialize the default column with `activeTab: 'for-you'`:
  ```ts
  columns: [{ id: 'main-col', path: '/', width: 420, activeTab: 'for-you' }]
  ```
- Add `setColumnActiveTab` implementation:
  ```ts
  setColumnActiveTab: (columnId, tab) => set((state) => ({
    columns: state.columns.map(c => c.id === columnId ? { ...c, activeTab: tab } : c)
  }))
  ```
- Remove the global `activeTab` property and `setActiveTab` from the interface and initial state (only `Home.Page.tsx` uses it — confirmed via grep)

### 2. `src/features/feed/pages/Home.Page.tsx`

- Replace global store reads with column-scoped reads:
  ```ts
  // Before:
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);

  // After:
  const columns = useStore(state => state.columns);
  const setColumnActiveTab = useStore(state => state.setColumnActiveTab);
  const column = columns.find(c => c.id === columnId);
  const activeTab = column?.activeTab ?? 'for-you';
  ```
- Update tab click handler: `setColumnActiveTab(columnId, tab)` instead of `setActiveTab(tab)`

## Verification
- Run `npm run lint` (tsc --noEmit) to confirm no type errors
- Two Home columns on desktop should independently track their selected tab
