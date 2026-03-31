import React from 'react';
import {
  Home,
  Search,
  MessageCircle,
  ClipboardList,
  UserCircle,
  FileText,
  Zap,
  CreditCard,
  Pencil,
  Settings,
  ShoppingCart,
} from 'lucide-react';

export const getColumnMeta = (path: string): { icon: React.ElementType; label: string } => {
  if (path === '/') return { icon: Home, label: 'Home' };
  if (path === '/radar') return { icon: Zap, label: 'Radar' };
  if (path === '/messages') return { icon: MessageCircle, label: 'Messages' };
  if (path === '/orders') return { icon: ShoppingCart, label: 'Orders' };
  if (path === '/profile') return { icon: UserCircle, label: 'Profile' };
  if (path === '/create-post') return { icon: Pencil, label: 'New Post' };
  if (path === '/review-order') return { icon: FileText, label: 'Review Order' };
  if (path === '/payment') return { icon: CreditCard, label: 'Payment' };
  if (path === '/settings') return { icon: Settings, label: 'Settings' };
  if (path.startsWith('/post/')) return { icon: FileText, label: 'Post' };
  if (path.startsWith('/task/')) return { icon: ClipboardList, label: 'Task' };
  return { icon: Search, label: 'Column' };
};