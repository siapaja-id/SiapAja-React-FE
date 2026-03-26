import { StateCreator } from 'zustand';
import { TabState, Author, CreationContext } from '@/src/shared/types/domain.type';
import { MOCK_AUTHORS } from '@/src/shared/constants/domain.constant';

export interface AppSlice {
  activeTab: TabState;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  creationContext: CreationContext | null;
  followedHandles: string[];
  setActiveTab: (tab: TabState) => void;
  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
  setCreationContext: (ctx: CreationContext | null) => void;
  toggleFollow: (handle: string) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  activeTab: 'for-you',
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
  setCurrentUser: (user) => set({ currentUser: user }),
  creationContext: null,
  setCreationContext: (ctx) => set({ creationContext: ctx }),
  followedHandles: [],
  toggleFollow: (handle) => set((state) => ({
    followedHandles: state.followedHandles.includes(handle)
      ? state.followedHandles.filter((h) => h !== handle)
      : [...state.followedHandles, handle]
  })),
});