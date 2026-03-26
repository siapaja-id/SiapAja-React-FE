import { Gig } from '@/src/shared/types/domain.type';

export interface MatchSuccessProps {
  gig: Gig;
  onContinue: () => void;
  onClose: () => void;
}

export interface GigCardProps {
  gig: Gig;
  onSwipe: (direction: 'left' | 'right') => void;
  isTop: boolean;
  index: number;
  swipeDirection: 'left' | 'right' | null;
}

export interface GigInfoBlockProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
