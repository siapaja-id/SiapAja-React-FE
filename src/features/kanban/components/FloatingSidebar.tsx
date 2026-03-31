import React, { useState } from 'react';
import {
  Home,
  Plus,
  User,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  ClipboardList,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';

export const FloatingSidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const setShowCreateModal = useStore(state => state.setShowCreateModal);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);

  const navItems = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/radar', icon: Zap, label: 'Radar' },
    { id: 'create', icon: Plus, label: 'Create', action: () => setShowCreateModal(true), isPrimary: true },
    { id: '/messages', icon: MessageCircle, label: 'Messages', action: () => setShowChatRoom(true) },
    { id: '/orders', icon: ClipboardList, label: 'Orders' },
    { id: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: expanded ? 240 : 80 }}
      className="fixed left-0 top-0 bottom-0 z-50 glass border-r border-white/5 flex flex-col py-6 items-center shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <button 
        onClick={() => setExpanded(!expanded)} 
        className={`p-3 rounded-xl hover:bg-white/5 text-on-surface-variant transition-colors mb-8 ${expanded ? 'self-end mr-4' : 'self-center'}`}
      >
        {expanded ? <PanelLeftClose size={24} /> : <PanelLeftOpen size={24} />}
      </button>

      <div className="flex flex-col gap-4 w-full px-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              if (item.action) item.action();
              else openColumn(item.id);
            }}
            className={`flex items-center ${expanded ? 'gap-4 justify-start' : 'gap-0 justify-center'} p-3 rounded-2xl transition-all group overflow-hidden whitespace-nowrap
              ${item.isPrimary ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:scale-105' : 'text-on-surface-variant hover:bg-white/5 hover:text-white'}`}
          >
            <div className="shrink-0 flex items-center justify-center">
              <item.icon size={24} strokeWidth={item.isPrimary ? 3 : 2} />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold tracking-wide"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col w-full px-4 gap-4">
        <button 
          onClick={() => openColumn('/profile')} 
          className={`flex items-center gap-3 p-2 rounded-2xl border border-white/10 bg-surface-container-low hover:bg-white/5 transition-colors overflow-hidden ${expanded ? 'justify-start' : 'justify-center'}`}
        >
          <div className="shrink-0">
            <UserAvatar src={currentUser.avatar} size="sm" isOnline={true} />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start"
              >
                <span className="text-xs font-bold truncate w-24 text-left">{currentUser.name}</span>
                <span className="text-2sm text-emerald-400 font-black">{currentUser.karma} karma</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
};