import { StateCreator } from 'zustand';
import { FeedItem } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA } from '@/src/shared/constants/domain.constant';

export interface FeedSlice {
  feedItems: FeedItem[];
  replies: Record<string, FeedItem[]>;
  addFeedItem: (item: FeedItem) => void;
  updateFeedItem: (id: string, updates: Partial<FeedItem>) => void;
  addReply: (parentId: string, reply: FeedItem) => void;
  setReplies: (parentId: string, replies: FeedItem[]) => void;
  updateReply: (parentId: string, replyId: string, updates: Partial<FeedItem>) => void;
}

export const createFeedSlice: StateCreator<FeedSlice> = (set) => ({
  feedItems: SAMPLE_DATA,
  replies: {},
  addFeedItem: (item) => set((state) => ({ feedItems: [item, ...state.feedItems] })),
  updateFeedItem: (id: string, updates: Partial<FeedItem>) => set((state) => {
    const newFeedItems: FeedItem[] = state.feedItems.map(item => item.id === id ? { ...item, ...updates } as FeedItem : item);
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
  updateReply: (parentId: string, replyId: string, updates: Partial<FeedItem>) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    const newReplies: FeedItem[] = existingReplies.map(r => r.id === replyId ? { ...r, ...updates } as FeedItem : r);
    return {
      replies: {
        ...state.replies,
        [parentId]: newReplies
      }
    };
  }),
});