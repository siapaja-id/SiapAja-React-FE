import { StateCreator } from 'zustand';
import { NavState, TabState, Author } from '../types/domain.type';
import { MOCK_AUTHORS } from '../constants/domain.constant';

export interface AppSlice {
  activeNav: NavState;
  activeTab: TabState;
  showMatcher: boolean;
  showCreateModal: boolean;
  showChatRoom: boolean;
  currentUser: Author;
  setActiveNav: (nav: NavState) => void;
  setActiveTab: (tab: TabState) => void;
  setShowMatcher: (show: boolean) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowChatRoom: (show: boolean) => void;
  setCurrentUser: (user: Author) => void;
}

export const createAppSlice: StateCreator<AppSlice> = (set) => ({
  activeNav: 'home',
  activeTab: 'for-you',
  showMatcher: false,
  showCreateModal: false,
  showChatRoom: false,
  currentUser: MOCK_AUTHORS[0],
  setActiveNav: (nav) => set({ activeNav: nav }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setShowMatcher: (show) => set({ showMatcher: show }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowChatRoom: (show) => set({ showChatRoom: show }),
  setCurrentUser: (user) => set({ currentUser: user }),
});