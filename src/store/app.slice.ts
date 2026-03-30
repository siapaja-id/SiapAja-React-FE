import { StateCreator } from 'zustand';
import { TabState, Author, CreationContext } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';

export interface AppColumn {
  id: string;
  path: string;
  width: number;
  state?: any;
}

export interface AppSlice {
  activeTab: TabState;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  creationContext: CreationContext | null;
  initialAiQuery: string | null;
  followedHandles: string[];
  userVotes: Record<string, 1 | -1 | 0>;
  userReposts: string[];
  columns: AppColumn[];
  openColumn: (path: string, sourceId?: string, state?: any) => void;
  closeColumn: (id: string) => void;
  setColumnWidth: (id: string, width: number) => void;

  setActiveTab: (tab: TabState) => void;
  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  setInitialAiQuery: (query: string | null) => void;
  toggleFollow: (handle: string) => void;
  toggleVote: (id: string, value: 1 | -1) => void;
  toggleRepost: (id: string) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  activeTab: 'for-you',
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  columns: [{ id: 'main-col', path: '/', width: 420 }], // Default initial column
  setActiveTab: (tab) => set({ activeTab: tab }),
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
  openColumn: (path, sourceId, routeState) => set((state) => {
    const newCol: AppColumn = {
      id: `col-${Math.random().toString(36).substring(2, 9)}`,
      path,
      width: 420, // Default width
      state: routeState
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
});