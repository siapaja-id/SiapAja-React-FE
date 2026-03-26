import { FeedItem } from '@/src/shared/types/domain.type';

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
