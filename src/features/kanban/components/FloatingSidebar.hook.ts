import { useState } from 'react';
import {
  Home,
  Plus,
  User,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  ClipboardList,
  Wallet,
} from 'lucide-react';
import { useStore } from '@/src/store/main.store';

export const useFloatingSidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const setShowCreateModal = useStore(state => state.setShowCreateModal);

  const navItems = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/radar', icon: Zap, label: 'Radar' },
    { id: 'create', icon: Plus, label: 'Create', action: () => setShowCreateModal(true), isPrimary: true },
    { id: '/messages', icon: MessageCircle, label: 'Messages' },
    { id: '/orders', icon: ClipboardList, label: 'Orders' },
    { id: '/wallet', icon: Wallet, label: 'Wallet' },
    { id: '/profile', icon: User, label: 'Profile' }
  ];

  return {
    expanded,
    setExpanded,
    currentUser,
    openColumn,
    navItems,
    PanelLeftClose,
    PanelLeftOpen,
  };
};
