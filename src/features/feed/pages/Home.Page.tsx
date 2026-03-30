import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedComposer } from '@/src/features/feed/components/FeedComposer.Component';
import { FeedItemRenderer } from '@/src/features/feed/components/FeedItems.Component';
import { useStore } from '@/src/store/main.store';
import { UserAvatar } from '@/src/shared/ui/SharedUI.Component';
import { ChevronUp } from 'lucide-react';
import { ColumnContext } from '@/src/App';

export const HomePage: React.FC = () => {
  const activeTab = useStore(state => state.activeTab);
  const setActiveTab = useStore(state => state.setActiveTab);
  const feedItems = useStore(state => state.feedItems);
  const currentUser = useStore(state => state.currentUser);
  const openColumn = useStore(state => state.openColumn);
  const { id: columnId } = React.useContext(ColumnContext);

  return (
    <div className="relative pb-10">
      {/* Restored Header for the Home Column */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 will-change-transform mb-4">
        <div className="flex justify-between items-center px-4 h-16">
          <button onClick={() => openColumn('/profile', columnId)} className="hover:opacity-80 transition-opacity">
            <UserAvatar src={currentUser.avatar} size="md" isOnline={true} />
          </button>
          <div className="flex space-x-6">
            {['for-you', 'around-you'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`text-sm font-semibold relative py-1 capitalize ${activeTab === tab ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {tab.replace('-', ' ')}
                {activeTab === tab && <motion.div layoutId={`tab-${columnId}`} className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
          <button onClick={() => openColumn('/profile', columnId)} className="flex items-center gap-1 bg-surface-container-high border border-white/10 rounded-full px-3 py-1 hover:bg-white/5 transition-colors shadow-sm">
            <span className="text-emerald-400 font-black text-[13px]">{currentUser.karma || '98'}</span>
            <ChevronUp size={14} className="text-emerald-400" strokeWidth={3} />
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <FeedComposer />
          {feedItems.map((item) => (
            <FeedItemRenderer key={item.id} data={item} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
