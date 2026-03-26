import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'emerald' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export interface UserAvatarProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isOnline?: boolean;
}

export interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: number;
  maxHeight?: number;
}

export interface TagBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'emerald' | 'default';
  className?: string;
}

export interface ExpandableTextProps {
  text: string;
  limit?: number;
  className?: string;
  buttonClassName?: string;
  suffix?: React.ReactNode;
}

export interface CheckoutHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
}

export interface CheckoutLayoutProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export interface DetailHeaderProps {
  onBack?: () => void;
  title: string;
  subtitle?: string;
  rightNode?: React.ReactNode;
  contentType?: string;
  viewCount?: number | string;
  currentlyViewing?: number | string;
}

export interface ReplyInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  buttonText?: string;
  avatarUrl?: string;
  onExpand?: () => void;
  onSubmit?: () => void;
}

export interface IconButtonProps {
  icon: React.ElementType;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  activeColor?: string;
  hoverBg?: string;
}

export interface PostActionsProps {
  votes: number;
  replies: number;
  reposts: number;
  shares: number;
  className?: string;
}
