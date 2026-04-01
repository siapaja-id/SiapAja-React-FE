import { StateCreator } from 'zustand';
import { FeedItem, TaskData, TaskStatus } from '@/src/shared/types/feed.types';
import { SAMPLE_DATA, TASK_STATUS } from '@/src/shared/constants/domain.constant';
import { FeedSlice, FeedFilters } from '@/src/shared/types/store.types';

export type { FeedSlice, FeedFilters } from '@/src/shared/types/store.types';

export const createFeedSlice: StateCreator<FeedSlice> = (set, get) => ({
  // Initial state
  feedItems: SAMPLE_DATA,
  replies: {},
  filters: {},
  isLoading: false,
  lastUpdated: Date.now(),

  // Basic CRUD operations
  addFeedItem: (item) => set((state) => ({ 
    feedItems: [item, ...state.feedItems],
    lastUpdated: Date.now()
  })),
  
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, ...updates } as FeedItem : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),
  
  removeFeedItem: (id: string) => set((state) => ({
    feedItems: state.feedItems.filter(item => item.id !== id),
    lastUpdated: Date.now()
  })),

  // Reply operations
  addReply: (parentId: string, reply: FeedItem) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: [reply, ...existingReplies]
      },
      lastUpdated: Date.now()
    };
  }),
  
  setReplies: (parentId: string, replies: FeedItem[]) => set((state) => ({
    replies: { ...state.replies, [parentId]: replies },
    lastUpdated: Date.now()
  })),
  
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    const newReplies = existingReplies.map(r =>
      r.id === replyId ? { ...r, ...updates } as FeedItem : r
    );
    return {
      replies: {
        ...state.replies,
        [parentId]: newReplies
      },
      lastUpdated: Date.now()
    };
  }),

  removeReply: (parentId: string, replyId: string) => set((state) => {
    const existingReplies = state.replies[parentId] || [];
    return {
      replies: {
        ...state.replies,
        [parentId]: existingReplies.filter(r => r.id !== replyId)
      },
      lastUpdated: Date.now()
    };
  }),

  // Engagement operations (real-time updates)
  incrementVotes: (id: string, parentId?: string) => set((state) => {
    const updateEngagement = (item: FeedItem): FeedItem => {
      if (item.id !== id) return item;
      const current = item.engagement;
      return { ...item, engagement: { ...current, votes: current.votes + 1 } };
    };
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      return { replies: { ...state.replies, [parentId]: existingReplies.map(updateEngagement) }, lastUpdated: Date.now() };
    }
    return { feedItems: state.feedItems.map(updateEngagement), lastUpdated: Date.now() };
  }),

  decrementVotes: (id: string, parentId?: string) => set((state) => {
    const updateEngagement = (item: FeedItem): FeedItem => {
      if (item.id !== id || item.engagement.votes <= 0) return item;
      const current = item.engagement;
      return { ...item, engagement: { ...current, votes: current.votes - 1 } };
    };
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      return { replies: { ...state.replies, [parentId]: existingReplies.map(updateEngagement) }, lastUpdated: Date.now() };
    }
    return { feedItems: state.feedItems.map(updateEngagement), lastUpdated: Date.now() };
  }),

  incrementReplies: (id: string, parentId?: string) => set((state) => {
    const updateEngagement = (item: FeedItem): FeedItem => {
      if (item.id !== id) return item;
      const current = item.engagement;
      return { ...item, engagement: { ...current, replies: current.replies + 1 } };
    };
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      return { replies: { ...state.replies, [parentId]: existingReplies.map(updateEngagement) }, lastUpdated: Date.now() };
    }
    return { feedItems: state.feedItems.map(updateEngagement), lastUpdated: Date.now() };
  }),

  incrementReposts: (id: string, parentId?: string) => set((state) => {
    const updateEngagement = (item: FeedItem): FeedItem => {
      if (item.id !== id) return item;
      const current = item.engagement;
      return { ...item, engagement: { ...current, reposts: current.reposts + 1 } };
    };
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      return { replies: { ...state.replies, [parentId]: existingReplies.map(updateEngagement) }, lastUpdated: Date.now() };
    }
    return { feedItems: state.feedItems.map(updateEngagement), lastUpdated: Date.now() };
  }),

  incrementShares: (id: string, parentId?: string) => set((state) => {
    const updateEngagement = (item: FeedItem): FeedItem => {
      if (item.id !== id) return item;
      const current = item.engagement;
      return { ...item, engagement: { ...current, shares: current.shares + 1 } };
    };
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      return { replies: { ...state.replies, [parentId]: existingReplies.map(updateEngagement) }, lastUpdated: Date.now() };
    }
    return { feedItems: state.feedItems.map(updateEngagement), lastUpdated: Date.now() };
  }),

  // Task-specific operations
  updateTaskStatus: (id: string, status: TaskStatus) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && item.type === 'task' 
        ? { ...item, status } as TaskData 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => set((state) => {
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && item.type === 'task' 
        ? { 
            ...item, 
            status: TASK_STATUS.ASSIGNED,
            assignedWorker: worker,
            acceptedBidAmount: bidAmount
          } as TaskData 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  getTasksByStatus: (status: TaskStatus) => {
    const state = get();
    return state.feedItems.filter(
      (item): item is TaskData => item.type === 'task' && item.status === status
    );
  },

  // Filter operations
  setFilters: (filters: FeedFilters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    lastUpdated: Date.now()
  })),

  clearFilters: () => set(() => ({
    filters: {},
    lastUpdated: Date.now()
  })),

  getFilteredItems: () => {
    const state = get();
    const { feedItems, filters } = state;
    let filtered = [...feedItems];

    if (filters.statusFilter && filters.statusFilter.length > 0) {
      filtered = filtered.filter(item =>
        item.type !== 'task' || filters.statusFilter!.includes(item.status)
      );
    }

    if (filters.categoryFilter && filters.categoryFilter.length > 0) {
      filtered = filtered.filter(item => 
        item.type !== 'task' || filters.categoryFilter!.includes(item.category)
      );
    }

    if (filters.typeFilter && filters.typeFilter.length > 0) {
      filtered = filtered.filter(item => 
        filters.typeFilter!.includes(item.type)
      );
    }

    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (item.type === 'social') return item.content.toLowerCase().includes(query);
        if (item.type === 'task') return item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        if (item.type === 'editorial') return item.title.toLowerCase().includes(query) || item.excerpt.toLowerCase().includes(query);
        return false;
      });
    }

    return filtered;
  },

  // Utility operations
  getItemById: (id: string) => {
    const state = get();
    return state.feedItems.find(item => item.id === id);
  },

  setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),

  refreshFeed: () => set(() => ({
    feedItems: SAMPLE_DATA,
    lastUpdated: Date.now()
  })),

  resetFeed: () => set(() => ({
    feedItems: SAMPLE_DATA,
    replies: {},
    filters: {},
    isLoading: false,
    lastUpdated: Date.now()
  })),
});