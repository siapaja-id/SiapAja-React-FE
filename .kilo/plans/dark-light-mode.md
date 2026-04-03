# Dark/Light Mode Implementation Plan

## Overview

Add a dark/light mode toggle with auto-detect device preference to the existing theme settings page. The app is currently dark-mode-only with all colors hardcoded for dark backgrounds. This requires:

1. Adding a `themeMode` state to the Zustand store
2. Defining light-mode CSS variables alongside dark-mode variables
3. Creating a CSS class-based switching mechanism
4. Adding auto-detect via `prefers-color-scheme` media query
5. Adding the UI toggle in the Settings page
6. Updating component colors for proper contrast in light mode

---

## Phase 1: State Management & Types

### 1.1 Add `ThemeMode` type
**File:** `src/shared/types/app.types.ts`
- Add: `export type ThemeMode = 'dark' | 'light' | 'auto';`
- Add to `AppSlice` interface:
  - `themeMode: ThemeMode;`
  - `setThemeMode: (mode: ThemeMode) => void;`

### 1.2 Update constants
**File:** `src/shared/constants/domain.constant.ts`
- Add: `export const VALID_THEME_MODES: ThemeMode[] = ['dark', 'light', 'auto'];`

### 1.3 Update Zustand store slice
**File:** `src/store/app.slice.ts`
- Import `ThemeMode` and `VALID_THEME_MODES`
- Update `loadSettings()` to load `themeMode` (default: `'auto'`)
- Add initial state: `themeMode: saved.themeMode`
- Add action: `setThemeMode: (mode) => set({ themeMode })`

### 1.4 Update settings persistence
**File:** `src/App.hook.ts`
- Add `themeMode` to the localStorage subscription that saves settings
- Add `themeMode` to the CSS variable application effect

---

## Phase 2: CSS Variable System

### 2.1 Define light-mode color palette
**File:** `src/index.css`

Current dark palette:
```
background: #000000
surface: #050505
surface-container: #0D0D0D
surface-container-low: #121212
surface-container-lowest: #161616
surface-container-high: #1F1F1F
surface-container-highest: #2D2D2D
on-surface: #FFFFFF
on-surface-variant: #A1A1AA
outline-variant: #27272A
```

Proposed light palette (Material Design inspired):
```
background: #FFFFFF
surface: #FAFAFA
surface-container: #F5F5F5
surface-container-low: #F0F0F0
surface-container-lowest: #FFFFFF
surface-container-high: #E8E8E8
surface-container-highest: #E0E0E0
on-surface: #111111
on-surface-variant: #6B7280
outline-variant: #E5E7EB
```

### 2.2 Implement CSS class-based switching
**File:** `src/index.css`

Keep dark colors as `:root` defaults. Add `.light` class override:
```css
:root {
  /* dark colors (default) */
}

html.light {
  /* light colors */
  --color-background: #FFFFFF;
  --color-surface: #FAFAFA;
  /* ... all other light values */
}
```

### 2.3 Update body background gradient
**File:** `src/index.css`

Add light-mode gradient:
```css
body {
  background-image: radial-gradient(circle at 50% -20%, #0A0A0A 0%, #000000 100%);
}

html.light body {
  background-image: radial-gradient(circle at 50% -20%, #F8F8F8 0%, #FFFFFF 100%);
}
```

### 2.4 Update `.glass` and `.card-depth` classes
**File:** `src/index.css`

```css
.glass {
  @apply bg-surface-container-high/95 border border-outline-variant/50;
}

html:not(.light) .glass {
  @apply border-white/5;
}

.card-depth {
  @apply transition-colors duration-200 hover:bg-surface-container-low/40 border-b;
}

html:not(.light) .card-depth {
  @apply border-white/5;
}
```

---

## Phase 3: Theme Application Logic

### 3.1 Apply theme class to `<html>` element
**File:** `src/App.hook.ts`

In the `useApp` hook, add a `useEffect` that:
1. Reads `themeMode` from store
2. If `'auto'`: uses `window.matchMedia('(prefers-color-scheme: dark)')` to detect
3. If `'dark'` or `'light'`: uses the value directly
4. Adds/removes `light` class on `document.documentElement`
5. Listens for `prefers-color-scheme` changes when in `'auto'` mode

```typescript
useEffect(() => {
  const root = document.documentElement;
  
  const applyTheme = (mode: ThemeMode) => {
    let isDark = true;
    if (mode === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (mode === 'light') {
      isDark = false;
    }
    root.classList.toggle('light', !isDark);
  };

  applyTheme(themeMode);

  if (themeMode === 'auto') {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }
}, [themeMode]);
```

---

## Phase 4: Settings UI

### 4.1 Update `useSettings` hook
**File:** `src/features/settings/hooks/useSettings.ts`
- Add `themeMode` and `setThemeMode` from store
- Define mode options:
  ```typescript
  const themeModes: { id: ThemeMode; label: string; icon: string }[] = [
    { id: 'dark', label: 'Dark' },
    { id: 'light', label: 'Light' },
    { id: 'auto', label: 'Auto' },
  ];
  ```
- Return `themeMode`, `setThemeMode`, `themeModes`

### 4.2 Add Appearance section to Settings page
**File:** `src/features/settings/pages/Settings.Page.tsx`

