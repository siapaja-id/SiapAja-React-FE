import React from 'react';
import { TASK_STATUS } from '@/src/shared/constants/domain.constant';
import { Author } from './auth.types';

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface EngagementStats {
  replies: number;
  reposts: number;
  shares: number;
  votes: number;
}

export interface MediaContent {
  images?: string[];
  video?: string;
  voiceNote?: string;
}

export interface BidInfo {
  amount: string;
  status: BidStatus;
}

export interface ThreadInfo {
  count: number;
  index: number;
}

export interface CreationContext {
  parentId: string;
  type: 'social' | 'task' | 'editorial';
  authorHandle: string;
  content: string;
  avatarUrl: string;
  taskTitle?: string;
  taskPrice?: string;
}

export interface SocialPostData {
  id: string;
  type: 'social';
  author: Author;
  content: string;
  media?: MediaContent;
  timestamp: string;
  engagement: EngagementStats;
  replyAvatars?: string[];
  bid?: BidInfo;
  quote?: FeedItem;
  thread?: ThreadInfo;
  isFirstPost?: boolean;
}

export interface TaskData {
  id: string;
  type: 'task';
  author: Author;
  category: string;
  title: string;
  description: string;
  price: string;
  timestamp: string;
  status: TaskStatus;
  icon: React.ReactNode;
  details?: string;
  tags?: string[];
  meta?: string;
  engagement: EngagementStats;
  mapUrl?: string;
  media?: MediaContent;
  quote?: FeedItem;
  isFirstPost?: boolean;
  isFirstTask?: boolean;
  assignedWorker?: Author;
  acceptedBidAmount?: string;
}

export interface EditorialData {
  id: string;
  type: 'editorial';
  author: Author;
  tag: string;
  title: string;
  excerpt: string;
  timestamp: string;
  engagement: EngagementStats;
  quote?: FeedItem;
  isFirstPost?: boolean;
}

export type FeedItem = SocialPostData | TaskData | EditorialData;

export interface FeedItemProps {
  data: FeedItem;
  onClick?: () => void;
  isMain?: boolean;
  isParent?: boolean;
  hasLineBelow?: boolean;
  isQuote?: boolean;
}

export interface MediaCarouselProps {
  images: string[];
  className?: string;
  aspect?: string;
}

export interface ThreadBlock {
  id: string;
  content: string;
}

export interface BidSheetProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBid: number;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  bidAmount: number;
  onBidAmountChange: (amount: number) => void;
  onSubmit: () => void;
}

export interface CompletionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
}

export interface ReviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  onSubmit: () => void;
}

export interface EmptyRepliesStateProps {
  postType: FeedItem['type'];
  isCreator: boolean;
  onBidClick?: () => void;
  onFocusReply?: () => void;
}

export interface TaskActionFooterProps {
  task: TaskData;
  isCreator: boolean;
  isAssignedToMe: boolean;
  isNegotiable: boolean;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSendMessage: () => void;
  onBid: () => void;
  onAccept: () => void;
  onStartTask: () => void;
  onShowComplete: () => void;
  onShowReview: () => void;
  onFullscreenReply: () => void;
}

export interface BaseFeedCardProps {
  data: FeedItem;
  onClick?: () => void;
  avatarContent?: React.ReactNode;
  headerMeta?: React.ReactNode;
  children: React.ReactNode;
}

export interface SocialPostProps {
  data: SocialPostData;
  onClick?: () => void;
}

export interface TaskCardProps {
  data: TaskData;
  onClick?: () => void;
}

export interface EditorialCardProps {
  data: EditorialData;
  onClick?: () => void;
}

export interface TaskMainContentProps {
  task: TaskData;
}

export interface StatusIndicatorProps {
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: 'default' | 'emerald';
}
