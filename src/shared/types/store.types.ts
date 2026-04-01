import { AppSlice } from './app.types';
import { ChatMessage } from './chat.types';
import { FeedItem, TaskData, TaskStatus } from './feed.types';
import { OrderData } from './order.types';

export interface ChatSlice {
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
}

export interface FeedFilters {
  statusFilter?: TaskStatus[];
  categoryFilter?: string[];
  typeFilter?: ('social' | 'task' | 'editorial')[];
  searchQuery?: string;
}

export interface FeedSlice {
  feedItems: FeedItem[];
  replies: Record<string, FeedItem[]>;
  filters: FeedFilters;
  isLoading: boolean;
  lastUpdated: number | null;

  addFeedItem: (item: FeedItem) => void;
  updateFeedItem: <T extends FeedItem>(id: string, updates: Partial<T>) => void;
  removeFeedItem: (id: string) => void;

  addReply: (parentId: string, reply: FeedItem) => void;
  setReplies: (parentId: string, replies: FeedItem[]) => void;
  updateReply: <T extends FeedItem>(parentId: string, replyId: string, updates: Partial<T>) => void;
  removeReply: (parentId: string, replyId: string) => void;

  incrementVotes: (id: string, parentId?: string) => void;
  decrementVotes: (id: string, parentId?: string) => void;
  incrementReplies: (id: string, parentId?: string) => void;
  incrementReposts: (id: string, parentId?: string) => void;
  incrementShares: (id: string, parentId?: string) => void;

  updateTaskStatus: (id: string, status: TaskStatus) => void;
  assignTask: (id: string, worker: TaskData['assignedWorker'], bidAmount: string) => void;
  getTasksByStatus: (status: TaskStatus) => TaskData[];

  setFilters: (filters: FeedFilters) => void;
  clearFilters: () => void;
  getFilteredItems: () => FeedItem[];

  getItemById: (id: string) => FeedItem | undefined;
  setLoading: (loading: boolean) => void;
  refreshFeed: () => void;
  resetFeed: () => void;
}

export interface OrderSlice {
  orderToReview: OrderData | null;
  setOrderToReview: (order: OrderData | null) => void;
}

export type StoreState = AppSlice & FeedSlice & OrderSlice & ChatSlice;