Add a new card **above** the Theme Color card with a 3-segment toggle (Dark / Light / Auto), using the same animated indicator pattern as Text Size and Zoom controls. Use `Sun`, `Moon`, and `Monitor` icons from lucide-react.

```tsx
<div className="bg-surface-container-low border border-white/5 rounded-3xl p-5 shadow-lg">
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
      <Monitor size={20} />
    </div>
    <div>
      <h3 className="text-base font-black text-on-surface leading-tight mb-0.5">Appearance</h3>
      <p className="text-xs text-on-surface-variant font-medium">Choose your display mode</p>
    </div>
  </div>

  <div className="flex bg-surface-container-highest rounded-2xl p-1 relative border border-white/5">
    {themeModes.map((mode) => (
      <button key={mode.id} onClick={() => setThemeMode(mode.id)}
        className={`relative flex-1 py-3 text-sm font-bold transition-colors ${...}`}>
        {/* animated indicator */}
        <span className="relative z-10">{mode.label}</span>
      </button>
    ))}
  </div>
</div>
```

---

## Phase 5: Component Color Adjustments for Light Mode

The following patterns need updating across components to work in both modes:

### 5.1 White transparency overlays (`bg-white/X`, `border-white/X`)
These are invisible on light backgrounds. Replace with semantic alternatives:

| Dark Pattern | Light Pattern | Solution |
|---|---|---|
| `bg-white/5` | `bg-black/5` | Use `bg-on-surface/5` |
| `bg-white/10` | `bg-black/10` | Use `bg-on-surface/10` |
| `bg-white/20` | `bg-black/20` | Use `bg-on-surface/20` |
| `border-white/5` | `border-black/5` | Use `border-outline-variant` |
| `border-white/10` | `border-black/10` | Use `border-outline-variant` |

**Strategy:** Create CSS utility classes in `index.css` that handle both modes:
```css
.subtle-bg {
  @apply bg-on-surface/5;
}
html:not(.light) .subtle-bg {
  @apply bg-white/5;
}

.subtle-border {
  @apply border-outline-variant;
}
html:not(.light) .subtle-border {
  @apply border-white/5;
}
```

### 5.2 Black transparency overlays (`bg-black/X`)
These appear as dark smudges on light backgrounds:

| Component | Pattern | Fix |
|---|---|---|
| Overlays/Modals | `bg-black/80` | Use CSS variable `--overlay-bg` |
| Backdrops | `bg-black/40` | Use CSS variable `--backdrop-bg` |
| Stamps/Badges | `bg-black/60` | Use semantic color |

### 5.3 Hardcoded `bg-black` and `bg-white`
- `bg-black` containers (maps, video backgrounds): Keep as-is or use `bg-surface-container-lowest`
- `bg-white` text: Change to `text-on-surface` or `text-primary-foreground`
- `text-white` on colored backgrounds: Verify contrast in both modes

### 5.4 Priority files to update (highest impact)

1. **`src/index.css`** - Add CSS utility classes for cross-mode compatibility
2. **`src/shared/ui/SharedUI.Component.tsx`** - Core shared components
3. **`src/features/feed/components/FeedItems.Component.tsx`** - Feed posts
4. **`src/features/feed/components/FeedComposer.Component.tsx`** - Post composer
5. **`src/features/gigs/pages/Radar.Page.tsx`** - Gig cards
6. **`src/features/creation/components/AIChatRequest.Component.tsx`** - AI chat
7. **`src/features/chat/components/ChatRoom.Component.tsx`** - Chat bubbles
8. **`src/features/chat/pages/Inbox.Page.tsx`** - Inbox list
9. **`src/features/wallet/pages/Wallet.Page.tsx`** - Wallet page
10. **`src/features/profile/pages/Profile.Page.tsx`** - Profile page

### 5.5 Specific color adjustments by component

For each file, the pattern is:
- Replace `border-white/5`, `border-white/10` → `border-outline-variant`
- Replace `bg-white/5`, `bg-white/10` → `bg-on-surface/5`, `bg-on-surface/10`
- Replace `bg-black/40`, `bg-black/80` overlays → use a new CSS variable `--overlay-bg` that is dark in both modes (overlays should stay dark regardless of theme)
- Replace `text-white` → `text-on-surface` (except on colored backgrounds where white is intentional)
- Replace `hover:bg-white/5` → `hover:bg-on-surface/5`

---

## Phase 6: Testing & Verification

1. Verify auto-detect works by changing OS theme
2. Verify manual toggle overrides auto-detect
3. Verify settings persist across page reloads
4. Check all pages in both dark and light modes for contrast issues
5. Verify primary accent colors work in both modes

---

## Implementation Order

1. Phase 1: Types, constants, store (foundation)
2. Phase 2: CSS variables and class switching (visual foundation)
3. Phase 3: Theme application logic in App.hook.ts
4. Phase 4: Settings UI toggle
5. Phase 5: Component adjustments (start with SharedUI.Component.tsx, then work through feature components)
6. Phase 6: Manual testing

## Key Design Decisions

- **Default mode: `'auto'`** - Respects user's OS preference out of the box
- **CSS class approach** - Using `html.light` class rather than Tailwind `dark:` prefix for simpler migration
- **Overlays stay dark** - Modal backdrops and overlays should remain dark in light mode for proper focus
- **Semantic CSS variables** - New utility classes (`subtle-bg`, `subtle-border`) for cross-mode compatibility
- **Three options** - Dark, Light, Auto (not just Dark/Light)
