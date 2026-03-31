import { StateCreator } from 'zustand';
import { TabState, Author, CreationContext, Gig } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS, GIGS } from '@/src/shared/constants/domain.constant';

export type ThemeColor = 'red' | 'blue' | 'emerald' | 'violet' | 'amber';
export type TextSize = 'sm' | 'md' | 'lg';
export type ZoomLevel = 90 | 100 | 110 | 120;

export interface AppColumn {
  id: string;
  path: string;
  width: number;
  state?: any;
  activeTab?: TabState;
}

export interface AppSlice {
  isDesktop: boolean;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  creationContext: CreationContext | null;
  initialAiQuery: string | null;
  followedHandles: string[];
  userVotes: Record<string, 1 | -1 | 0>;
  userReposts: string[];
  themeColor: ThemeColor;
  textSize: TextSize;
  zoomLevel: ZoomLevel;
  activeGig: Gig | null;
  queuedGigs: Gig[];
  isAutoPilot: boolean;
  
  columns: AppColumn[];
  openColumn: (path: string, sourceId?: string, state?: any) => void;
  closeColumn: (id: string) => void;
  setColumnWidth: (id: string, width: number) => void;
  setIsDesktop: (isDesktop: boolean) => void;
  setColumnActiveTab: (columnId: string, tab: TabState) => void;

  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  setInitialAiQuery: (query: string | null) => void;
  toggleFollow: (handle: string) => void;
  toggleVote: (id: string, value: 1 | -1) => void;
  toggleRepost: (id: string) => void;
  setThemeColor: (color: ThemeColor) => void;
  setTextSize: (size: TextSize) => void;
  setZoomLevel: (zoom: ZoomLevel) => void;
  
  setActiveGig: (gig: Gig | null) => void;
  addQueuedGig: (gig: Gig) => void;
  setIsAutoPilot: (isAuto: boolean) => void;
}

const STORAGE_KEY = 'siapaja-settings';

const VALID_THEME_COLORS: ThemeColor[] = ['red', 'blue', 'emerald', 'violet', 'amber'];
const VALID_TEXT_SIZES: TextSize[] = ['sm', 'md', 'lg'];
const VALID_ZOOM_LEVELS: ZoomLevel[] = [90, 100, 110, 120];

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { themeColor: 'red' as ThemeColor, textSize: 'md' as TextSize, zoomLevel: 100 as ZoomLevel };
    const parsed = JSON.parse(raw);
    return {
      themeColor: VALID_THEME_COLORS.includes(parsed.themeColor) ? parsed.themeColor : 'red' as ThemeColor,
      textSize: VALID_TEXT_SIZES.includes(parsed.textSize) ? parsed.textSize : 'md' as TextSize,
      zoomLevel: VALID_ZOOM_LEVELS.includes(parsed.zoomLevel) ? parsed.zoomLevel : 100 as ZoomLevel,
    };
  } catch {
    return { themeColor: 'red' as ThemeColor, textSize: 'md' as TextSize, zoomLevel: 100 as ZoomLevel };
  }
}

export const createAppSlice: StateCreator<AppSlice> = (set) => {
  const saved = loadSettings();
  return {
  isDesktop: window.innerWidth >= 768,
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  columns: [{ id: 'main-col', path: '/', width: 420, activeTab: 'for-you' as TabState }],
  activeGig: null,
  queuedGigs: [],
  isAutoPilot: false,
  themeColor: saved.themeColor,
  textSize: saved.textSize,
  zoomLevel: saved.zoomLevel,
  setThemeColor: (themeColor) => set({ themeColor }),
  setTextSize: (textSize) => set({ textSize }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setIsDesktop: (isDesktop) => set({ isDesktop }),
  setColumnActiveTab: (columnId, tab) => set((state) => ({
    columns: state.columns.map(c => c.id === columnId ? { ...c, activeTab: tab } : c)
  })),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
  setCurrentUser: (user) => set({ currentUser: user }),
  creationContext: null,
  setCreationContext: (ctx) => set({ creationContext: ctx }),
  initialAiQuery: null,
  setInitialAiQuery: (query) => set({ initialAiQuery: query }),
  followedHandles: [],
  userVotes: {},
  userReposts: [],
  toggleFollow: (handle) => set((state) => ({
    followedHandles: state.followedHandles.includes(handle)
      ? state.followedHandles.filter((h) => h !== handle)
      : [...state.followedHandles, handle]
  })),
  toggleVote: (id, value) => set((state) => {
    const current = state.userVotes[id] || 0;
    const next = current === value ? 0 : value;
    return { userVotes: { ...state.userVotes, [id]: next } };
  }),
  toggleRepost: (id) => set((state) => ({
    userReposts: state.userReposts.includes(id)
      ? state.userReposts.filter(rid => rid !== id)
      : [...state.userReposts, id]
  })),
  setActiveGig: (gig) => set({ activeGig: gig }),
  addQueuedGig: (gig) => set((state) => ({ 
    queuedGigs: [...state.queuedGigs, gig] 
  })),
  setIsAutoPilot: (isAuto) => set({ isAutoPilot: isAuto }),
  
  openColumn: (path, sourceId, routeState) => set((state) => {
    const newCol: AppColumn = {
      id: `col-${Math.random().toString(36).substring(2, 9)}`,
      path,
      width: 420, // Default width
      state: routeState,
      activeTab: path === '/' ? 'for-you' : undefined
    };

    if (sourceId) {
      const index = state.columns.findIndex(c => c.id === sourceId);
      if (index !== -1) {
        const newCols = [...state.columns];
        newCols.splice(index + 1, 0, newCol); // Insert right after source column
        return { columns: newCols };
      }
    }
    return { columns: [...state.columns, newCol] };
  }),
  closeColumn: (id) => set((state) => ({
    columns: state.columns.filter(c => c.id !== id)
  })),
  setColumnWidth: (id, width) => set((state) => ({
    columns: state.columns.map(c => c.id === id ? { ...c, width } : c)
  })),
  };
};