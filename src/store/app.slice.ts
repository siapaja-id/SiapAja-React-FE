import { StateCreator } from 'zustand';
import { NavState, TabState } from '../types/domain.type';

export interface AppSlice {
  activeNav: NavState;
  activeTab: TabState;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  setActiveNav: (nav: NavState) => void;
  setActiveTab: (tab: TabState) => void;
  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  activeNav: 'home',
  activeTab: 'for-you',
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  setActiveNav: (nav) => set({ activeNav: nav }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
});