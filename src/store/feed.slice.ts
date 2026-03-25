import { StateCreator } from 'zustand';
import { FeedItem } from '../types/domain.type';
import { SAMPLE_DATA } from '../constants/domain.constant';

export interface FeedSlice {
  feedItems: FeedItem[];
  selectedPost: FeedItem | null;
  setSelectedPost: (post: FeedItem | null) => void;
  addFeedItem: (item: FeedItem) => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set) => ({
  feedItems: SAMPLE_DATA,
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
  addFeedItem: (item) => set((state) => ({ feedItems: [item, ...state.feedItems] })),
});