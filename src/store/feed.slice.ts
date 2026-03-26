import { StateCreator } from 'zustand';
import { FeedItem } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA } from '@/src/shared/constants/domain.constant';

export interface FeedSlice {
  feedItems: FeedItem[];
  replies: Record<string, FeedItem[]>;
  addFeedItem: (item: FeedItem) => void;
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => void;
  addReply: (parentId: string, reply: FeedItem) => void;
  setReplies: (parentId: string, replies: FeedItem[]) => void;
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set) => ({
  feedItems: SAMPLE_DATA,
  replies: {},
  addFeedItem: (item) => set((state) => ({ feedItems: [item, ...state.feedItems] })),
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => set((state) => {
    const newFeedItems = state.feedItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ) as FeedItem[];
    return { feedItems: newFeedItems };
  }),
  addReply: (parentId: string, reply: FeedItem) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: [reply, ...existingReplies]
      }
    };
  }),
  setReplies: (parentId: string, replies: FeedItem[]) => set((state) => ({
    replies: { ...state.replies, [parentId]: replies }
  })),
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    const newReplies = existingReplies.map(r => 
      r.id === replyId ? { ...r, ...updates } : r
    ) as FeedItem[];
    return {
      replies: {
        ...state.replies,
        [parentId]: newReplies
      }
    };
  }),
});