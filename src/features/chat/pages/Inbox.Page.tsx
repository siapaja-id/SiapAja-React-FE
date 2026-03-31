import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Briefcase } from 'lucide-react';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { useStore } from '@/src/store/main.store';
import { SAMPLE_INBOX_THREADS, CATEGORY_ICONS } from '@/src/shared/constants/domain.constant';

export const InboxPage: React.FC = () => {
  const setActiveChat = useStore(state => state.setActiveChat);
  const setShowChatRoom = useStore(state => state.setShowChatRoom);
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Tasks'>('All');

  const handleOpenChat = (thread: any) => {
    setActiveChat(thread);
    setShowChatRoom(true);
  };

  const filters = ['All', 'Unread', 'Tasks'];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto hide-scrollbar pb-20">
      <div className="sticky top-0 z-20 bg-surface-container-high/95 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center">
        <h1 className="text-xl font-black uppercase tracking-widest text-on-surface">Inbox</h1>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-colors"><Search size={20} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full text-on-surface-variant transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="p-4 flex gap-2 overflow-x-auto hide-scrollbar border-b border-white/5">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-2sm font-bold uppercase tracking-wider whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-on-surface-variant hover:bg-white/10'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-white/5">
        {SAMPLE_INBOX_THREADS.map(thread => (
          <motion.button
            key={thread.id}
            onClick={() => handleOpenChat(thread)}
            className="w-full text-left p-4 card-depth hover:bg-white/5 transition-colors flex gap-4 items-start relative group"
            whileTap={{ scale: 0.98 }}
          >
            <div className="shrink-0 relative">
              {thread.participants.length > 1 ? (
                <div className="relative w-12 h-12">
                  <UserAvatar src={thread.participants[0].avatar} size="lg" className="absolute top-0 left-0 z-10 border-[3px] border-background" />
                  <UserAvatar src={thread.participants[1].avatar} size="md" className="absolute bottom-0 right-0 z-20 border-[3px] border-background" />
                </div>
              ) : (
                <UserAvatar src={thread.participants[0].avatar} size="xl" isOnline={thread.participants[0].isOnline} />
              )}
            </div>
            
            <div className="flex-grow min-w-0 flex flex-col gap-1">
              <div className="flex justify-between items-center gap-2">
                <h3 className={`text-base font-bold truncate ${thread.unreadCount > 0 ? 'text-on-surface' : 'text-on-surface-variant/90'}`}>
                  {thread.participants.map(p => p.name).join(', ')}
                </h3>
                <span className={`text-2xs font-bold shrink-0 ${thread.unreadCount > 0 ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                  {thread.lastMessageTime}
                </span>
              </div>
              
              {thread.taskContext && (
                <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-emerald-400 mb-0.5">
                  <span className="opacity-80 flex-shrink-0">
                    {CATEGORY_ICONS[thread.taskContext.category] || <Briefcase size={12} />}
                  </span>
                  <span className="truncate">{thread.taskContext.title}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center gap-4">
                <p className={`text-sm truncate leading-snug ${thread.unreadCount > 0 ? 'text-on-surface font-medium' : 'text-on-surface-variant/70'}`}>
                  {thread.lastMessage}
                </p>
                {thread.unreadCount > 0 && (
                  <span className="shrink-0 bg-primary text-white text-2xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};