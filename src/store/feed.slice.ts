import { StateCreator } from 'zustand';
import { FeedItem, TaskData, TaskStatus } from '@/src/shared/types/domain.type';
import { SAMPLE_DATA, TASK_STATUS } from '@/src/shared/constants/domain.constant';

export interface FeedFilters {
  statusFilter?: TaskStatus[];
  categoryFilter?: string[];
  typeFilter?: ('social' | 'task' | 'editorial')[];
  searchQuery?: string;
}

export interface FeedSlice {
  // State
  feedItems: FeedItem[];
  replies: Record<string, FeedItem[]>;
  filters: FeedFilters;
  isLoading: boolean;
  lastUpdated: number | null;

  // Basic CRUD operations
  addFeedItem: (item: FeedItem) => void;
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => void;
  removeFeedItem: (id: string) => void;
  
  // Reply operations
  addReply: (parentId: string, reply: FeedItem) => void;
  setReplies: (parentId: string, replies: FeedItem[]) => void;
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => void;
  removeReply: (parentId: string, replyId: string) => void;

  // Engagement operations (real-time updates)
  incrementVotes: (id: string, parentId?: string) => void;
  decrementVotes: (id: string, parentId?: string) => void;
  incrementReplies: (id: string, parentId?: string) => void;
  incrementReposts: (id: string, parentId?: string) => void;
  incrementShares: (id: string, parentId?: string) => void;

  // Task-specific operations
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => void;
  getTasksByStatus: (status: TaskStatus) => TaskData[];

  // Filter operations
  setFilters: (filters: FeedFilters) => void;
  clearFilters: () => void;
  getFilteredItems: () => FeedItem[];

  // Utility operations
  getItemById: (id: string) => FeedItem | undefined;
  setLoading: (loading: boolean) => void;
  refreshFeed: () => void;
  resetFeed: () => void;
}

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
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, votes: (item.votes || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  decrementVotes: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id && (item.votes || 0) > 0 
          ? { ...item, votes: item.votes - 1 } 
          : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id && (item.votes || 0) > 0 
        ? { ...item, votes: item.votes - 1 } 
        : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementReplies: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, replies: (item.replies || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, replies: (item.replies || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementReposts: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, reposts: (item.reposts || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, reposts: (item.reposts || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
  }),

  incrementShares: (id: string, parentId?: string) => set((state) => {
    if (parentId) {
      const existingReplies = state.replies[parentId] || [];
      const newReplies = existingReplies.map(item =>
        item.id === id ? { ...item, shares: (item.shares || 0) + 1 } : item
      );
      return {
        replies: { ...state.replies, [parentId]: newReplies },
        lastUpdated: Date.now()
      };
    }
    const newFeedItems = state.feedItems.map(item =>
      item.id === id ? { ...item, shares: (item.shares || 0) + 1 } : item
    );
    return { feedItems: newFeedItems, lastUpdated: Date.now() };
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
        item.type !== 'task' || filters.statusFilter!.includes(item.status as TaskStatus)
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