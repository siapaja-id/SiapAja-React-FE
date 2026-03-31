import { FeedItem, TaskData } from '@/src/shared/types/domain.type';

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
