import { OrderData } from '@/src/shared/types/domain.type';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'selection' | 'summary' | 'welcome' | 'map-widget';
  data?: OrderData;
}

export interface AIChatRequestProps {
  onComplete: (data: OrderData) => void;
  onClose?: () => void;
  onBack?: () => void;
}

export type CreateType = 'social' | 'request' | null;

export interface SelectionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent: 'primary' | 'emerald';
}

export interface SocialFormProps {
  onPost: () => void;
}

export interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  delay: number;
}
