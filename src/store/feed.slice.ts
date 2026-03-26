import { StateCreator } from 'zustand';
import { FeedItem } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA } from '@/src/shared/constants/domain.constant';

export interface FeedSlice {
  feedItems: FeedItem[];
  addFeedItem: (item: FeedItem) => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set) => ({
  feedItems: SAMPLE_DATA,
  addFeedItem: (item) => set((state) => ({ feedItems: [item, ...state.feedItems] })),
});