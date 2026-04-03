# Fix: Excessive Shadows in Light Mode

## Problem

In light mode, shadows are too prominent on bottom sheets (BidSheet, ReviewSheet, CompletionSheet) and the TaskActionFooter. The issue stems from:

1. **`shadow-2xl`** - Tailwind's `shadow-2xl` is `0 25px 50px -12px rgba(0, 0, 0, 0.25)` — a heavy 25% black shadow that looks fine on dark backgrounds but creates harsh dark blobs on light surfaces
2. **Hardcoded `rgba(0,0,0,0.15)` shadows** — Used in `TaskActionFooter` (`shadow-[0_-10px_40px_rgba(0,0,0,0.15)]`) and `AIChatRequest` (`shadow-[0_-20px_40px_rgba(0,0,0,0.15)]`) — these are dark-mode-only values
3. **`shadow-2xl` on modals** — `CreateModal`, `FloatingSidebar`, `LinkPreview`, and other components also use `shadow-2xl` which is too heavy for light mode

## Solution

Add light-mode-specific shadow overrides in `index.css` and replace hardcoded dark shadows with CSS variable-based or mode-aware alternatives.

---

## Phase 1: Add Light-Mode Shadow Variables

### 1.1 Update `index.css` shadow variables

**File:** `src/index.css`

Current dark-mode shadow variables (lines 28-29):
```css
--shadow-glow: 0 0 20px rgba(255, 255, 255, 0.03);
--shadow-inner-glow: inset 0 1px 1px rgba(255, 255, 255, 0.05);
```

Add a new `--shadow-sheet` variable for bottom sheets:

```css
/* In :root (dark mode default) */
--shadow-sheet: 0 -10px 40px rgba(0, 0, 0, 0.3);

/* In html.light */
--shadow-sheet: 0 -4px 20px rgba(0, 0, 0, 0.08);
```

The light-mode shadow is ~3x lighter (8% vs 30% opacity) and tighter (4px/20px vs 10px/40px spread) to match Material Design light elevation guidelines.

### 1.2 Add CSS class for sheet shadows

**File:** `src/index.css`

Add a utility class that uses the CSS variable:

```css
.sheet-shadow {
  box-shadow: var(--shadow-sheet);
}
```

---

## Phase 2: Update Bottom Sheet Components

Replace `shadow-2xl` with `sheet-shadow` on all bottom sheet containers.

### 2.1 BidSheet.Component.tsx (line 30)
```tsx
// Before:
className="relative bg-surface-container-high border-t border-on-surface/5 rounded-t-[32px] p-6 pb-12 shadow-2xl"

// After:
className="relative bg-surface-container-high border-t border-on-surface/5 rounded-t-[32px] p-6 pb-12 sheet-shadow"
```

### 2.2 ReviewSheet.Component.tsx (line 28)
Same change: `shadow-2xl` → `sheet-shadow`

### 2.3 CompletionSheet.Component.tsx (line 28)
Same change: `shadow-2xl` → `sheet-shadow`

---

## Phase 3: Update Hardcoded Dark Shadows

### 3.1 TaskActionFooter.Component.tsx (line 84)
```tsx
// Before:
className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex flex-col gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] border-t border-on-surface/5"

// After:
className="fixed bottom-0 w-full max-w-2xl glass p-3 z-20 flex flex-col gap-3 sheet-shadow border-t border-on-surface/5"
```

### 3.2 AIChatRequest.Component.tsx (line 316)
```tsx
// Before:
className="absolute inset-x-0 bottom-0 h-[80vh] bg-surface rounded-t-[32px] overflow-hidden z-[100] flex flex-col border-t border-on-surface/5 shadow-[0_-20px_40px_rgba(0,0,0,0.15)]"

// After:
className="absolute inset-x-0 bottom-0 h-[80vh] bg-surface rounded-t-[32px] overflow-hidden z-[100] flex flex-col border-t border-on-surface/5 sheet-shadow"
```

---

## Phase 4: Review Other `shadow-2xl` Usages

Check if other components need adjustment. These use `shadow-2xl` but may be acceptable as-is since they're on smaller elements or overlays:

| Component | Line | Usage | Action |
|---|---|---|---|
| `SharedUI.Component.tsx` | 318 | Link preview card | **Change** to `sheet-shadow` — it's a floating card |
| `CreateModal.Component.tsx` | 53 | Create modal | **Keep** `shadow-2xl` — modal on overlay, dark backdrop |
| `FloatingSidebar.tsx` | 20 | Kanban sidebar | **Change** to `sheet-shadow` — light surface |
| `MatchSuccess.Component.tsx` | 106 | Success card | **Keep** — on overlay backdrop |
| `Payment.Page.tsx` | 102 | Payment icon | **Keep** — small element, decorative |
| `App.tsx` | 20 | Main app container | **Review** — may need lighter shadow in light mode |

### 4.1 SharedUI.Component.tsx — LinkPreview (line 318)
```tsx
// Before:
className="bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant rounded-2xl shadow-2xl overflow-hidden relative"

// After:
className="bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant rounded-2xl sheet-shadow overflow-hidden relative"
```

### 4.2 FloatingSidebar.tsx (line 20)
```tsx
// Before:
className="fixed left-0 top-0 bottom-0 z-50 glass border-r border-outline-variant flex flex-col py-6 items-center shadow-2xl transition-all duration-300 overflow-hidden"

// After:
className="fixed left-0 top-0 bottom-0 z-50 glass border-r border-outline-variant flex flex-col py-6 items-center sheet-shadow transition-all duration-300 overflow-hidden"
```

---

## Phase 5: Build Verification

1. Run `npx tsc --noEmit` — verify zero TypeScript errors
2. Run `npx vite build` — verify production build succeeds

---

## Shadow Value Reference

| Mode | `--shadow-sheet` | Visual Effect |
|---|---|---|
| Dark | `0 -10px 40px rgba(0, 0, 0, 0.3)` | Deep, soft upward shadow (matches dark bg) |
| Light | `0 -4px 20px rgba(0, 0, 0, 0.08)` | Subtle, tight elevation (8% opacity) |

This matches Material Design 3 elevation semantics where light mode uses lower-opacity, tighter shadows to avoid the "floating dark blob" effect.

---

## Files to Modify

1. `src/index.css` — Add `--shadow-sheet` variable and `.sheet-shadow` class
2. `src/features/feed/components/post-detail/BidSheet.Component.tsx` — `shadow-2xl` → `sheet-shadow`
3. `src/features/feed/components/post-detail/ReviewSheet.Component.tsx` — `shadow-2xl` → `sheet-shadow`
4. `src/features/feed/components/post-detail/CompletionSheet.Component.tsx` — `shadow-2xl` → `sheet-shadow`
5. `src/features/feed/components/post-detail/TaskActionFooter.Component.tsx` — hardcoded shadow → `sheet-shadow`
6. `src/features/creation/components/AIChatRequest.Component.tsx` — hardcoded shadow → `sheet-shadow`
7. `src/shared/ui/SharedUI.Component.tsx` — LinkPreview `shadow-2xl` → `sheet-shadow`
8. `src/features/kanban/components/FloatingSidebar.tsx` — `shadow-2xl` → `sheet-shadow`
